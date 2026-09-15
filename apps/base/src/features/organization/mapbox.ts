import { Base } from "@repo/apis";
import { env } from "@repo/config";

type MapboxContextEntry = {
  id: string;
  text: string;
};

type MapboxFeature = {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  address?: string;
  text: string;
  context?: MapboxContextEntry[];
};

export type AddressSuggestion = {
  id: string;
  placeName: string;
  address: Base.Address;
  longitude: number;
  latitude: number;
};

function findContext(context: MapboxContextEntry[] | undefined, prefix: string) {
  return context?.find((entry) => entry.id.startsWith(prefix))?.text;
}

function featureToAddress(feature: MapboxFeature): Base.Address {
  return {
    streetNumber: feature.address,
    streetAddress: feature.text,
    postalCode: findContext(feature.context, "postcode"),
    addressLocality: findContext(feature.context, "place"),
    addressCountry: findContext(feature.context, "country"),
    longitude: feature.center[0],
    latitude: feature.center[1],
  };
}

export async function searchMapboxAddress(
  query: string,
): Promise<AddressSuggestion[]> {
  const token = env.mapbox.token();
  if (!token || !query.trim()) return [];

  const params = new URLSearchParams({
    access_token: token,
    autocomplete: "true",
    limit: "5",
    types: "address",
  });

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`,
    );

    if (!response.ok) return [];

    const data: { features: MapboxFeature[] } = await response.json();

    return data.features.map((feature) => ({
      id: feature.id,
      placeName: feature.place_name,
      address: featureToAddress(feature),
      longitude: feature.center[0],
      latitude: feature.center[1],
    }));
  } catch (error) {
    console.error("Error searching address:", error);
    return [];
  }
}

export async function fetchMapboxStaticMap(
  latitude: number,
  longitude: number,
): Promise<Response | null> {
  const token = env.mapbox.token();
  if (!token) return null;

  const url =
    `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
    `pin-s+3b82f6(${longitude},${latitude})/${longitude},${latitude},15,0/600x400@2x` +
    `?access_token=${token}`;

  try {
    const response = await fetch(url);
    return response.ok ? response : null;
  } catch (error) {
    console.error("Error fetching static map:", error);
    return null;
  }
}
