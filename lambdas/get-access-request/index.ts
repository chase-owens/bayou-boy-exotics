import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

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

  const result = await dynamodb.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: {
          S: userId,
        },
      },
    }),
  );

  if (!result.Item) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        message: "Access request not found",
      }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      userId: result.Item.userId?.S ?? "",
      email: result.Item.email?.S ?? "",
      name: result.Item.name?.S ?? "",
      phone: result.Item.phone?.S ?? "",
      status: result.Item.status?.S ?? "pending",
      requestedAt: result.Item.requestedAt?.S ?? "",
      approvedAt: result.Item.approvedAt?.S,
      deniedAt: result.Item.deniedAt?.S,
    }),
  };
};
