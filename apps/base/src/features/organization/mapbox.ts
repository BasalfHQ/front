import { Base } from "@repo/apis";
import { env } from "@repo/config";

type MapboxContextEntry = {
  id: string;
  text: string;
  short_code?: string;
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
  // Split for a scannable two-line suggestion row: street, then
  // "postcode city, country" - Mapbox only gives the flat placeName.
  line1: string;
  line2: string;
  address: Base.Address;
  // ISO 3166-1 alpha-2, when Mapbox provides it - frontend-only, used for
  // region inference (checkout/regions.ts), never sent to the backend
  // (Address has no country-code field, only the display name).
  countryCode?: string;
  longitude: number;
  latitude: number;
};

// Shared by the client debounce (address-field.tsx) and enforced again here
// server-side - the client check is UI-only and skippable by calling the
// server action directly, which would otherwise let a short/empty query
// through on every keystroke against the shared Mapbox token.
export const MIN_QUERY_LENGTH = 5;

function findContext(context: MapboxContextEntry[] | undefined, prefix: string) {
  return context?.find((entry) => entry.id.startsWith(prefix));
}

function featureToAddress(feature: MapboxFeature): Base.Address {
  return {
    streetNumber: feature.address,
    streetAddress: feature.text,
    postalCode: findContext(feature.context, "postcode")?.text,
    addressLocality: findContext(feature.context, "place")?.text,
    addressCountry: findContext(feature.context, "country")?.text,
    longitude: feature.center[0],
    latitude: feature.center[1],
  };
}

export async function searchMapboxAddress(
  query: string,
): Promise<AddressSuggestion[]> {
  const token = env.mapbox.token();
  if (!token || query.trim().length < MIN_QUERY_LENGTH) return [];

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

    return data.features.map((feature) => {
      const postcode = findContext(feature.context, "postcode")?.text;
      const place = findContext(feature.context, "place")?.text;
      const country = findContext(feature.context, "country")?.text;

      return {
        id: feature.id,
        placeName: feature.place_name,
        line1: [feature.address, feature.text].filter(Boolean).join(" "),
        line2: [[postcode, place].filter(Boolean).join(" "), country].filter(Boolean).join(", "),
        address: featureToAddress(feature),
        countryCode: findContext(feature.context, "country")?.short_code?.toUpperCase(),
        longitude: feature.center[0],
        latitude: feature.center[1],
      };
    });
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
