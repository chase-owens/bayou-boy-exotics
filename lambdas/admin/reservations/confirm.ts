import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({});
const sns = new SNSClient({});

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

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

  const claims = event.requestContext.authorizer?.claims;
  const adminUserId = claims?.sub;

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

  const meetupAddress = body.meetupAddress?.trim();
  const confirmationMessage = body.confirmationMessage?.trim();

  if (!meetupAddress) {
    return {
      statusCode: 400,
      headers,
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

    const reservation = result.Attributes;

    let smsSent = false;
    let emailSent = false;

    if (reservation?.customerPhone) {
      try {
        await sns.send(
          new PublishCommand({
            PhoneNumber: reservation.customerPhone,
            Message: [
              "Your reservation has been confirmed.",
              `Location: ${meetupAddress}`,
              confirmationMessage || null,
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

    if (reservation?.customerEmail) {
      try {
        await ses.send(
          new SendEmailCommand({
            FromEmailAddress: "bayouboy318@myyahoo.com",
            Destination: {
              ToAddresses: [reservation.customerEmail],
            },
            Content: {
              Simple: {
                Subject: {
                  Data: "Your reservation is confirmed",
                },
                Body: {
                  Text: {
                    Data: [
                      "Your reservation has been confirmed.",
                      `Location: ${meetupAddress}`,
                      confirmationMessage || null,
                    ]
                      .filter(Boolean)
                      .join("\n"),
                  },
                },
              },
            },
          }),
        );

        emailSent = true;
      } catch (error) {
        console.error("Failed to send reservation confirmation email", error);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reservation,
        smsSent,
        emailSent,
      }),
    };
  } catch (error: any) {
    if (error?.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({
          message: "Reservation has already been updated",
        }),
      };
    }

    console.error("Failed to confirm reservation", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Failed to confirm reservation",
      }),
    };
  }
};
