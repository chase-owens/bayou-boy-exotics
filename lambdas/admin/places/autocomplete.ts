import type { APIGatewayProxyHandler } from "aws-lambda";
import {
  AutocompleteCommand,
  GeoPlacesClient,
} from "@aws-sdk/client-geo-places";

const places = new GeoPlacesClient({});

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
  "Access-Control-Allow-Methods": "GET,OPTIONS",
});

export const handler: APIGatewayProxyHandler = async (event) => {
  const headers = getCorsHeaders(event.headers.origin);

  try {
    const query = event.queryStringParameters?.q?.trim();

    if (!query || query.length < 3) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          suggestions: [],
        }),
      };
    }

    const response = await places.send(
      new AutocompleteCommand({
        QueryText: query,
        MaxResults: 5,
        Filter: {
          IncludeCountries: ["USA"],
          BoundingBox: [
            -97.2, // west — Arlington
            32.72, // south — Arlington
            -96.65, // east — Plano/Richardson
            33.1, // north — safely above Coppell + south Plano
          ],
        },
      }),
    );

    const suggestions =
      response.ResultItems?.map((item) => ({
        placeId: item.PlaceId,
        label: item.Title,
        placeType: item.PlaceType,
      })) ?? [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        suggestions,
      }),
    };
  } catch (error) {
    console.error("Address autocomplete failed", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Unable to search addresses.",
      }),
    };
  }
};
