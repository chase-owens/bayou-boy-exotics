import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.RESERVATIONS_TABLE_NAME!;

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
  "Access-Control-Allow-Methods": "POST,OPTIONS",
});

const sns = new SNSClient({});

export const handler = async (event: any) => {
  const origin = event.headers?.origin ?? event.headers?.Origin;
  const headers = getCorsHeaders(origin);

  const claims = event.requestContext.authorizer?.claims;

  const userId = claims?.sub;
  const customerName = claims?.name;
  const customerPhone = claims?.phone_number;
  const customerEmail = claims?.email;

  if (!userId) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        message: "Unauthorized",
      }),
    };
  }

  const body = JSON.parse(event.body ?? "{}");

  if (!body.items?.length || !body.meet || typeof body.total !== "number") {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "Invalid reservation payload",
      }),
    };
  }

  const reservationId = randomUUID();

  const reservation = {
    reservationId,
    userId,

    customerName: customerName ?? "",
    customerPhone: customerPhone ?? "",
    customerEmail: customerEmail ?? "",

    items: body.items,
    total: body.total,
    meet: body.meet,

    status: "submitted",
    submittedAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: reservation,
    }),
  );

  let smsSent = false;

  if (reservation?.customerPhone) {
    try {
      await sns.send(
        new PublishCommand({
          PhoneNumber: "+12147042331",
          Message: [
            "Your reservation has been received.",
            `Customer Phone: ${reservation.customerPhone}`,
            JSON.stringify(body.items),
          ]
            .filter(Boolean)
            .join("\n"),
          MessageAttributes: {
            "AWS.SNS.SMS.SMSType": {
              DataType: "String",
              StringValue: "Transactional",
            },
          },
        }),
      );

      smsSent = true;
    } catch (error) {
      console.error("Failed to send reservation confirmation SMS", error);
    }
  }

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      reservationId,
      smsSent,
      status: reservation.status,
    }),
  };
};
