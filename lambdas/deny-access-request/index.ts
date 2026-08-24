import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({});

const TABLE_NAME = process.env.ACCESS_REQUESTS_TABLE_NAME;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const handler = async (event: {
  pathParameters?: {
    userId?: string;
  };
}) => {
  if (!TABLE_NAME) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "ACCESS_REQUESTS_TABLE_NAME is required",
      }),
    };
  }

  const userId = event.pathParameters?.userId;

  if (!userId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "userId is required",
      }),
    };
  }

  const deniedAt = new Date().toISOString();

  await dynamodb.send(
    new UpdateItemCommand({
      TableName: TABLE_NAME,

      Key: {
        userId: {
          S: userId,
        },
      },

      UpdateExpression:
        "SET #status = :status, deniedAt = :deniedAt REMOVE approvedAt",

      ExpressionAttributeNames: {
        "#status": "status",
      },

      ExpressionAttributeValues: {
        ":status": {
          S: "denied",
        },

        ":deniedAt": {
          S: deniedAt,
        },
      },

      ConditionExpression: "attribute_exists(userId)",
    }),
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      userId,
      status: "denied",
      deniedAt,
    }),
  };
};
