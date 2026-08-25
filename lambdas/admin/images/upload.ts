import { randomUUID } from "node:crypto";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { APIGatewayProxyEvent } from "aws-lambda";

const s3 = new S3Client({});

const BUCKET_NAME = process.env.CONTENT_BUCKET_NAME;
const IMAGE_ROOT = "images/";

type UploadImage = {
  name: string;
  contentType: string;
};

type UploadImagesRequest = {
  prefix?: string;
  images: UploadImage[];
};

const jsonResponse = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  },
  body: JSON.stringify(body),
});

const normalizePrefix = (prefix?: string) => {
  if (!prefix) return "";

  return prefix
    .replace(/^\/+/, "")
    .replace(/^images\//, "")
    .replace(/\.\./g, "")
    .replace(/\/?$/, "/");
};

const normalizeFileName = (name: string) =>
  name
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");

export const handler = async (event: APIGatewayProxyEvent) => {
  if (!BUCKET_NAME) {
    return jsonResponse(500, {
      message: "CONTENT_BUCKET_NAME is required",
    });
  }

  try {
    const body = JSON.parse(event.body ?? "{}") as UploadImagesRequest;

    if (!body.images?.length) {
      return jsonResponse(400, {
        message: "At least one image is required.",
      });
    }

    const prefix = normalizePrefix(body.prefix);

    const invalidImage = body.images.find(
      ({ contentType }) => !contentType.startsWith("image/"),
    );

    if (invalidImage) {
      return jsonResponse(400, {
        message: `${invalidImage.name} is not an image.`,
      });
    }

    const invalidFileName = body.images.find(
      ({ name }) => !normalizeFileName(name),
    );

    if (invalidFileName) {
      return jsonResponse(400, {
        message: "Image filename is required.",
      });
    }

    const uploads = await Promise.all(
      body.images.map(async ({ name, contentType }) => {
        const fileName = normalizeFileName(name);

        const key = `${IMAGE_ROOT}${prefix}${randomUUID()}-${fileName}`;

        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(s3, command, {
          expiresIn: 300,
        });

        return {
          key,
          name: fileName,
          url: `/${key}`,
          uploadUrl,
        };
      }),
    );

    return jsonResponse(200, {
      uploads,
    });
  } catch (error) {
    console.error("Failed to prepare image uploads", error);

    return jsonResponse(500, {
      message: "Failed to prepare image uploads.",
    });
  }
};
