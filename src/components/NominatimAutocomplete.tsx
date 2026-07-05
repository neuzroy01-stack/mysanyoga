import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, X } from "lucide-react";
import type { NominatimAddress } from "@/lib/service-area";

export type NominatimPlace = {
  lat: number;
  lon: number;
  displayName: string;
  name: string;
  address: NominatimAddress;
};

type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_id?: number;
    osm_type?: string;
    name?: string;
    country?: string;
    countrycode?: string;
    state?: string;
    county?: string;
    city?: string;
    town?: string;
    village?: string;
    district?: string;
    postcode?: string;
    street?: string;
    housenumber?: string;
    type?: string;
  };
};

type Props = {
  value: NominatimPlace | null;
  onChange: (place: NominatimPlace | null) => void;
  placeholder?: string;
  /** Bias search around Giridih first (pickup mode). */
  biasGiridih?: boolean;
  className?: string;
};

// Giridih town approximate center — used only as a bias for ranking.
const GIRIDIH_LAT = 24.185;
const GIRIDIH_LON = 86.305;

export function NominatimAutocomplete({
  value,
  onChange,
  placeholder,
  biasGiridih = false,
  className = "",
}: Props) {
  const [input, setInput] = useState(value ? value.name : "");
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setInput(value ? value.name : "");
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const fetchSuggestions = async (q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q,
        limit: "8",
        lang: "en",
      });
      if (biasGiridih) {
        params.set("lat", String(GIRIDIH_LAT));
        params.set("lon", String(GIRIDIH_LON));
      }
      const res = await fetch(
        `https://photon.komoot.io/api/?${params.toString()}`,
        { signal: controller.signal, headers: { Accept: "application/json" } },
      );
      if (!res.ok) throw new Error("Search unavailable");
      const data = (await res.json()) as { features: PhotonFeature[] };
      // Filter to India only for our use-case.
      const filtered = (data.features || []).filter(
        (f) =>
          f.properties?.countrycode === "IN" ||
          (f.properties?.country || "").toLowerCase() === "india",
      );
      setSuggestions(filtered.slice(0, 6));
      setOpen(true);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError((e as Error).message || "Search failed");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const onInput = (v: string) => {
    setInput(v);
    if (value) onChange(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(v), 280);
  };

  const pick = (f: PhotonFeature) => {
    const p = f.properties;
    const primary =
      p.name || p.city || p.town || p.village || p.county || "Selected location";
    const detailParts = [
      p.street && (p.housenumber ? `${p.housenumber} ${p.street}` : p.street),
      p.district,
      p.city || p.town || p.village,
      p.county,
      p.state,
      p.country,
    ].filter(Boolean) as string[];
    const displayName = [primary, ...detailParts.filter((d) => d !== primary)].join(
      ", ",
    );
    const [lon, lat] = f.geometry.coordinates;
    const place: NominatimPlace = {
      lat,
      lon,
      displayName,
      name: primary,
      address: {
        county: p.county,
        district: p.district,
        city: p.city,
        town: p.town,
        village: p.village,
        state: p.state,
        country: p.country,
      },
    };
    setInput(primary);
    setOpen(false);
    onChange(place);
  };

  const clear = () => {
    setInput("");
    setSuggestions([]);
    onChange(null);
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          value={input}
          onChange={(e) => onInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gold-hairline bg-background/60 pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
          autoComplete="off"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
        ) : input ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {open && (suggestions.length > 0 || error) && (
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-gold-hairline bg-popover shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          {error && (
            <div className="px-3 py-2 text-xs text-destructive">{error}</div>
          )}
          {suggestions.map((f, idx) => {
            const p = f.properties;
            const primary =
              p.name || p.city || p.town || p.village || p.county || "Location";
            const secondary = [
              p.district,
              p.city && p.city !== primary ? p.city : null,
              p.county && p.county !== primary ? p.county : null,
              p.state,
              p.country,
            ]
              .filter(Boolean)
              .join(", ");
            return (
              <button
                key={`${p.osm_id ?? idx}-${idx}`}
                type="button"
                onClick={() => pick(f)}
                className="w-full text-left px-3 py-2.5 hover:bg-primary/10 transition border-b border-gold-hairline/40 last:border-0"
              >
                <div className="text-sm text-foreground">{primary}</div>
                {secondary && (
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {secondary}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {value && (
        <div className="mt-1 text-[11px] text-emerald-400/80">
          ✓ Location confirmed
        </div>
      )}
    </div>
  );
}