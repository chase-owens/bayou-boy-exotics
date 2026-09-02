import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const sns = new SNSClient({});

const TABLE_NAME = process.env.RESERVATIONS_TABLE_NAME!;

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
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  if (!reservationId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Missing reservationId" }),
    };
  }

  const body = JSON.parse(event.body ?? "{}");
  const cancellationMessage = body.message?.trim();

  if (!cancellationMessage) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "Cancellation message is required",
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
          SET #status = :cancelled,
              cancelledAt = :cancelledAt,
              cancelledBy = :cancelledBy,
              cancellationMessage = :cancellationMessage
        `,

        ExpressionAttributeNames: {
          "#status": "status",
        },

        ExpressionAttributeValues: {
          ":cancelled": "cancelled",
          ":cancelledAt": new Date().toISOString(),
          ":cancelledBy": adminUserId,
          ":cancellationMessage": cancellationMessage,
        },

        ReturnValues: "ALL_NEW",
      }),
    );

    const reservation = result.Attributes;

    if (reservation?.customerPhone) {
      await sns.send(
        new PublishCommand({
          PhoneNumber: reservation.customerPhone,
          Message: cancellationMessage,
        }),
      );
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reservation,
      }),
    };
  } catch (error) {
    console.error("Failed to cancel reservation", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Failed to cancel reservation",
      }),
    };
  }
};
