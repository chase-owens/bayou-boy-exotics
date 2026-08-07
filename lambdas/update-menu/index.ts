import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { MenuContent } from "../../shared/types/Menu";
import jsonResponse from "../util/jsonResponse";

const s3 = new S3Client({});
const cloudfront = new CloudFrontClient({});

const BUCKET_NAME = process.env.CONTENT_BUCKET_NAME;
const MENU_KEY = process.env.MENU_KEY ?? "data/menu.json";

export type UpdateMenuLambda = { menu: MenuContent };

export const handler = async (event: any) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return jsonResponse(200, { ok: true });
  }

  if (!BUCKET_NAME) {
    return jsonResponse(500, { message: "BUCKET_NAME is required" });
  }

  try {
    const payload = JSON.parse(event.body || "{}") as UpdateMenuLambda;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: MENU_KEY,
        Body: JSON.stringify(payload, null, 2),
        ContentType: "application/json",
      }),
    );

    await cloudfront.send(
      new CreateInvalidationCommand({
        DistributionId: process.env.DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: Date.now().toString(),
          Paths: {
            Quantity: 1,
            Items: ["/data/menu.json"],
          },
        },
      }),
    );

    return jsonResponse(200, { menu: payload });
  } catch (err) {
    return jsonResponse(500, "Update menu error");
  }
};
