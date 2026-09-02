import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({});

const BUCKET_NAME = process.env.CONTENT_BUCKET_NAME!;

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
  "Access-Control-Allow-Methods": "DELETE,OPTIONS",
});

export const handler = async (event: any) => {
  const origin = event.headers?.origin ?? event.headers?.Origin;
  const headers = getCorsHeaders(origin);

  const body = JSON.parse(event.body ?? "{}");
  const key = body.key?.trim();

  if (!key) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "Image key is required.",
      }),
    };
  }

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }),
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        key,
      }),
    };
  } catch (error) {
    console.error("Failed to delete image", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Unable to delete image.",
      }),
    };
  }
};
