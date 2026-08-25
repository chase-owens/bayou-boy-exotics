import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import type { APIGatewayProxyEvent } from "aws-lambda";

const s3 = new S3Client({});

const BUCKET_NAME = process.env.CONTENT_BUCKET_NAME;
const IMAGE_ROOT = "images/";

const jsonResponse = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
  },
  body: JSON.stringify(body),
});

const normalizePrefix = (prefix?: string) => {
  if (!prefix) return "";

  const clean = prefix
    .replace(/^\/+/, "")
    .replace(/^images\//, "")
    .replace(/\.\./g, "");

  if (!clean) return "";

  return clean.endsWith("/") ? clean : `${clean}/`;
};

export const handler = async (event: APIGatewayProxyEvent) => {
  if (!BUCKET_NAME) {
    return jsonResponse(500, {
      message: "CONTENT_BUCKET_NAME is required",
    });
  }

  try {
    const relativePrefix = normalizePrefix(event.queryStringParameters?.prefix);

    const prefix = `${IMAGE_ROOT}${relativePrefix}`;

    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        Delimiter: "/",
      }),
    );

    const folders = (result.CommonPrefixes ?? [])
      .map(({ Prefix }) => {
        if (!Prefix) return null;

        const relative = Prefix.slice(IMAGE_ROOT.length);
        const name = relative.replace(/\/$/, "").split("/").at(-1);

        if (!name) return null;

        return {
          name,
          prefix: relative,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.name.localeCompare(a!.name));

    const images = (result.Contents ?? [])
      .filter((object) => {
        if (!object.Key) return false;

        return object.Key !== prefix && !object.Key.endsWith("/");
      })
      .map((object) => {
        const key = object.Key!;
        const name = key.split("/").at(-1) ?? key;

        return {
          key,
          name,
          url: `/${key}`,
          lastModified: object.LastModified?.toISOString() ?? null,
          size: object.Size ?? 0,
        };
      })
      .sort((a, b) => {
        const aTime = a.lastModified ? new Date(a.lastModified).getTime() : 0;
        const bTime = b.lastModified ? new Date(b.lastModified).getTime() : 0;

        return bTime - aTime;
      });

    return jsonResponse(200, {
      prefix: relativePrefix,
      folders,
      images,
    });
  } catch (error) {
    console.error("Failed to list images", error);

    return jsonResponse(500, {
      message: "Failed to load images",
    });
  }
};
