import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator, MessageCircle, MapPin, Flag, Car, Calendar, Clock } from "lucide-react";
import { formatINR } from "@/lib/vehicle-fare";
import type { NominatimPlace } from "@/components/NominatimAutocomplete";

type Props = {
  open: boolean;
  onClose: () => void;
  pickup: NominatimPlace | null;
  destination: NominatimPlace | null;
  distanceKm: number;
  travelDate: string;
  pickupTime: string;
  waitingHours: number;
  vehicleSummary: { name: string; quantity: number; color: string }[];
  grandTotal: number;
  advance: number;
  remaining: number;
  waHref: string | undefined;
  onWhatsAppClick: () => void;
};

export function CalculatorDialog({
  open,
  onClose,
  pickup,
  destination,
  distanceKm,
  travelDate,
  pickupTime,
  waitingHours,
  vehicleSummary,
  grandTotal,
  advance,
  remaining,
  waHref,
  onWhatsAppClick,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg rounded-3xl border border-gold-hairline bg-gradient-to-br from-card to-[oklch(0.14_0.03_20)] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gold-hairline">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                <div className="text-xs uppercase tracking-[0.3em] text-primary">
                  Book Car
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="rounded-2xl bg-primary/10 border border-primary/30 p-4 text-center">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
                  Estimated Fare
                </div>
                <div className="font-display text-4xl text-gradient-gold mt-1">
                  {formatINR(grandTotal)}
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  Advance {formatINR(advance)} · Remaining {formatINR(remaining)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Stat icon={<MapPin className="h-3 w-3" />} label="Pickup" value={pickup?.name || "—"} />
                <Stat icon={<Flag className="h-3 w-3" />} label="Destination" value={destination?.name || "—"} />
                <Stat icon={<Car className="h-3 w-3" />} label="Distance" value={distanceKm > 0 ? `${distanceKm} km` : "—"} />
                <Stat icon={<Calendar className="h-3 w-3" />} label="Date" value={travelDate || "—"} />
                <Stat icon={<Clock className="h-3 w-3" />} label="Time" value={pickupTime || "—"} />
                <Stat icon={<Clock className="h-3 w-3" />} label="Waiting" value={`${waitingHours} hr`} />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
                  Selected Vehicles
                </div>
                <div className="space-y-2">
                  {vehicleSummary.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-gold-hairline bg-background/40 px-3 py-2 text-sm"
                    >
                      <span className="text-foreground truncate">
                        {v.name}{" "}
                        <span className="text-muted-foreground text-xs">
                          ({v.color})
                        </span>
                      </span>
                      <span className="text-primary font-medium">× {v.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gold-hairline flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-gold-hairline px-4 py-3 text-sm text-foreground hover:bg-muted/40 transition"
              >
                Close
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!waHref) {
                    e.preventDefault();
                    return;
                  }
                  onWhatsAppClick();
                }}
                aria-disabled={!waHref}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition ${
                  waHref
                    ? "bg-primary text-primary-foreground shadow-gold-glow hover:scale-[1.02]"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <MessageCircle className="h-4 w-4" /> Confirm Booking
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gold-hairline bg-background/40 p-2.5">
      <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-sm text-foreground truncate">{value}</div>
    </div>
  );
}