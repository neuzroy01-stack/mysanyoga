import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
  AlertCircle,
  Sparkles,
  Camera,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  formatINR,
  formatPhotoOrderId,
  PHOTO_PALETTES,
  type PhotoService,
} from "@/lib/photography";
import { waLink } from "@/lib/site";
import {
  commitOrderId,
  releaseOrderId,
  reserveOrderId,
} from "@/lib/order-id";

// ─────────────────────────────────────────────────────────────────────────────
// Static option sets
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  "Wedding",
  "Engagement",
  "Reception",
  "Birthday",
  "Anniversary",
  "Corporate",
  "Baby Shower",
  "Pre-Wedding",
  "Other",
];

const VENUE_KINDS = ["Indoor", "Outdoor", "Both"] as const;

const SERVICE_OPTIONS = [
  "Photography",
  "Cinematography",
  "Traditional Photography",
  "Traditional Videography",
  "Candid Photography",
  "Candid Videography",
  "Drone Shoot",
  "Pre-Wedding Shoot",
  "Post-Wedding Shoot",
  "Couple Portrait Session",
  "Family Portrait Session",
  "Live Streaming",
  "LED Screen Coverage",
  "Reels & Short Videos",
  "Highlight Film",
  "Full-Length Cinematic Movie",
  "Album Design",
  "Premium Photo Album",
  "Express Delivery",
  "Raw Photos & Videos",
];

const BUDGET_RANGES = [
  "Under ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000 – ₹2,50,000",
  "₹2,50,000 – ₹5,00,000",
  "₹5,00,000+",
];

const EDIT_STYLES = [
  "Cinematic",
  "Traditional",
  "Documentary",
  "Moody / Dark",
  "Light & Airy",
  "Vintage",
  "Mix / Director's Choice",
];

const STEPS = ["Event", "Services", "Coverage", "Customer", "Review"] as const;

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

type YesNo = "" | "Yes" | "No";

type BookingState = {
  event: {
    type: string;
    date: string;
    time: string;
    days: number;
    venueName: string;
    venueAddress: string;
    mapLink: string;
    venueKind: (typeof VENUE_KINDS)[number];
  };
  services: string[];
  customRequirements: string;
  coverage: {
    guests: string;
    cameras: string;
    photographers: string;
    videographers: string;
    femalePhotographer: YesNo;
    droneOperator: YesNo;
    sameDayEdit: YesNo;
  };
  customer: {
    name: string;
    mobile: string;
    whatsapp: string;
    email: string;
    city: string;
    state: string;
    address: string;
  };
  extra: {
    package: string;
    budget: string;
    editStyle: string;
    refLinks: string;
    specialInstructions: string;
    notes: string;
  };
};

