import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
  public readonly reservationsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Instantiate Buckets
    const clientBucket = new s3.Bucket(this, "BayouClientBucket", {
      bucketName: "bayou-client-prod",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    const adminBucket = new s3.Bucket(this, "BayouAdminBucket", {
      bucketName: "bayou-admin-prod",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    const contentBucket = new s3.Bucket(this, "BayouContentBucket", {
      bucketName: "bayou-content-prod",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    // bayou-boys
    const clientUserPool = new cognito.UserPool(this, "BayouClientUserPool", {
      userPoolName: "bayou-boys",

      selfSignUpEnabled: true,

      signInAliases: {
        email: true,
      },

      autoVerify: {
        email: true,
      },

      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        fullname: {
          required: true,
          mutable: true,
        },
        phoneNumber: {
          required: true,
          mutable: true,
        },
      },

      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },

      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,

      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const clientUserPoolClient = clientUserPool.addClient(
      "BayouClientUserPoolClient",
      {
        userPoolClientName: "bayou-client",
        generateSecret: false,

        authFlows: {
          userSrp: true,
          userPassword: true,
        },
      },
    );

    // team-bayou
    const adminUserPool = new cognito.UserPool(this, "BayouAdminUserPool", {
      userPoolName: "team-bayou",

      selfSignUpEnabled: false,

      signInAliases: {
        email: true,
      },

      autoVerify: {
        email: true,
      },

      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },

      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,

      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const adminUserPoolClient = adminUserPool.addClient(
      "BayouAdminUserPoolClient",
      {
        userPoolClientName: "bayou-admin",
        generateSecret: false,

        authFlows: {
          userSrp: true,
          userPassword: true,
        },
      },
    );

    // Access Request Table
    const accessRequestsTable = new dynamodb.Table(
      this,
      "BayouAccessRequestsTable",
      {
        tableName: "bayou-access-requests-prod",

        partitionKey: {
          name: "userId",
          type: dynamodb.AttributeType.STRING,
        },

        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    );

    accessRequestsTable.addGlobalSecondaryIndex({
      indexName: "status-index",

      partitionKey: {
        name: "status",
        type: dynamodb.AttributeType.STRING,
      },

      sortKey: {
        name: "requestedAt",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Instantiate client and admin distributions
    const clientDistribution = new cloudfront.Distribution(
      this,
      "BayouClientDistribution",
      {
        defaultRootObject: "index.html",
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(clientBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          functionAssociations: [],
        },
        additionalBehaviors: {
          "data/*": {
            origin:
              origins.S3BucketOrigin.withOriginAccessControl(contentBucket),
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
          "images/*": {
            origin:
              origins.S3BucketOrigin.withOriginAccessControl(contentBucket),
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      },
    );

    // user api
    const api = new apigateway.RestApi(this, "BayouApi", {
      restApiName: "bayou-api",

      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    const adminAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      "BayouAdminAuthorizer",
      {
        cognitoUserPools: [adminUserPool],
      },
    );

    const clientAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      "BayouClientAuthorizer",
      {
        cognitoUserPools: [clientUserPool],
      },
    );

    const createAccessRequestLambda = new lambda.Function(
      this,
      "CreateAccessRequestLambda",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "../../lambdas/dist/create-access-request"),
        ),
        environment: {
          ACCESS_REQUESTS_TABLE_NAME: accessRequestsTable.tableName,
        },
      },
    );

    const listAccessRequestsLambda = new lambda.Function(
      this,
      "ListAccessRequestsLambda",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "../../lambdas/dist/list-access-requests"),
        ),
        environment: {
          ACCESS_REQUESTS_TABLE_NAME: accessRequestsTable.tableName,
          STATUS_INDEX_NAME: "status-index",
        },
      },
    );

    const approveAccessRequestLambda = new lambda.Function(
      this,
      "ApproveAccessRequestLambda",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "../../lambdas/dist/approve-access-request"),
        ),
        environment: {
          ACCESS_REQUESTS_TABLE_NAME: accessRequestsTable.tableName,
        },
      },
    );

    const denyAccessRequestLambda = new lambda.Function(
      this,
      "DenyAccessRequestLambda",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "../../lambdas/dist/deny-access-request"),
        ),
        environment: {
          ACCESS_REQUESTS_TABLE_NAME: accessRequestsTable.tableName,
        },
      },
    );
    const getAccessRequestLambda = new lambda.Function(
      this,
      "GetAccessRequestLambda",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "../../lambdas/dist/get-access-request"),
        ),
        environment: {
          ACCESS_REQUESTS_TABLE_NAME: accessRequestsTable.tableName,
        },
      },
    );

    accessRequestsTable.grantReadData(getAccessRequestLambda);

    accessRequestsTable.grantWriteData(createAccessRequestLambda);

    accessRequestsTable.grantReadData(listAccessRequestsLambda);

    accessRequestsTable.grantReadWriteData(approveAccessRequestLambda);

    accessRequestsTable.grantReadWriteData(denyAccessRequestLambda);

    const accessRequests = api.root.addResource("access-requests");

    accessRequests.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createAccessRequestLambda),
    );

    const admin = api.root.addResource("admin");
    const adminAccessRequests = admin.addResource("access-requests");

    adminAccessRequests.addMethod(
      "GET",
      new apigateway.LambdaIntegration(listAccessRequestsLambda),
      {
        authorizationType: apigateway.AuthorizationType.COGNITO,
        authorizer: adminAuthorizer,
      },
    );

    const adminAccessRequest = adminAccessRequests.addResource("{userId}");

    adminAccessRequest
      .addResource("approve")
      .addMethod(
        "PATCH",
        new apigateway.LambdaIntegration(approveAccessRequestLambda),
        {
          authorizationType: apigateway.AuthorizationType.COGNITO,
          authorizer: adminAuthorizer,
        },
      );

    adminAccessRequest
      .addResource("deny")
      .addMethod(
        "PATCH",
        new apigateway.LambdaIntegration(denyAccessRequestLambda),
        {
          authorizationType: apigateway.AuthorizationType.COGNITO,
          authorizer: adminAuthorizer,
        },
      );

    accessRequests
      .addResource("{userId}")
      .addMethod(
        "GET",
        new apigateway.LambdaIntegration(getAccessRequestLambda),
        {
          authorizationType: apigateway.AuthorizationType.COGNITO,
          authorizer: clientAuthorizer,
        },
      );

    // Build Tables
    this.reservationsTable = new dynamodb.Table(
      this,
      "BayouReservationsTable",
      {
        tableName: "bayou-reservations-prod",
        partitionKey: {
          name: "reservationId",
          type: dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    );

    // Outputs
    new cdk.CfnOutput(this, "ClientUserPoolId", {
      value: clientUserPool.userPoolId,
    });

    new cdk.CfnOutput(this, "ClientUserPoolClientId", {
      value: clientUserPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "AdminUserPoolId", {
      value: adminUserPool.userPoolId,
    });

    new cdk.CfnOutput(this, "AdminUserPoolClientId", {
      value: adminUserPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
    });

    new cdk.CfnOutput(this, "ClientDistributionDomain", {
      value: clientDistribution.distributionDomainName,
    });
  }
}
