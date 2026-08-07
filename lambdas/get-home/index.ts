import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import jsonResponse from "../util/jsonResponse";

const s3 = new S3Client({});

const BUCKET_NAME = process.env.CONTENT_BUCKET_NAME;
const HOME_KEY = process.env.HOME_KEY ?? "data/home.json";

export const handler = async () => {
  if (!BUCKET_NAME) {
    return jsonResponse(500, { message: "BUCKET_NAME is required" });
  }

  try {
    const result = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: HOME_KEY }),
    );

    const body = await result.Body?.transformToString();

    if (!body) {
      return jsonResponse(404, { message: "Home file not found" });
    }

    return jsonResponse(200, body, true);
  } catch (err) {
    return jsonResponse(500, { message: "Failed to get homepage data" });
  }
};
