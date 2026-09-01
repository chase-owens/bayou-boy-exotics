import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.RESERVATIONS_TABLE_NAME!;

const allowedStatuses = new Set([
  "submitted",
  "confirmed",
  "completed",
  "cancelled",
]);

const allowedOrigins = new Set([
  "http://localhost:5174",
  "https://admin.bayouboyexotics.com",
]);

const getCorsHeaders = (origin?: string) => ({
  "Access-Control-Allow-Origin":
    origin && allowedOrigins.has(origin)
      ? origin
      : "https://admin.bayouboyexotics.com",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "PATCH,OPTIONS",
});

export const handler = async (event: any) => {
  const origin = event.headers?.origin ?? event.headers?.Origin;
  const headers = getCorsHeaders(origin);

  const adminUserId = event.requestContext.authorizer?.claims?.sub;
  const reservationId = event.pathParameters?.reservationId;

  if (!adminUserId) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        message: "Unauthorized",
      }),
    };
  }

  if (!reservationId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "Missing reservationId",
      }),
    };
  }

  const body = JSON.parse(event.body ?? "{}");
  const status = body.status;

  if (!allowedStatuses.has(status)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "Invalid reservation status",
      }),
    };
  }

  try {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,

        Key: {
          reservationId,
        },

        UpdateExpression: `
          SET #status = :status,
              updatedAt = :updatedAt,
              updatedBy = :updatedBy
        `,

        ExpressionAttributeNames: {
          "#status": "status",
        },

        ExpressionAttributeValues: {
          ":status": status,
          ":updatedAt": new Date().toISOString(),
          ":updatedBy": adminUserId,
        },

        ReturnValues: "ALL_NEW",
      }),
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reservation: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Failed to update reservation status", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Failed to update reservation status",
      }),
    };
  }
};
