import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({});

const TABLE_NAME = process.env.ACCESS_REQUESTS_TABLE_NAME;

type CreateAccessRequestBody = {
  userId: string;
  email: string;
  name: string;
  phone: string;
};
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const handler = async (event: { body?: string | null }) => {
  if (!TABLE_NAME) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "ACCESS_REQUESTS_TABLE_NAME is required",
      }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "Request body is required",
      }),
    };
  }

  const body = JSON.parse(event.body) as CreateAccessRequestBody;

  const requestedAt = new Date().toISOString();

  await dynamodb.send(
    new PutItemCommand({
      TableName: TABLE_NAME,

      Item: {
        userId: {
          S: body.userId,
        },

        email: {
          S: body.email,
        },

        name: {
          S: body.name,
        },

        phone: {
          S: body.phone,
        },

        status: {
          S: "pending",
        },

        requestedAt: {
          S: requestedAt,
        },
      },

      ConditionExpression: "attribute_not_exists(userId)",
    }),
  );

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      userId: body.userId,
      status: "pending",
      requestedAt,
    }),
  };
};
