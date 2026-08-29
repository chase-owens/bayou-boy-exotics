import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.RESERVATIONS_TABLE_NAME!;

export const handler = async (event: any) => {
  const claims = event.requestContext.authorizer?.claims;

  const userId = claims?.sub;
  const customerName = claims?.name;
  const customerPhone = claims?.phone_number;

  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Unauthorized",
      }),
    };
  }

  const body = JSON.parse(event.body ?? "{}");

  if (!body.items?.length || !body.meet || typeof body.total !== "number") {
    return {
      statusCode: 400,
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

  return {
    statusCode: 201,
    body: JSON.stringify({
      reservationId,
      status: reservation.status,
    }),
  };
};
