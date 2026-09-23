// Curated country -> currency/timezone inference for the checkout signup
// form only (the admin org form keeps the raw TIMEZONES/CURRENCIES lists
// untouched). Scoped to the platform's realistic early market rather than
// attempting full ISO-3166 coverage - a country missing here just falls
// back to the plain manual selects, nothing breaks.
//
// A single timezone entry means the form shows no timezone control at all
// (just a sentence); more than one means a filtered, human-labeled select
// instead of the raw ~40-entry IANA list.
//
// `city` is locale-agnostic (used in the one-line summary sentence, which
// is translated - a raw English descriptor like "Central Europe" doesn't
// belong inside a French sentence). `label` is only ever shown inside the
// (English) <select> when a country has more than one zone, to tell zones
// apart - that one's fine left untranslated, same as the raw IANA list it
// replaces.
export type RegionTimezone = { id: string; city: string; label: string };

export type Region = {
  code: string; // ISO 3166-1 alpha-2, matches Mapbox's country short_code
  name: string; // shown in the manual-entry country select
  currency: string; // must exist in organization/currencies.ts
  timezones: RegionTimezone[];
};

export const REGIONS: Region[] = [
  { code: "FR", name: "France", currency: "EUR", timezones: [{ id: "Europe/Paris", city: "Paris", label: "Paris — Central Europe, UTC+1" }] },
  { code: "BE", name: "Belgium", currency: "EUR", timezones: [{ id: "Europe/Brussels", city: "Brussels", label: "Brussels — Central Europe, UTC+1" }] },
  { code: "LU", name: "Luxembourg", currency: "EUR", timezones: [{ id: "Europe/Brussels", city: "Luxembourg", label: "Luxembourg — Central Europe, UTC+1" }] },
  { code: "DE", name: "Germany", currency: "EUR", timezones: [{ id: "Europe/Berlin", city: "Berlin", label: "Berlin — Central Europe, UTC+1" }] },
  { code: "AT", name: "Austria", currency: "EUR", timezones: [{ id: "Europe/Vienna", city: "Vienna", label: "Vienna — Central Europe, UTC+1" }] },
  { code: "ES", name: "Spain", currency: "EUR", timezones: [{ id: "Europe/Madrid", city: "Madrid", label: "Madrid — Central Europe, UTC+1" }] },
  { code: "PT", name: "Portugal", currency: "EUR", timezones: [{ id: "Europe/Lisbon", city: "Lisbon", label: "Lisbon — Western Europe, UTC+0" }] },
  { code: "IT", name: "Italy", currency: "EUR", timezones: [{ id: "Europe/Rome", city: "Rome", label: "Rome — Central Europe, UTC+1" }] },
  { code: "NL", name: "Netherlands", currency: "EUR", timezones: [{ id: "Europe/Amsterdam", city: "Amsterdam", label: "Amsterdam — Central Europe, UTC+1" }] },
  { code: "IE", name: "Ireland", currency: "EUR", timezones: [{ id: "Europe/Dublin", city: "Dublin", label: "Dublin — Western Europe, UTC+0" }] },
  { code: "GR", name: "Greece", currency: "EUR", timezones: [{ id: "Europe/Athens", city: "Athens", label: "Athens — Eastern Europe, UTC+2" }] },
  { code: "GB", name: "United Kingdom", currency: "GBP", timezones: [{ id: "Europe/London", city: "London", label: "London — UTC+0" }] },
  { code: "CH", name: "Switzerland", currency: "CHF", timezones: [{ id: "Europe/Zurich", city: "Zurich", label: "Zurich — Central Europe, UTC+1" }] },
  { code: "SE", name: "Sweden", currency: "SEK", timezones: [{ id: "Europe/Stockholm", city: "Stockholm", label: "Stockholm — Central Europe, UTC+1" }] },
  { code: "NO", name: "Norway", currency: "NOK", timezones: [{ id: "Europe/Oslo", city: "Oslo", label: "Oslo — Central Europe, UTC+1" }] },
  { code: "DK", name: "Denmark", currency: "DKK", timezones: [{ id: "Europe/Copenhagen", city: "Copenhagen", label: "Copenhagen — Central Europe, UTC+1" }] },
  { code: "JP", name: "Japan", currency: "JPY", timezones: [{ id: "Asia/Tokyo", city: "Tokyo", label: "Tokyo — UTC+9" }] },
  { code: "CN", name: "China", currency: "CNY", timezones: [{ id: "Asia/Shanghai", city: "Shanghai", label: "Shanghai — UTC+8" }] },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    timezones: [
      { id: "America/New_York", city: "New York", label: "New York — Eastern, UTC-5" },
      { id: "America/Chicago", city: "Chicago", label: "Chicago — Central, UTC-6" },
      { id: "America/Denver", city: "Denver", label: "Denver — Mountain, UTC-7" },
      { id: "America/Los_Angeles", city: "Los Angeles", label: "Los Angeles — Pacific, UTC-8" },
      { id: "America/Anchorage", city: "Anchorage", label: "Anchorage — Alaska, UTC-9" },
      { id: "Pacific/Honolulu", city: "Honolulu", label: "Honolulu — Hawaii, UTC-10" },
    ],
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    timezones: [
      { id: "America/Toronto", city: "Toronto", label: "Toronto — Eastern, UTC-5" },
      { id: "America/Winnipeg", city: "Winnipeg", label: "Winnipeg — Central, UTC-6" },
      { id: "America/Edmonton", city: "Edmonton", label: "Edmonton — Mountain, UTC-7" },
      { id: "America/Vancouver", city: "Vancouver", label: "Vancouver — Pacific, UTC-8" },
    ],
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    timezones: [
      { id: "Australia/Sydney", city: "Sydney", label: "Sydney — Eastern, UTC+11" },
      { id: "Australia/Adelaide", city: "Adelaide", label: "Adelaide — Central, UTC+10:30" },
      { id: "Australia/Perth", city: "Perth", label: "Perth — Western, UTC+8" },
    ],
  },
];

export function findRegion(code: string | undefined): Region | undefined {
  if (!code) return undefined;
  const upper = code.toUpperCase();
  return REGIONS.find((region) => region.code === upper);
}
