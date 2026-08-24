import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({});

const TABLE_NAME = process.env.ACCESS_REQUESTS_TABLE_NAME;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const handler = async () => {
  if (!TABLE_NAME) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Access request configuration is missing",
      }),
    };
  }

  const result = await dynamodb.send(
    new ScanCommand({
      TableName: TABLE_NAME,
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
      approvedAt: item.approvedAt?.S,
      deniedAt: item.deniedAt?.S,
    })) ?? [];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(requests),
  };
};