function emptyBooking(svc: PhotoService, preselectedPackage: string): BookingState {
  return {
    event: {
      type: "Wedding",
      date: "",
      time: "",
      days: 1,
      venueName: "",
      venueAddress: "",
      mapLink: "",
      venueKind: "Indoor",
    },
    services: [svc.name].filter((s) => SERVICE_OPTIONS.includes(s)),
    customRequirements: "",
    coverage: {
      guests: "",
      cameras: "",
      photographers: "",
      videographers: "",
      femalePhotographer: "",
      droneOperator: "",
      sameDayEdit: "",
    },
    customer: {
      name: "",
      mobile: "",
      whatsapp: "",
      email: "",
      city: "",
      state: "",
      address: "",
    },
    extra: {
      package: preselectedPackage || svc.packages[0]?.name || "",
      budget: "",
      editStyle: "",
      refLinks: "",
      specialInstructions: "",
      notes: "",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation (per visible step)
// ─────────────────────────────────────────────────────────────────────────────

function validateStep(step: number, s: BookingState): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 1) {
    if (!s.event.type) e["event.type"] = "Select event type";
    if (!s.event.date) e["event.date"] = "Pick event date";
    if (!s.event.days || s.event.days < 1) e["event.days"] = "Enter days";
    if (!s.event.venueName.trim()) e["event.venueName"] = "Venue name required";
    if (!s.event.venueAddress.trim())
      e["event.venueAddress"] = "Venue address required";
  }
  if (step === 2) {
    if (s.services.length === 0 && !s.customRequirements.trim())
      e["services"] = "Pick at least one service or describe a custom requirement";
  }
  if (step === 4) {
    if (s.customer.name.trim().length < 2) e["customer.name"] = "Enter your full name";
    if (!/^\d{10}$/.test(s.customer.mobile))
      e["customer.mobile"] = "10-digit mobile number";
    if (s.customer.whatsapp && !/^\d{10}$/.test(s.customer.whatsapp))
      e["customer.whatsapp"] = "10-digit WhatsApp number";
    if (!s.customer.city.trim()) e["customer.city"] = "City required";
  }
  return e;
}

// ─────────────────────────────────────────────────────────────────────────────
// WhatsApp message
// ─────────────────────────────────────────────────────────────────────────────

function buildMessage(opts: {
  svc: PhotoService;
  state: BookingState;
  orderId: string;
}) {
  const { svc, state: s, orderId } = opts;
  const lines: (string | false)[] = [
    `*New Photography & Film Booking*`,
    `Order ID: ${orderId}`,
    ``,
    `*Service*: ${svc.name}`,
    !!s.extra.package && `Package: ${s.extra.package}`,
    ``,
    `*Event*`,
    `• Type: ${s.event.type}`,
    `• Date: ${s.event.date}`,
    !!s.event.time && `• Time: ${s.event.time}`,
    `• Days: ${s.event.days}`,
    `• Venue: ${s.event.venueName}`,
    `• Address: ${s.event.venueAddress}`,
    !!s.event.mapLink && `• Map: ${s.event.mapLink}`,
    `• Indoor/Outdoor: ${s.event.venueKind}`,
    ``,
    `*Services Required*`,
    ...(s.services.length ? s.services.map((x) => `• ${x}`) : ["• —"]),
    !!s.customRequirements.trim() && `• Custom: ${s.customRequirements.trim()}`,
    ``,
    `*Coverage Details*`,
    !!s.coverage.guests && `• Guests: ${s.coverage.guests}`,
    !!s.coverage.cameras && `• Cameras: ${s.coverage.cameras}`,
    !!s.coverage.photographers && `• Photographers: ${s.coverage.photographers}`,
    !!s.coverage.videographers && `• Videographers: ${s.coverage.videographers}`,
    !!s.coverage.femalePhotographer &&
      `• Female Photographer: ${s.coverage.femalePhotographer}`,
    !!s.coverage.droneOperator && `• Drone Operator: ${s.coverage.droneOperator}`,
    !!s.coverage.sameDayEdit && `• Same-Day Editing: ${s.coverage.sameDayEdit}`,
    ``,
    `*Customer*`,
    `• Name: ${s.customer.name}`,
    `• Mobile: +91 ${s.customer.mobile}`,
    `• WhatsApp: +91 ${s.customer.whatsapp || s.customer.mobile}`,
    !!s.customer.email && `• Email: ${s.customer.email}`,
    `• City: ${s.customer.city}${s.customer.state ? `, ${s.customer.state}` : ""}`,
    !!s.customer.address && `• Address: ${s.customer.address}`,
    ``,
    `*Additional*`,
    !!s.extra.budget && `• Budget: ${s.extra.budget}`,
    !!s.extra.editStyle && `• Editing Style: ${s.extra.editStyle}`,
    !!s.extra.refLinks && `• References: ${s.extra.refLinks}`,
    !!s.extra.specialInstructions &&
      `• Special Instructions: ${s.extra.specialInstructions}`,
    !!s.extra.notes && `• Notes: ${s.extra.notes}`,
    ``,
    `Please contact the customer to confirm.`,
  ];
  return lines.filter(Boolean).join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal shell
// ─────────────────────────────────────────────────────────────────────────────

export function PhotoBookingModal({
  svc,
  open,
  onOpenChange,
  preselectedPackage = "",
}: {
  svc: PhotoService | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  preselectedPackage?: string;
}) {
  return (
    <Dialog open={open && !!svc} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[96vw] max-h-[92vh] p-0 overflow-hidden bg-background border-gold-hairline">
        {svc && (
          <PhotoBookingBody
            svc={svc}
            preselectedPackage={preselectedPackage}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PhotoBookingBody({
  svc,
  preselectedPackage,
  onClose,
}: {
  svc: PhotoService;
  preselectedPackage: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<BookingState>(() =>
    emptyBooking(svc, preselectedPackage),
  );
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sixDigit, setSixDigit] = useState<string>("");
  const [committed, setCommitted] = useState(false);
  const committedRef = useRef(false);

  const visibleSteps = [1, 2, 3, 4, 5];

  useEffect(() => {
    const id = reserveOrderId();
    setSixDigit(id);
    return () => {
      if (!committedRef.current) releaseOrderId(id);
    };
  }, []);

  const orderId = useMemo(
    () => (sixDigit ? formatPhotoOrderId(sixDigit) : ""),
    [sixDigit],
  );

  // Draft persistence per service
  const draftKey = `mysanyoga:photo-booking-draft:${svc.slug}`;
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(draftKey);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {/* */}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svc.slug]);
  useEffect(() => {
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(state));
    } catch {/* */}
  }, [state, draftKey]);

  // Live revalidation: clear errors as soon as user fixes them
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    setErrors(validateStep(step, state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, step]);

  const setEvent = <K extends keyof BookingState["event"]>(
    k: K,
    v: BookingState["event"][K],
  ) => setState((s) => ({ ...s, event: { ...s.event, [k]: v } }));

  const setCoverage = <K extends keyof BookingState["coverage"]>(
    k: K,
    v: BookingState["coverage"][K],
  ) => setState((s) => ({ ...s, coverage: { ...s.coverage, [k]: v } }));

  const setCustomer = <K extends keyof BookingState["customer"]>(
    k: K,
    v: BookingState["customer"][K],
  ) => setState((s) => ({ ...s, customer: { ...s.customer, [k]: v } }));

  const setExtra = <K extends keyof BookingState["extra"]>(
    k: K,
    v: BookingState["extra"][K],
  ) => setState((s) => ({ ...s, extra: { ...s.extra, [k]: v } }));

  const toggleService = (name: string) =>
    setState((s) => ({
      ...s,
      services: s.services.includes(name)
        ? s.services.filter((x) => x !== name)
        : [...s.services, name],
    }));

  const onNext = () => {
    const e = validateStep(step, state);
    setErrors(e);
    if (Object.keys(e).length) return;
    const i = visibleSteps.indexOf(step);
    if (i < visibleSteps.length - 1) setStep(visibleSteps[i + 1]);
  };
  const onBack = () => {
    const i = visibleSteps.indexOf(step);
    if (i > 0) setStep(visibleSteps[i - 1]);
  };

  const message = useMemo(
    () => buildMessage({ svc, state, orderId }),
    [svc, state, orderId],
  );

  const onSend = () => {
    commitOrderId(sixDigit);
    committedRef.current = true;
    setCommitted(true);
    try { sessionStorage.removeItem(draftKey); } catch {/* */}
  };

  const selectedPackage = svc.packages.find((p) => p.name === state.extra.package);
  const indicativeTotal = selectedPackage?.price ?? svc.startingPrice;

  return (
    <div className="flex flex-col h-full max-h-[92vh]">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 md:px-7 py-4 border-b border-gold-hairline shrink-0">
        <div
          className="hidden md:grid place-items-center w-12 h-16 rounded overflow-hidden border border-gold-hairline shrink-0 text-2xl"
          style={{ background: PHOTO_PALETTES[svc.samplePhotos[0] ?? "royal"] }}
          aria-hidden
        >
          {svc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <DialogTitle className="font-display text-lg md:text-2xl truncate">
            Book: {svc.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
            <span>{svc.tagline}</span>
            <span>From {formatINR(svc.startingPrice)}</span>
            <span>Order ID · <span className="font-mono text-foreground">{orderId || "—"}</span></span>
          </DialogDescription>
        </div>
        <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-card/60">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-5 md:px-7 pt-4 shrink-0">
        <ProgressBar visibleSteps={visibleSteps} current={step} />
      </div>

      {/* Body */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6 px-5 md:px-7 py-5 overflow-y-auto flex-1 min-h-0">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
            >
              {step === 1 && <StepEvent state={state} setEvent={setEvent} errors={errors} />}
              {step === 2 && (
                <StepServices
                  state={state}
                  toggleService={toggleService}
                  setCustomRequirements={(v) =>
                    setState((s) => ({ ...s, customRequirements: v }))
                  }
                  errors={errors}
                />
              )}
              {step === 3 && (
                <StepCoverage state={state} setCoverage={setCoverage} errors={errors} />
              )}
              {step === 4 && (
                <StepCustomer state={state} setCustomer={setCustomer} errors={errors} />
              )}
              {step === 5 && (
                <StepReview
                  svc={svc}
                  state={state}
                  setExtra={setExtra}
                  orderId={orderId}
                  committed={committed}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {Object.keys(errors).length > 0 && step !== 5 && (
            <div className="mt-4 flex gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Please fix the highlighted fields before continuing.
            </div>
          )}
        </div>

        <Sidebar
          svc={svc}
          state={state}
          indicativeTotal={indicativeTotal}
          orderId={orderId}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-5 md:px-7 py-4 border-t border-gold-hairline shrink-0 bg-background">
        <button
          onClick={onBack}
          disabled={visibleSteps.indexOf(step) === 0}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-gold-hairline text-xs uppercase tracking-[0.18em] disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </button>
        <div className="text-xs text-muted-foreground hidden sm:block">
          Indicative <span className="text-gradient-gold font-display text-lg">{formatINR(indicativeTotal)}</span>
        </div>
        {step !== 5 ? (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-medium text-primary-foreground shadow-gold-glow"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <a
            href={waLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onSend}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-medium text-primary-foreground shadow-gold-glow"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Send on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Steps
// ─────────────────────────────────────────────────────────────────────────────

function StepEvent({
  state,
  setEvent,
  errors,
}: {
  state: BookingState;
  setEvent: <K extends keyof BookingState["event"]>(k: K, v: BookingState["event"][K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <StepHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Step 1 of 5"
        title="Event information"
        subtitle="Tell us about the occasion so we can plan the right crew."
      />
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <LabeledSelect
          label="Event Type"
          required
          value={state.event.type}
          onChange={(v) => setEvent("type", v)}
          options={EVENT_TYPES}
          error={errors["event.type"]}
        />
        <LabeledInput
          label="Event Date"
          required
          type="date"
          value={state.event.date}
          onChange={(v) => setEvent("date", v)}
          error={errors["event.date"]}
        />
        <LabeledInput
          label="Event Time"
          type="time"
          value={state.event.time}
          onChange={(v) => setEvent("time", v)}
        />
        <LabeledInput
          label="Number of Event Days"
          required
          type="number"
          value={String(state.event.days)}
          onChange={(v) => setEvent("days", Math.max(1, Number(v) || 1))}
          error={errors["event.days"]}
        />
        <LabeledInput
          label="Venue Name"
          required
          placeholder="e.g. Taj Banquet Hall"
          value={state.event.venueName}
          onChange={(v) => setEvent("venueName", v)}
          error={errors["event.venueName"]}
        />
        <LabeledSelect
          label="Indoor / Outdoor"
          value={state.event.venueKind}
          onChange={(v) => setEvent("venueKind", v as BookingState["event"]["venueKind"])}
          options={[...VENUE_KINDS]}
        />
        <div className="sm:col-span-2">
          <LabeledTextarea
            label="Full Venue Address"
            required
            placeholder="House / Hall, Street, Area, City, PIN"
            value={state.event.venueAddress}
            onChange={(v) => setEvent("venueAddress", v)}
            error={errors["event.venueAddress"]}
          />
        </div>
        <div className="sm:col-span-2">
          <LabeledInput
            label="Google Maps Location (Optional)"
            placeholder="https://maps.app.goo.gl/…"
            value={state.event.mapLink}
            onChange={(v) => setEvent("mapLink", v)}
          />
        </div>
      </div>
    </div>
  );
}

function StepServices({
  state,
  toggleService,
  setCustomRequirements,
  errors,
}: {
  state: BookingState;
  toggleService: (name: string) => void;
  setCustomRequirements: (v: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <StepHeader
        icon={<Camera className="h-3.5 w-3.5" />}
        eyebrow="Step 2 of 5"
        title="Services required"
        subtitle="Pick everything you'd like included. You can refine later on call."
      />
      {errors.services && (
        <div className="mt-3 text-xs text-destructive">{errors.services}</div>
      )}
      <div className="grid sm:grid-cols-2 gap-2 mt-5">
        {SERVICE_OPTIONS.map((name) => {
          const active = state.services.includes(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggleService(name)}
              className={`text-left rounded-xl border px-4 py-3 text-sm transition flex items-center gap-3 ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-gold-hairline hover:border-primary/60 bg-card/40"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-md grid place-items-center border shrink-0 ${
                  active
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-gold-hairline"
                }`}
              >
                {active && <Check className="h-3 w-3" />}
              </span>
              {name}
            </button>
          );
        })}
      </div>
      <div className="mt-6">
        <LabeledTextarea
          label="Other Custom Requirements"
          placeholder="Anything specific not listed above…"
          value={state.customRequirements}
          onChange={setCustomRequirements}
        />
      </div>
    </div>
  );
}

function StepCoverage({
  state,
  setCoverage,
  errors,
}: {
  state: BookingState;
  setCoverage: <K extends keyof BookingState["coverage"]>(
    k: K,
    v: BookingState["coverage"][K],
  ) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <StepHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Step 3 of 5"
        title="Coverage details"
        subtitle="Help us right-size the crew and gear for your day."
      />
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <LabeledInput
          label="Approx. Guest Count"
          type="number"
          placeholder="e.g. 250"
          value={state.coverage.guests}
          onChange={(v) => setCoverage("guests", v)}
        />
        <LabeledInput
          label="Number of Cameras"
          type="number"
          placeholder="e.g. 3"
          value={state.coverage.cameras}
          onChange={(v) => setCoverage("cameras", v)}
        />
        <LabeledInput
          label="Number of Photographers"
          type="number"
          placeholder="e.g. 2"
          value={state.coverage.photographers}
          onChange={(v) => setCoverage("photographers", v)}
        />
        <LabeledInput
          label="Number of Videographers"
          type="number"
          placeholder="e.g. 2"
          value={state.coverage.videographers}
          onChange={(v) => setCoverage("videographers", v)}
        />
        <YesNoRow
          label="Need Separate Female Photographer?"
          value={state.coverage.femalePhotographer}
          onChange={(v) => setCoverage("femalePhotographer", v)}
          error={errors["coverage.femalePhotographer"]}
        />
        <YesNoRow
          label="Need Drone Operator?"
          value={state.coverage.droneOperator}
          onChange={(v) => setCoverage("droneOperator", v)}
          error={errors["coverage.droneOperator"]}
        />
        <YesNoRow
          label="Need Same-Day Editing?"
          value={state.coverage.sameDayEdit}
          onChange={(v) => setCoverage("sameDayEdit", v)}
          error={errors["coverage.sameDayEdit"]}
        />
      </div>
    </div>
  );
}

function StepCustomer({
  state,
  setCustomer,
  errors,
}: {
  state: BookingState;
  setCustomer: <K extends keyof BookingState["customer"]>(
    k: K,
    v: BookingState["customer"][K],
  ) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <StepHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Step 4 of 5"
        title="Your contact details"
        subtitle="So our team can confirm and coordinate."
      />
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <LabeledInput label="Full Name" required placeholder="Enter your name" value={state.customer.name} onChange={(v) => setCustomer("name", v)} error={errors["customer.name"]} />
        <LabeledInput label="Mobile Number" required type="tel" placeholder="10-digit mobile" value={state.customer.mobile} onChange={(v) => setCustomer("mobile", v)} error={errors["customer.mobile"]} />
        <LabeledInput label="WhatsApp Number (Optional)" type="tel" placeholder="If different from mobile" value={state.customer.whatsapp} onChange={(v) => setCustomer("whatsapp", v)} error={errors["customer.whatsapp"]} />
        <LabeledInput label="Email (Optional)" type="email" placeholder="you@example.com" value={state.customer.email} onChange={(v) => setCustomer("email", v)} />
        <LabeledInput label="City" required placeholder="Enter city" value={state.customer.city} onChange={(v) => setCustomer("city", v)} error={errors["customer.city"]} />
        <LabeledInput label="State" placeholder="Enter state" value={state.customer.state} onChange={(v) => setCustomer("state", v)} />
        <div className="sm:col-span-2">
          <LabeledTextarea label="Complete Address (Optional)" placeholder="House / Flat, Street, Landmark" value={state.customer.address} onChange={(v) => setCustomer("address", v)} />
        </div>
      </div>
    </div>
  );
}

function StepReview({
  svc,
  state,
  setExtra,
  orderId,
  committed,
}: {
  svc: PhotoService;
  state: BookingState;
  setExtra: <K extends keyof BookingState["extra"]>(k: K, v: BookingState["extra"][K]) => void;
  orderId: string;
  committed: boolean;
}) {
  return (
    <div>
      <StepHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Step 5 of 5"
        title="Review & send"
        subtitle="Add any final preferences below, then send on WhatsApp."
      />

      <div className="mt-5 rounded-2xl border border-gold-hairline bg-card/50 p-5">
        <div className="grid sm:grid-cols-[140px_1fr] gap-4">
          <div
            className="rounded-xl h-32 grid place-items-center text-4xl border border-gold-hairline"
            style={{ background: PHOTO_PALETTES[svc.samplePhotos[0] ?? "royal"] }}
          >
            {svc.icon}
          </div>
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{svc.tagline}</div>
            <div className="font-display text-2xl">{svc.name}</div>
            <div className="text-xs text-muted-foreground">From {formatINR(svc.startingPrice)} · {svc.deliveryTime}</div>
            <div className="text-xs text-muted-foreground">Order ID · <span className="text-foreground font-mono">{orderId}</span></div>
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <LabeledSelect
          label="Package"
          value={state.extra.package}
          onChange={(v) => setExtra("package", v)}
          options={svc.packages.map((p) => p.name)}
        />
        <LabeledSelect
          label="Budget Range"
          value={state.extra.budget}
          onChange={(v) => setExtra("budget", v)}
          options={BUDGET_RANGES}
        />
        <LabeledSelect
          label="Preferred Editing Style"
          value={state.extra.editStyle}
          onChange={(v) => setExtra("editStyle", v)}
          options={EDIT_STYLES}
        />
        <LabeledInput
          label="Reference Links (Optional)"
          placeholder="Instagram / YouTube / Pinterest"
          value={state.extra.refLinks}
          onChange={(v) => setExtra("refLinks", v)}
        />
        <div className="sm:col-span-2">
          <LabeledTextarea
            label="Special Instructions"
            placeholder="Anything our crew should know in advance"
            value={state.extra.specialInstructions}
            onChange={(v) => setExtra("specialInstructions", v)}
          />
        </div>
        <div className="sm:col-span-2">
          <LabeledTextarea
            label="Additional Notes"
            placeholder="Anything else"
            value={state.extra.notes}
            onChange={(v) => setExtra("notes", v)}
          />
        </div>
      </div>

      <SummaryGroup title="Event">
        <SummaryItem k="Type" v={state.event.type} />
        <SummaryItem k="Date" v={state.event.date} />
        {state.event.time && <SummaryItem k="Time" v={state.event.time} />}
        <SummaryItem k="Days" v={String(state.event.days)} />
        <SummaryItem k="Venue" v={`${state.event.venueName} — ${state.event.venueAddress}`} />
        {state.event.mapLink && <SummaryItem k="Map" v={state.event.mapLink} />}
        <SummaryItem k="Indoor/Outdoor" v={state.event.venueKind} />
      </SummaryGroup>

      <SummaryGroup title="Services">
        {state.services.map((s) => <SummaryItem key={s} k="•" v={s} />)}
        {state.customRequirements && (
          <SummaryItem k="Custom" v={state.customRequirements} />
        )}
      </SummaryGroup>

      <SummaryGroup title="Coverage">
        {state.coverage.guests && <SummaryItem k="Guests" v={state.coverage.guests} />}
        {state.coverage.cameras && <SummaryItem k="Cameras" v={state.coverage.cameras} />}
        {state.coverage.photographers && (
          <SummaryItem k="Photographers" v={state.coverage.photographers} />
        )}
        {state.coverage.videographers && (
          <SummaryItem k="Videographers" v={state.coverage.videographers} />
        )}
        {state.coverage.femalePhotographer && (
          <SummaryItem k="Female Photographer" v={state.coverage.femalePhotographer} />
        )}
        {state.coverage.droneOperator && (
          <SummaryItem k="Drone Operator" v={state.coverage.droneOperator} />
        )}
        {state.coverage.sameDayEdit && (
          <SummaryItem k="Same-Day Edit" v={state.coverage.sameDayEdit} />
        )}
      </SummaryGroup>

      <SummaryGroup title="Customer">
        <SummaryItem k="Name" v={state.customer.name} />
        <SummaryItem k="Mobile" v={state.customer.mobile} />
        {state.customer.whatsapp && <SummaryItem k="WhatsApp" v={state.customer.whatsapp} />}
        {state.customer.email && <SummaryItem k="Email" v={state.customer.email} />}
        <SummaryItem k="City" v={`${state.customer.city}${state.customer.state ? `, ${state.customer.state}` : ""}`} />
        {state.customer.address && <SummaryItem k="Address" v={state.customer.address} />}
      </SummaryGroup>

      {committed && (
        <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300 flex items-center gap-2">
          <Check className="h-4 w-4" /> Order ID {orderId} locked in. Your WhatsApp draft is ready.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────

function Sidebar({
  svc,
  state,
  indicativeTotal,
  orderId,
}: {
  svc: PhotoService;
  state: BookingState;
  indicativeTotal: number;
  orderId: string;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-2 rounded-2xl border border-gold-hairline bg-card/40 p-5">
        <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
          Booking Summary
        </div>
        <div className="font-display text-xl">{svc.name}</div>
        <div className="text-xs text-muted-foreground">{svc.tagline}</div>

        <div className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Order ID
        </div>
        <div className="font-mono text-sm">{orderId || "—"}</div>

        <div className="mt-4 grid gap-2 text-sm">
          <Row k="Event" v={state.event.type || "—"} />
          <Row k="Date" v={state.event.date || "—"} />
          <Row k="Days" v={String(state.event.days)} />
          <Row k="Services" v={String(state.services.length)} />
          <Row k="Package" v={state.extra.package || "—"} />
        </div>

        <div className="mt-5 pt-4 border-t border-gold-hairline">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Indicative starting price
          </div>
          <div className="font-display text-3xl text-gradient-gold">
            {formatINR(indicativeTotal)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Final quote shared on WhatsApp after we review your event details.
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UI primitives (kept in-file to mirror OrderModal's look without duplication)
// ─────────────────────────────────────────────────────────────────────────────

function StepHeader({
  icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-primary inline-flex items-center gap-2">
        {icon}
        {eyebrow}
      </div>
      <h2 className="font-display text-2xl md:text-3xl mt-1">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

function ProgressBar({ visibleSteps, current }: { visibleSteps: number[]; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {visibleSteps.map((s, i) => {
        const isActive = s === current;
        const isDone = visibleSteps.indexOf(current) > i;
        return (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={`h-7 w-7 rounded-full grid place-items-center text-[11px] font-medium shrink-0 transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-gold-glow"
                  : isDone
                  ? "bg-primary/30 text-primary-foreground"
                  : "bg-card border border-gold-hairline text-muted-foreground"
              }`}
            >
              {isDone ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-muted-foreground truncate">
              {STEPS[s - 1]}
            </span>
            {i < visibleSteps.length - 1 && (
              <div className={`flex-1 h-px ${isDone ? "bg-primary/60" : "bg-gold-hairline"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function LabeledInput({
  label,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <Lbl label={label} required={required} />
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls(error)}
      />
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </label>
  );
}

function LabeledTextarea(props: {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <Lbl label={props.label} required={props.required} />
      <textarea
        rows={3}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className={inputCls(props.error)}
      />
      {props.error && <div className="mt-1 text-xs text-destructive">{props.error}</div>}
    </label>
  );
}

function LabeledSelect(props: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <label className="block">
      <Lbl label={props.label} required={props.required} />
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className={inputCls(props.error)}
      >
        <option value="">Select an Option</option>
        {props.options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {props.error && <div className="mt-1 text-xs text-destructive">{props.error}</div>}
    </label>
  );
}

function YesNoRow({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
  error?: string;
}) {
  return (
    <div>
      <Lbl label={label} />
      <div className="flex gap-2">
        {(["Yes", "No"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(value === opt ? "" : opt)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-xs uppercase tracking-[0.18em] border transition ${
              value === opt
                ? "bg-primary text-primary-foreground border-primary"
                : "border-gold-hairline text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}

function Lbl({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
      {label} {required && <span className="text-destructive">*</span>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full rounded-xl border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 transition ${
    error
      ? "border-destructive ring-destructive/30"
      : "border-gold-hairline focus:border-primary/60 focus:ring-primary/20"
  }`;
}

function SummaryGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const arr = Array.isArray(children) ? children.filter(Boolean) : [children];
  if (arr.length === 0) return null;
  return (
    <div className="mt-5">
      <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-2">{title}</div>
      <div className="rounded-2xl border border-gold-hairline bg-card/40 divide-y divide-gold-hairline/40">
        {children}
      </div>
    </div>
  );
}

function SummaryItem({ k, v }: { k: string; v: string }) {
  if (!v) return null;
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
      <div className="text-muted-foreground">{k}</div>
      <div className="text-right text-foreground break-words max-w-[60%]">{v}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-xs uppercase tracking-[0.15em]">{k}</span>
      <span className="text-foreground text-sm">{v}</span>
    </div>
  );
}