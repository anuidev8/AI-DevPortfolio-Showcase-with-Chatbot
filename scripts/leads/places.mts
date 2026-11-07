// Google Places API (New) — Text Search.
// https://developers.google.com/maps/documentation/places/web-service/text-search

export type Place = {
  placeId: string;
  name: string;
  address: string;
  website: string;
  phone: string;
  rating: number | null;
  reviewCount: number;
  mapsUrl: string;
  reviews: string[];
};

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.websiteUri",
  "places.internationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.reviews",
  "nextPageToken",
].join(",");

// Google returns at most 60 results (3 pages of 20) per text query.
export async function searchPlaces(textQuery: string, limit: number, apiKey: string): Promise<Place[]> {
  const places: Place[] = [];
  let pageToken: string | undefined;

  do {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({ textQuery, pageSize: 20, pageToken }),
    });

    if (!res.ok) {
      throw new Error(`Places API ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    for (const p of data.places ?? []) {
      places.push({
        placeId: p.id,
        name: p.displayName?.text ?? "",
        address: p.formattedAddress ?? "",
        website: p.websiteUri ?? "",
        phone: p.internationalPhoneNumber ?? "",
        rating: p.rating ?? null,
        reviewCount: p.userRatingCount ?? 0,
        mapsUrl: p.googleMapsUri ?? "",
        reviews: (p.reviews ?? []).map((r: any) => r.text?.text ?? r.originalText?.text ?? "").filter(Boolean),
      });
    }

    pageToken = data.nextPageToken;
  } while (pageToken && places.length < limit);

  return places.slice(0, limit);
}
