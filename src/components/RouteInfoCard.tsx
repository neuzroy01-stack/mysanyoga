import { lazy, Suspense } from "react";
import { MapPin, Flag, Car, Ruler, Loader2 } from "lucide-react";
import type { NominatimPlace } from "@/components/NominatimAutocomplete";

const LeafletMiniMap = lazy(() => import("./LeafletMiniMap"));

type Props = {
  pickup: NominatimPlace | null;
  destination: NominatimPlace | null;
  distanceKm: number;
  vehicleName?: string;
};

export function RouteInfoCard({
  pickup,
  destination,
  distanceKm,
  vehicleName,
}: Props) {
  if (!pickup && !destination) return null;

  return (
    <div className="rounded-3xl border border-gold-hairline bg-gradient-to-br from-card to-[oklch(0.14_0.03_20)] p-5 overflow-hidden">
      <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
        Route Information
      </div>

      {pickup && destination && (
        <div className="mb-4 h-48 w-full rounded-2xl overflow-hidden border border-gold-hairline">
          <Suspense
            fallback={
              <div className="h-full w-full grid place-items-center bg-muted/20 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            }
          >
            <LeafletMiniMap
              pickup={{ lat: pickup.lat, lon: pickup.lon }}
              destination={{ lat: destination.lat, lon: destination.lon }}
            />
          </Suspense>
        </div>
      )}

      <div className="space-y-3">
        <Info
          icon={<MapPin className="h-3.5 w-3.5 text-primary" />}
          label="Pickup"
          value={pickup?.name || "—"}
          hint={pickup?.displayName}
        />
        <Info
          icon={<Flag className="h-3.5 w-3.5 text-destructive" />}
          label="Destination"
          value={destination?.name || "—"}
          hint={destination?.displayName}
        />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-xl border border-gold-hairline bg-background/40 p-2.5">
            <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-1">
              <Ruler className="h-3 w-3" /> Est. Distance
            </div>
            <div className="mt-0.5 text-sm font-medium text-primary">
              {distanceKm > 0 ? `${distanceKm} km` : "—"}
            </div>
          </div>
          <div className="rounded-xl border border-gold-hairline bg-background/40 p-2.5">
            <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-1">
              <Car className="h-3 w-3" /> Vehicle
            </div>
            <div className="mt-0.5 text-sm font-medium text-foreground truncate">
              {vehicleName || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground inline-flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="text-sm text-foreground truncate">{value}</div>
      {hint && (
        <div className="text-[10px] text-muted-foreground/80 line-clamp-1">
          {hint}
        </div>
      )}
    </div>
  );
}