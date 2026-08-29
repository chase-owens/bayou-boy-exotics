import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.RESERVATIONS_TABLE_NAME!;
const STATUS_INDEX_NAME = process.env.STATUS_INDEX_NAME ?? "status-index";

export const handler = async () => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: STATUS_INDEX_NAME,

      KeyConditionExpression: "#status = :status",

      ExpressionAttributeNames: {
        "#status": "status",
      },

      ExpressionAttributeValues: {
        ":status": "submitted",
      },

      ScanIndexForward: false,
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      reservations: result.Items ?? [],
    }),
  };
};
