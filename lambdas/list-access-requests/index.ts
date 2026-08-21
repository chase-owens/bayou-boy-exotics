import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({});

const TABLE_NAME = process.env.ACCESS_REQUESTS_TABLE_NAME;
const STATUS_INDEX_NAME = process.env.STATUS_INDEX_NAME;

export const handler = async () => {
  if (!TABLE_NAME || !STATUS_INDEX_NAME) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Access request configuration is missing",
      }),
    };
  }

  const result = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: STATUS_INDEX_NAME,

      KeyConditionExpression: "#status = :status",

      ExpressionAttributeNames: {
        "#status": "status",
      },

      ExpressionAttributeValues: {
        ":status": {
          S: "pending",
        },
      },

      ScanIndexForward: true,
    }),
  );

  const requests =
    result.Items?.map((item) => ({
      userId: item.userId?.S ?? "",
      email: item.email?.S ?? "",
      name: item.name?.S ?? "",
      phone: item.phone?.S ?? "",
      status: item.status?.S ?? "pending",
      requestedAt: item.requestedAt?.S ?? "",
    })) ?? [];

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requests),
  };
};
