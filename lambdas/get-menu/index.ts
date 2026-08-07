import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import jsonResponse from "../util/jsonResponse";

const s3 = new S3Client({});

const BUCKET_NAME = process.env.CONTENT_BUCKET_NAME;
const MENU_KEY = process.env.MENU_KEY ?? "data/menu.json";

export const handler = async () => {
  if (!BUCKET_NAME) {
    return jsonResponse(500, { message: "BUCKET_NAME is required" });
  }

  try {
    const result = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: MENU_KEY }),
    );

    const body = await result.Body?.transformToString();

    if (!body) {
      return jsonResponse(404, { message: "Menu file not found" });
    }

    return jsonResponse(200, body, true);
  } catch (err) {
    return jsonResponse(500, { message: "Failed to get menu" });
  }
};
