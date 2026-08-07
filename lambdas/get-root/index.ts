import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import jsonResponse from "../util/jsonResponse";

const s3 = new S3Client({});

const BUCKET_NAME = process.env.CONTENT_BUCKET_NAME;
const ROOT_DATA_KEY = process.env.ROOT_DATA_KEY ?? "data/root.json";

export const handler = async () => {
  if (!BUCKET_NAME) {
    return jsonResponse(500, { message: "BUCKET_NAME is required" });
  }

  try {
    const result = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: ROOT_DATA_KEY }),
    );

    const body = await result.Body?.transformToString();

    if (!body) {
      return jsonResponse(404, { message: "Root data file not found" });
    }

    return jsonResponse(200, body, true);
  } catch (err) {
    return jsonResponse(500, { message: "Failed to get root data" });
  }
};
