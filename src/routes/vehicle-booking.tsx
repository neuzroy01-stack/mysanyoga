import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  Sparkles,
  ArrowLeftRight,
  Calculator,
} from "lucide-react";
import {
  VEHICLE_RATES,
  calculateFare,
  formatINR,
  getVehicleRate,
  type BookingVehicle,
} from "@/lib/vehicle-fare";
import { waLink } from "@/lib/site";
import { reserveOrderId, commitOrderId, releaseOrderId } from "@/lib/order-id";
import {
  NominatimAutocomplete,
  type NominatimPlace,
} from "@/components/NominatimAutocomplete";
import { RouteInfoCard } from "@/components/RouteInfoCard";
import { Vehicle3DPreview } from "@/components/Vehicle3DPreview";
import { CalculatorDialog } from "@/components/CalculatorDialog";
import {
  SERVICE_DISTRICT,
  isPickupInServiceDistrict,
} from "@/lib/service-area";
import { haversineKm, estimateRoadKm, fetchRoadDistanceKm } from "@/lib/geo";

export const Route = createFileRoute("/vehicle-booking")({
  head: () => ({
    meta: [
      { title: "Vehicle Booking & Smart Fare Calculator — MySanyoga" },
      {
        name: "description",
        content:
          "Plan your wedding & event travel. Add multiple vehicles, get an instant live fare breakdown with GST, driver allowance, waiting and toll charges.",
      },
      { property: "og:title", content: "Vehicle Booking — MySanyoga" },
      {
        property: "og:description",
        content:
          "Smart fare calculator with multi-vehicle support, live updates and transparent pricing.",
      },
    ],
  }),
  component: VehicleBookingPage,
});

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function VehicleBookingPage() {
  // Global 6-digit Order ID — reserved on mount, committed on WhatsApp send.
  const [orderId, setOrderId] = useState<string>("");
  const committedRef = useRef(false);
  useEffect(() => {
    const id = reserveOrderId();
    setOrderId(id);
    return () => {
      if (!committedRef.current) releaseOrderId(id);
    };
  }, []);

  // Journey
  const [pickupPlace, setPickupPlace] = useState<NominatimPlace | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<NominatimPlace | null>(null);
  const [travelDate, setTravelDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  // Travel info
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [distanceTouched, setDistanceTouched] = useState(false);
  const [waitingHours, setWaitingHours] = useState<number>(0);

  // Calculator popup
  const [calcOpen, setCalcOpen] = useState(false);

  // Pricing config
  const [gstPercent, setGstPercent] = useState<number>(5);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState<number>(0);

  // Vehicles
  const [vehicles, setVehicles] = useState<BookingVehicle[]>([
    {
      uid: uid(),
      vehicleId: VEHICLE_RATES[0].id,
      quantity: 1,
      color: VEHICLE_RATES[0].colors[0],
      nightCharge: 0,
      tollParking: 0,
    },
  ]);

  const pickup = pickupPlace?.displayName ?? "";
  const destination = destinationPlace?.displayName ?? "";
  const pickupInServiceArea = pickupPlace
    ? isPickupInServiceDistrict(pickupPlace.address, pickupPlace.displayName)
    : true;
  const canBook =
    !!pickupPlace &&
    !!destinationPlace &&
    distanceKm > 0 &&
    vehicles.length > 0;

  // Auto-prefill an estimated distance whenever both endpoints are picked
  // Uses OSRM (free public routing) for accurate driving distance, falling
  // back to haversine × 1.3 on failure. User can still override manually.
  useEffect(() => {
    if (!pickupPlace || !destinationPlace) {
      if (!distanceTouched) setDistanceKm(0);
      return;
    }
    if (distanceTouched) return;
    // Fast local estimate first so the UI isn't blank while we fetch.
    const straight = haversineKm(
      { lat: pickupPlace.lat, lon: pickupPlace.lon },
      { lat: destinationPlace.lat, lon: destinationPlace.lon },
    );
    setDistanceKm(estimateRoadKm(straight));
    const controller = new AbortController();
    fetchRoadDistanceKm(
      { lat: pickupPlace.lat, lon: pickupPlace.lon },
      { lat: destinationPlace.lat, lon: destinationPlace.lon },
      controller.signal,
    ).then((km) => {
      // Only apply if the user hasn't manually overridden since.
      setDistanceKm((cur) => (distanceTouched ? cur : km));
    });
    return () => controller.abort();
  }, [pickupPlace, destinationPlace, distanceTouched]);

  const swapLocations = () => {
    const a = pickupPlace;
    setPickupPlace(destinationPlace);
    setDestinationPlace(a);
  };

  const breakdown = useMemo(
    () =>
      calculateFare({
        distanceKm,
        waitingHours,
        vehicles,
        gstPercent,
        discount,
      }),
    [distanceKm, waitingHours, vehicles, gstPercent, discount]
  );

  const advance = Math.round(breakdown.grandTotal * 0.25);
  const remaining = breakdown.grandTotal - advance;

  const addVehicle = () => {
    const v = VEHICLE_RATES[0];
    setVehicles((prev) => [
      ...prev,
      {
        uid: uid(),
        vehicleId: v.id,
        quantity: 1,
        color: v.colors[0],
        nightCharge: 0,
        tollParking: 0,
      },
    ]);
  };

  const updateVehicle = (id: string, patch: Partial<BookingVehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.uid !== id) return v;
        const next = { ...v, ...patch };
        if (patch.vehicleId && patch.vehicleId !== v.vehicleId) {
          const rate = getVehicleRate(patch.vehicleId);
          if (rate) next.color = rate.colors[0];
        }
        return next;
      })
    );
  };

  const removeVehicle = (id: string) =>
    setVehicles((prev) => prev.filter((v) => v.uid !== id));

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (c === "SANYOGA10") setDiscount(Math.round(breakdown.subTotal * 0.1));
    else if (c === "FLAT500") setDiscount(500);
    else if (c === "WEDDING1000") setDiscount(1000);
    else setDiscount(0);
  };

  const waMessage = buildWaMessage({
    pickup,
    destination,
    travelDate,
    pickupTime,
    distanceKm,
    waitingHours,
    vehicles,
    breakdown,
    orderId,
  });

  const waHref = canBook ? waLink(waMessage) : undefined;
  const onWaSent = () => {
    commitOrderId(orderId);
    committedRef.current = true;
  };

  const primaryVehicleName =
    getVehicleRate(vehicles[0]?.vehicleId)?.name ?? undefined;
  const vehicleSummary = vehicles.map((v) => {
    const rate = getVehicleRate(v.vehicleId);
    return {
      name: rate?.name ?? "—",
      quantity: v.quantity,
      color: v.color,
    };
  });

  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          to="/services/$category"
          params={{ category: "vehicle-rental" }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Vehicle Rental
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3 inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Smart Fare Calculator
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-tight">
            Vehicle Booking
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Add one or many vehicles, set your distance and watch the live fare
            update instantly — transparent, with no hidden charges.
          </p>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-[1fr_400px] gap-8">
          {/* LEFT — FORM */}
          <div className="space-y-8">
            {/* Journey */}
            <Section title="Journey Details">
              <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-start">
                <Field label="Pickup Location" icon={<MapPin className="h-4 w-4" />}>
                  <NominatimAutocomplete
                    value={pickupPlace}
                    onChange={setPickupPlace}
                    placeholder="Search any pickup location in India"
                    biasGiridih
                  />
                </Field>
                <div className="hidden sm:flex items-end h-full pb-2">
                  <button
                    type="button"
                    onClick={swapLocations}
                    aria-label="Swap pickup and destination"
                    className="mt-6 rounded-full border border-gold-hairline p-2.5 text-primary hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                </div>
                <Field
                  label="Destination"
                  icon={<MapPin className="h-4 w-4" />}
                >
                  <NominatimAutocomplete
                    value={destinationPlace}
                    onChange={setDestinationPlace}
                    placeholder="Search any destination in India"
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Field label="Travel Date" icon={<Calendar className="h-4 w-4" />}>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className={inputCls()}
                  />
                </Field>
                <Field label="Pickup Time" icon={<Clock className="h-4 w-4" />}>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className={inputCls()}
                  />
                </Field>
              </div>

              <AnimatePresence>
                {pickupPlace && !pickupInServiceArea && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex gap-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm"
                  >
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-medium text-amber-300">
                        Service area notice
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        Currently, our vehicle rental service is available only
                        in {SERVICE_DISTRICT}, Jharkhand. You may continue with
                        the booking, and we will contact you if our service
                        becomes available in your area.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>

            {/* Travel info */}
            <Section title="Travel Information">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Estimated Distance (KM)">
                  <input
                    type="number"
                    min={0}
                    value={distanceKm || ""}
                    placeholder="0"
                    onChange={(e) => {
                      setDistanceTouched(true);
                      setDistanceKm(Math.max(0, Number(e.target.value)));
                    }}
                    className={inputCls()}
                  />
                </Field>
                <Field label="Waiting Time (Hours)">
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={waitingHours}
                    onChange={(e) => setWaitingHours(Number(e.target.value))}
                    className={inputCls()}
                  />
                </Field>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                This is only an estimated distance provided by the customer.
                The final travel distance and fare will be verified and
                confirmed by our team after reviewing the pickup and
                destination locations.
              </p>
            </Section>

            {/* Vehicles */}
            <Section
              title="Vehicle Selection"
              action={
                <button
                  onClick={addVehicle}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold-hairline px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary hover:bg-primary hover:text-primary-foreground transition"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Vehicle
                </button>
              }
            >
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {vehicles.map((v, idx) => {
                    const rate = getVehicleRate(v.vehicleId);
                    const line = breakdown.lines[idx];
                    return (
                      <motion.div
                        key={v.uid}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-2xl border border-gold-hairline bg-card p-5"
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                            Vehicle {idx + 1}
                          </div>
                          {vehicles.length > 1 && (
                            <button
                              onClick={() => removeVehicle(v.uid)}
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </button>
                          )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <Field label="Vehicle Type">
                            <select
                              value={v.vehicleId}
                              onChange={(e) =>
                                updateVehicle(v.uid, { vehicleId: e.target.value })
                              }
                              className={inputCls()}
                            >
                              {VEHICLE_RATES.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Quantity">
                            <input
                              type="number"
                              min={1}
                              value={v.quantity}
                              onChange={(e) =>
                                updateVehicle(v.uid, {
                                  quantity: Math.max(1, Number(e.target.value)),
                                })
                              }
                              className={inputCls()}
                            />
                          </Field>
                          <Field label="Vehicle Color">
                            <select
                              value={v.color}
                              onChange={(e) =>
                                updateVehicle(v.uid, { color: e.target.value })
                              }
                              className={inputCls()}
                            >
                              {rate?.colors.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Per KM Rate (Auto)">
                            <input
                              readOnly
                              value={rate ? `₹ ${rate.perKm} / km` : ""}
                              className={inputCls("bg-muted/40 cursor-not-allowed")}
                            />
                          </Field>
                          <Field label="Night Charge (Optional)">
                            <input
                              type="number"
                              min={0}
                              value={v.nightCharge}
                              onChange={(e) =>
                                updateVehicle(v.uid, {
                                  nightCharge: Math.max(0, Number(e.target.value)),
                                })
                              }
                              className={inputCls()}
                            />
                          </Field>
                          <Field label="Toll / Parking (Optional)">
                            <input
                              type="number"
                              min={0}
                              value={v.tollParking}
                              onChange={(e) =>
                                updateVehicle(v.uid, {
                                  tollParking: Math.max(0, Number(e.target.value)),
                                })
                              }
                              className={inputCls()}
                            />
                          </Field>
                        </div>

                        {rate && line && (
                          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <Stat label="Base Fare" value={formatINR(rate.baseFare)} />
                            <Stat
                              label="Driver Allowance"
                              value={formatINR(rate.driverAllowance)}
                            />
                            <Stat
                              label="Per Vehicle"
                              value={formatINR(line.perUnit)}
                            />
                            <Stat
                              label={`Subtotal × ${line.quantity}`}
                              value={formatINR(line.total)}
                              highlight
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <button
                  onClick={addVehicle}
                  className="w-full rounded-2xl border border-dashed border-gold-hairline py-4 text-sm text-muted-foreground hover:text-primary hover:border-primary/60 transition inline-flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add More Vehicle
                </button>
              </div>
            </Section>

            {/* Coupon */}
            <Section title="Coupon & Taxes">
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Coupon Code">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="SANYOGA10"
                    className={inputCls()}
                  />
                </Field>
                <Field label="GST %">
                  <input
                    type="number"
                    min={0}
                    max={28}
                    value={gstPercent}
                    onChange={(e) => setGstPercent(Number(e.target.value))}
                    className={inputCls()}
                  />
                </Field>
                <div className="flex items-end">
                  <button
                    onClick={applyCoupon}
                    className="w-full rounded-xl bg-primary px-5 py-3 text-sm text-primary-foreground hover:opacity-90"
                  >
                    Apply Coupon
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Try <span className="text-primary">SANYOGA10</span> (10% off),{" "}
                <span className="text-primary">FLAT500</span> or{" "}
                <span className="text-primary">WEDDING1000</span>.
              </p>
            </Section>
          </div>

          {/* RIGHT — SUMMARY */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            {(pickupPlace || destinationPlace) && (
              <Vehicle3DPreview vehicleName={primaryVehicleName} />
            )}
            {(pickupPlace || destinationPlace) && (
              <RouteInfoCard
                pickup={pickupPlace}
                destination={destinationPlace}
                distanceKm={distanceKm}
                vehicleName={primaryVehicleName}
              />
            )}
            <div className="rounded-3xl border border-gold-hairline bg-gradient-to-b from-card to-[oklch(0.16_0.04_20)] p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
                Live Fare Breakdown
              </div>

              <div className="space-y-2.5 text-sm">
                <Row label="Base Fare" value={formatINR(breakdown.baseFareTotal)} />
                <Row label="Distance Charges" value={formatINR(breakdown.distanceTotal)} />
                <Row label="Waiting Charges" value={formatINR(breakdown.waitingTotal)} />
                <Row label="Driver Allowance" value={formatINR(breakdown.driverTotal)} />
                {breakdown.nightTotal > 0 && (
                  <Row label="Night Charges" value={formatINR(breakdown.nightTotal)} />
                )}
                {breakdown.tollTotal > 0 && (
                  <Row label="Toll & Parking" value={formatINR(breakdown.tollTotal)} />
                )}
                <div className="h-px bg-gold-hairline my-3" />
                <Row label="Subtotal" value={formatINR(breakdown.subTotal)} />
                <Row
                  label={`GST (${gstPercent}%)`}
                  value={formatINR(breakdown.gstAmount)}
                />
                {breakdown.discount > 0 && (
                  <Row
                    label="Discount"
                    value={`− ${formatINR(breakdown.discount)}`}
                    accent="text-emerald-400"
                  />
                )}
              </div>

              <div className="mt-5 rounded-2xl bg-primary/10 border border-primary/30 p-4">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
                  Grand Total
                </div>
                <div className="font-display text-4xl text-gradient-gold mt-1">
                  {formatINR(breakdown.grandTotal)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCalcOpen(true)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/10 text-primary px-5 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition"
              >
                <Calculator className="h-4 w-4" /> Book Car
              </button>
            </div>

            <div className="rounded-3xl border border-gold-hairline bg-card p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
                Booking Summary
              </div>
              <div className="space-y-2.5 text-sm">
                <Row label="Total Vehicles" value={String(breakdown.totalVehicles)} />
                <Row label="Total Distance" value={`${distanceKm} km`} />
                <Row label="Estimated Fare" value={formatINR(breakdown.grandTotal)} />
                <div className="h-px bg-gold-hairline my-3" />
                <Row label="Advance (25%)" value={formatINR(advance)} accent="text-primary" />
                <Row label="Remaining" value={formatINR(remaining)} />
              </div>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!canBook) e.preventDefault();
                  else onWaSent();
                }}
                aria-disabled={!canBook}
                className={`mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition ${
                  canBook
                    ? "bg-primary text-primary-foreground shadow-gold-glow hover:scale-[1.02]"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                {canBook ? "Proceed to Book on WhatsApp" : "Complete details to book"}
              </a>
              <p className="mt-3 text-[11px] text-muted-foreground text-center">
                Order ID <span className="font-mono text-foreground">{orderId || "—"}</span> · Final fare confirmed by our team.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <CalculatorDialog
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        pickup={pickupPlace}
        destination={destinationPlace}
        distanceKm={distanceKm}
        travelDate={travelDate}
        pickupTime={pickupTime}
        waitingHours={waitingHours}
        vehicleSummary={vehicleSummary}
        grandTotal={breakdown.grandTotal}
        advance={advance}
        remaining={remaining}
        waHref={waHref}
        onWhatsAppClick={onWaSent}
      />
    </div>
  );
}

// ---------- helpers / subcomponents ----------

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-gold-hairline bg-card/60 p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl md:text-2xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
        {icon}
        {label}
      </div>
      {children}
      {error && (
        <div className="mt-1 text-xs text-destructive">{error}</div>
      )}
    </label>
  );
}

function inputCls(extra = "") {
  return `w-full rounded-xl border border-gold-hairline bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition ${extra}`;
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${accent ?? "text-foreground"}`}>{value}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 ${
        highlight
          ? "border-primary/40 bg-primary/5"
          : "border-gold-hairline bg-background/40"
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div className={`mt-0.5 font-medium ${highlight ? "text-primary" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function buildWaMessage(args: {
  pickup: string;
  destination: string;
  travelDate: string;
  pickupTime: string;
  distanceKm: number;
  waitingHours: number;
  vehicles: BookingVehicle[];
  breakdown: ReturnType<typeof calculateFare>;
  orderId: string;
}) {
  const lines: string[] = [];
  lines.push("*MySanyoga — Vehicle Booking Request*");
  lines.push("");
  lines.push(`*Order ID:* ${args.orderId || "—"}`);
  lines.push(`*Date:* ${new Date().toLocaleString("en-IN")}`);
  lines.push("");
  lines.push(`Pickup: ${args.pickup || "—"}`);
  lines.push(`Destination: ${args.destination || "—"}`);
  lines.push(`Date: ${args.travelDate || "—"}  Time: ${args.pickupTime || "—"}`);
  lines.push(`Distance: ${args.distanceKm} km  Waiting: ${args.waitingHours} hr`);
  lines.push("");
  lines.push("*Vehicles:*");
  args.breakdown.lines.forEach((l, i) => {
    const v = args.vehicles[i];
    lines.push(
      `${i + 1}. ${l.name} × ${l.quantity} (${v?.color ?? "-"}) — ${formatINR(l.total)}`
    );
  });
  lines.push("");
  lines.push(`Subtotal: ${formatINR(args.breakdown.subTotal)}`);
  lines.push(`GST: ${formatINR(args.breakdown.gstAmount)}`);
  if (args.breakdown.discount > 0)
    lines.push(`Discount: − ${formatINR(args.breakdown.discount)}`);
  lines.push(`*Grand Total: ${formatINR(args.breakdown.grandTotal)}*`);
  return lines.join("\n");
}