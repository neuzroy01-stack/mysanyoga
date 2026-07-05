// Configured pickup service district. Only Pickup location is validated.
export const SERVICE_DISTRICT = "Giridih";

// Well-known blocks / towns inside Giridih district — used as a fallback
// substring check when Nominatim doesn't return a `county` field.
export const SERVICE_AREAS: string[] = [
  "Giridih",
  "Bengabad",
  "Dumri",
  "Bagodar",
  "Suriya",
  "Birni",
  "Gandey",
  "Jamua",
  "Pirtand",
  "Dhanwar",
  "Tisri",
  "Deori",
];

export type NominatimAddress = {
  county?: string;
  state_district?: string;
  city_district?: string;
  district?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  state?: string;
  country?: string;
  [k: string]: string | undefined;
};

export function isPickupInServiceDistrict(
  address: NominatimAddress | undefined,
  displayName?: string,
): boolean {
  if (!address && !displayName) return false;
  const needle = SERVICE_DISTRICT.toLowerCase();
  const candidates = [
    address?.county,
    address?.state_district,
    address?.city_district,
    address?.district,
    address?.city,
    address?.town,
    address?.village,
    address?.suburb,
  ]
    .filter(Boolean)
    .map((s) => (s as string).toLowerCase());
  if (candidates.some((c) => c.includes(needle))) return true;
  // Fallback: check display name for any known block/town
  const dn = (displayName ?? "").toLowerCase();
  return SERVICE_AREAS.some((a) => dn.includes(a.toLowerCase()));
}