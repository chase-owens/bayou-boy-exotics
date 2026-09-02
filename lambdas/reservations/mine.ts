import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.RESERVATIONS_TABLE_NAME!;
const USER_INDEX_NAME = process.env.USER_INDEX_NAME!;

const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://bayouboyexotics.com",
  "https://www.bayouboyexotics.com",
]);

const getCorsHeaders = (origin?: string) => ({
  "Access-Control-Allow-Origin":
    origin && allowedOrigins.has(origin)
      ? origin
      : "https://bayouboyexotics.com",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
});

export const handler = async (event: any) => {
  const origin = event.headers?.origin ?? event.headers?.Origin;
  const headers = getCorsHeaders(origin);

  const userId = event.requestContext.authorizer?.claims?.sub;

  if (!userId) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        message: "Unauthorized",
      }),
    };
  }

  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: USER_INDEX_NAME,

        KeyConditionExpression: "userId = :userId",

        ExpressionAttributeValues: {
          ":userId": userId,
        },

        ScanIndexForward: false,
      }),
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reservations: result.Items ?? [],
      }),
    };
  } catch (error) {
    console.error("Failed to load user reservations", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Unable to load reservations.",
      }),
    };
  }
};
