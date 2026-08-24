import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { randomUUID } from "node:crypto";

const s3 = new S3Client({});
const cloudfront = new CloudFrontClient({});

const BUCKET_NAME = process.env.CONTENT_BUCKET_NAME;
const CLIENT_DISTRIBUTION_ID = process.env.CLIENT_DISTRIBUTION_ID;
const ADMIN_DISTRIBUTION_ID = process.env.ADMIN_DISTRIBUTION_ID;

const CONTENT_KEY = "data/root.json";
const CONTENT_PATH = "/data/root.json";

const jsonResponse = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,PUT",
  },
  body: JSON.stringify(body),
});

const invalidateDistribution = async (distributionId: string | undefined) => {
  if (!distributionId) return;

  await cloudfront.send(
    new CreateInvalidationCommand({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: `${Date.now()}-${randomUUID()}`,
        Paths: {
          Quantity: 1,
          Items: [CONTENT_PATH],
        },
      },
    }),
  );
};

export const handler = async (event: APIGatewayProxyEvent) => {
  if (!BUCKET_NAME) {
    return jsonResponse(500, {
      message: "CONTENT_BUCKET_NAME is required",
    });
  }

  if (!event.body) {
    return jsonResponse(400, {
      message: "Request body is required",
    });
  }

  try {
    const root = JSON.parse(event.body);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: CONTENT_KEY,
        Body: JSON.stringify(root, null, 2),
        ContentType: "application/json",
      }),
    );

    await Promise.all([
      invalidateDistribution(CLIENT_DISTRIBUTION_ID),
      invalidateDistribution(ADMIN_DISTRIBUTION_ID),
    ]);

    return jsonResponse(200, {
      message: "Site updated",
    });
  } catch (error) {
    console.error("Failed to update site", error);

    return jsonResponse(500, {
      message: "Failed to update site",
    });
  }
};
