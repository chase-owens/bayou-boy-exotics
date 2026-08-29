import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.RESERVATIONS_TABLE_NAME!;

export const handler = async (event: any) => {
  const claims = event.requestContext.authorizer?.claims;
  const adminUserId = claims?.sub;

  const reservationId = event.pathParameters?.reservationId;

  if (!adminUserId) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Unauthorized",
      }),
    };
  }

  if (!reservationId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing reservationId",
      }),
    };
  }

  const body = JSON.parse(event.body ?? "{}");

  const meetupAddress = body.meetupAddress?.trim();
  const confirmationMessage = body.confirmationMessage?.trim();

  if (!meetupAddress) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Meetup address is required",
      }),
    };
  }

  const confirmedAt = new Date().toISOString();

  try {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,

        Key: {
          reservationId,
        },

        UpdateExpression: `
          SET #status = :confirmed,
              confirmedAt = :confirmedAt,
              confirmedBy = :confirmedBy,
              meetupAddress = :meetupAddress,
              confirmationMessage = :confirmationMessage
        `,

        ConditionExpression: "#status = :submitted",

        ExpressionAttributeNames: {
          "#status": "status",
        },

        ExpressionAttributeValues: {
          ":submitted": "submitted",
          ":confirmed": "confirmed",
          ":confirmedAt": confirmedAt,
          ":confirmedBy": adminUserId,
          ":meetupAddress": meetupAddress,
          ":confirmationMessage": confirmationMessage ?? "",
        },

        ReturnValues: "ALL_NEW",
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        reservation: result.Attributes,
      }),
    };
  } catch (error: any) {
    if (error?.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Reservation has already been updated",
        }),
      };
    }

    console.error("Failed to confirm reservation", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to confirm reservation",
      }),
    };
  }
};
