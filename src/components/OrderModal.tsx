import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Plus,
  Trash2,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getFormSchema,
  getCategory,
  formatINR,
  type InvitationCard,
  type FormField,
} from "@/lib/invitations";
import {
  ADDONS,
  LANGUAGES,
  QUANTITY_PRESETS,
  WEDDING_FUNCTIONS,
  buildOrderMessage,
  calculateOrder,
  emptyOrder,
  validateStep,
  type OrderState,
  type WeddingFunction,
} from "@/lib/invitation-order";
import { CardCover } from "@/components/CardCover";
import { waLink } from "@/lib/site";
import {
  commitOrderId,
  releaseOrderId,
  reserveOrderId,
} from "@/lib/order-id";

export function OrderModal({
  card,
  open,
  onOpenChange,
}: {
  card: InvitationCard | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open && !!card} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[96vw] max-h-[92vh] p-0 overflow-hidden bg-background border-gold-hairline">
        {card && <OrderModalBody card={card} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

const STEPS = ["Event", "Design & Add-ons", "Quantity", "Customer", "Review"] as const;

function OrderModalBody({ card, onClose }: { card: InvitationCard; onClose: () => void }) {
  const schema = getFormSchema(card.category);
  const category = getCategory(card.category);
  const isPrinted = card.type === "printed";

  const [state, setState] = useState<OrderState>(() => emptyOrder(card));
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<string>("");
  const [committed, setCommitted] = useState(false);
  const committedRef = useRef(false);

  // visible steps depend on card type
  const visibleSteps = useMemo(() => {
    if (isPrinted) return [1, 2, 3, 4, 5];
    return [1, 2, 4, 5]; // skip Quantity for digital
  }, [isPrinted]);

  // Reserve order ID on mount, release on unmount if not committed
  useEffect(() => {
    const id = reserveOrderId();
    setOrderId(id);
    return () => {
      if (!committedRef.current) releaseOrderId(id);
    };
  }, []);

  // sessionStorage draft persistence keyed by card
  const draftKey = `mysanyoga:order-draft:${card.code}`;
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(draftKey);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {/* */}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.code]);
  useEffect(() => {
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(state));
    } catch {/* */}
  }, [state, draftKey]);

  const price = useMemo(() => calculateOrder(card, state), [card, state]);

  // Live re-validation: once errors are shown, clear them as soon as the user
  // corrects the offending fields. Prevents stale errors on Next.
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const e = validateStep(step, card, stepSchema, state);
    setErrors(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, step]);

  const setField = (k: string, v: string) => {
    setState((s) => ({ ...s, fields: { ...s.fields, [k]: v } }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const setCustomer = (k: keyof OrderState["customer"], v: string) => {
    setState((s) => ({ ...s, customer: { ...s.customer, [k]: v } }));
    const ek = `customer.${k}`;
    if (errors[ek]) setErrors((e) => ({ ...e, [ek]: "" }));
  };
  const setDesign = <K extends keyof OrderState["design"]>(
    k: K,
    v: OrderState["design"][K]
  ) => {
    setState((s) => ({ ...s, design: { ...s.design, [k]: v } }));
    const ek = `design.${String(k)}`;
    if (errors[ek]) setErrors((e) => ({ ...e, [ek]: "" }));
  };

  const toggleAddOn = (id: string) => {
    setState((s) => ({
      ...s,
      addOnIds: s.addOnIds.includes(id)
        ? s.addOnIds.filter((x) => x !== id)
        : [...s.addOnIds, id],
    }));
  };

  // Only fields that are actually rendered in Step 1 (Event) should gate Next.
  // Shared keys (customer/quantity/language/theme) are collected in later steps.
  const SHARED_KEYS = ["customerName", "phone", "deliveryAddress", "quantity", "language", "theme"];
  const stepSchema = schema
    .filter((f) => !SHARED_KEYS.includes(f.key))
    .map((f) => ({ key: f.key, label: f.label, required: !!f.required }));

  const onNext = () => {
    const e = validateStep(step, card, stepSchema, state);
    setErrors(e);
    if (Object.keys(e).length) return;
    const i = visibleSteps.indexOf(step);
    if (i < visibleSteps.length - 1) setStep(visibleSteps[i + 1]);
  };
  const onBack = () => {
    const i = visibleSteps.indexOf(step);
    if (i > 0) setStep(visibleSteps[i - 1]);
  };

  const onSend = () => {
    commitOrderId(orderId);
    committedRef.current = true;
    setCommitted(true);
    try { sessionStorage.removeItem(draftKey); } catch {/* */}
  };

  const message = useMemo(
    () =>
      buildOrderMessage({
        card,
        categoryName: category?.name ?? card.category,
        state,
        price,
        orderId,
        schema: schema.map((f) => ({ key: f.key, label: f.label })),
      }),
    [card, category, state, price, orderId, schema]
  );

  return (
    <div className="flex flex-col h-full max-h-[92vh]">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 md:px-7 py-4 border-b border-gold-hairline shrink-0">
        <div className="hidden md:block w-12 h-16 rounded overflow-hidden border border-gold-hairline shrink-0">
          <CardCover card={card} />
        </div>
        <div className="flex-1 min-w-0">
          <DialogTitle className="font-display text-lg md:text-2xl truncate">
            Order: {card.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
            <span>#{card.code}</span>
            <span>{category?.name}</span>
            <span>{card.type === "digital" ? "Digital" : "Printed"}</span>
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

      {/* Body grid */}
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
              {step === 1 && (
                <StepEvent
                  card={card}
                  schema={schema}
                  state={state}
                  setField={setField}
                  setFunctions={(fns) => setState((s) => ({ ...s, functions: fns }))}
                  errors={errors}
                />
              )}
              {step === 2 && (
                <StepDesign
                  card={card}
                  state={state}
                  setDesign={setDesign}
                  toggleAddOn={toggleAddOn}
                  errors={errors}
                />
              )}
              {step === 3 && isPrinted && (
                <StepQuantity
                  card={card}
                  state={state}
                  setState={setState}
                  errors={errors}
                />
              )}
              {step === 4 && (
                <StepCustomer
                  card={card}
                  state={state}
                  setCustomer={setCustomer}
                  errors={errors}
                />
              )}
              {step === 5 && (
                <StepReview
                  card={card}
                  categoryName={category?.name ?? card.category}
                  state={state}
                  price={price}
                  schema={schema}
                  orderId={orderId}
                  committed={committed}
                  message={message}
                  onSend={onSend}
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

        <PriceSidebar card={card} state={state} price={price} />
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
          Total <span className="text-gradient-gold font-display text-lg">{formatINR(price.total)}</span>
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
            <MessageCircle className="h-3.5 w-3.5" /> Place Order on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

// ----------------- Steps -----------------

function StepEvent({
  card,
  schema,
  state,
  setField,
  setFunctions,
  errors,
}: {
  card: InvitationCard;
  schema: FormField[];
  state: OrderState;
  setField: (k: string, v: string) => void;
  setFunctions: (fns: WeddingFunction[]) => void;
  errors: Record<string, string>;
}) {
  // Filter out shared fields that we collect in the Customer step
  const eventFields = schema.filter(
    (f) => !["customerName", "phone", "deliveryAddress", "quantity", "language", "theme"].includes(f.key)
  );

  return (
    <div>
      <StepHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Step 1 of 5"
        title="Tell us about your event"
        subtitle="We'll personalise the card with the details below."
      />

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        {eventFields.map((f) => (
          <FieldRow key={f.key} field={f} value={state.fields[f.key] ?? ""} setValue={(v) => setField(f.key, v)} error={errors[f.key]} />
        ))}
      </div>

      {card.category === "wedding" && (
        <div className="mt-8">
          <h3 className="font-display text-lg mb-2">Wedding Functions</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Tap the functions you want printed on the card. Add date, time and venue for each.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {WEDDING_FUNCTIONS.map((name) => {
              const active = state.functions.some((f) => f.name === name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    if (active) setFunctions(state.functions.filter((f) => f.name !== name));
                    else
                      setFunctions([
                        ...state.functions,
                        { name, date: "", time: "", venue: "", mapLink: "" },
                      ]);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs border transition ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-gold-hairline text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && <Check className="h-3 w-3 inline mr-1" />}
                  {name}
                </button>
              );
            })}
          </div>
          {errors.__functions && <div className="text-xs text-destructive mb-2">{errors.__functions}</div>}

          <div className="space-y-3">
            {state.functions.map((fn, i) => (
              <div key={fn.name} className="rounded-2xl border border-gold-hairline bg-card/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-display text-base">{fn.name}</div>
                  <button
                    onClick={() => setFunctions(state.functions.filter((x) => x.name !== fn.name))}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <LabeledInput
                    label="Date"
                    type="date"
                    value={fn.date}
                    onChange={(v) =>
                      setFunctions(state.functions.map((x) => (x.name === fn.name ? { ...x, date: v } : x)))
                    }
                    error={errors[`fn-${i}-date`]}
                  />
                  <LabeledInput
                    label="Time"
                    type="time"
                    value={fn.time}
                    onChange={(v) =>
                      setFunctions(state.functions.map((x) => (x.name === fn.name ? { ...x, time: v } : x)))
                    }
                    error={errors[`fn-${i}-time`]}
                  />
                  <LabeledInput
                    label="Venue"
                    placeholder="Hall name + area"
                    value={fn.venue}
                    onChange={(v) =>
                      setFunctions(state.functions.map((x) => (x.name === fn.name ? { ...x, venue: v } : x)))
                    }
                    error={errors[`fn-${i}-venue`]}
                  />
                  <LabeledInput
                    label="Google Maps Link (Optional)"
                    placeholder="https://maps.app.goo.gl/…"
                    value={fn.mapLink}
                    onChange={(v) =>
                      setFunctions(state.functions.map((x) => (x.name === fn.name ? { ...x, mapLink: v } : x)))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepDesign({
  card,
  state,
  setDesign,
  toggleAddOn,
  errors,
}: {
  card: InvitationCard;
  state: OrderState;
  setDesign: <K extends keyof OrderState["design"]>(k: K, v: OrderState["design"][K]) => void;
  toggleAddOn: (id: string) => void;
  errors: Record<string, string>;
}) {
  const applicableAddOns = ADDONS.filter(
    (a) => a.appliesTo === "both" || a.appliesTo === card.type
  );
  return (
    <div>
      <StepHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Step 2 of 5"
        title="Design preferences & add-ons"
        subtitle="Make it yours. Add-ons update the price live."
      />

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <LabeledSelect
          label="Language"
          required
          value={state.design.language}
          onChange={(v) => setDesign("language", v)}
          options={LANGUAGES}
          error={errors["design.language"]}
        />
        <LabeledInput
          label="Preferred Theme"
          placeholder="e.g. Traditional Royal"
          value={state.design.theme}
          onChange={(v) => setDesign("theme", v)}
        />
        <LabeledInput
          label="Colour Preference"
          placeholder="e.g. Maroon & Gold"
          value={state.design.color}
          onChange={(v) => setDesign("color", v)}
        />
        <LabeledInput
          label="Font Style"
          placeholder="e.g. Calligraphy"
          value={state.design.font}
          onChange={(v) => setDesign("font", v)}
        />
        <LabeledSelect
          label="Orientation"
          value={state.design.orientation}
          onChange={(v) => setDesign("orientation", v)}
          options={["Portrait", "Landscape", "Square"]}
        />
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <CheckRow label="Include QR Code (RSVP)" checked={state.design.includeQR} onChange={(v) => setDesign("includeQR", v)} />
        <CheckRow label="Include Google Maps" checked={state.design.includeMaps} onChange={(v) => setDesign("includeMaps", v)} />
        {card.type === "digital" && (
          <>
            <CheckRow label="Background Music" checked={state.design.includeMusic} onChange={(v) => setDesign("includeMusic", v)} />
            <CheckRow label="Premium Animation" checked={state.design.includeAnimation} onChange={(v) => setDesign("includeAnimation", v)} />
          </>
        )}
      </div>

      <h3 className="font-display text-lg mt-8 mb-3">Premium Add-ons</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {applicableAddOns.map((a) => {
          const active = state.addOnIds.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggleAddOn(a.id)}
              className={`text-left rounded-2xl border p-4 transition ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-gold-hairline hover:border-primary/60 bg-card/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{a.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {a.unit === "percent"
                      ? `+${a.price}% on subtotal`
                      : a.unit === "per-card"
                      ? `${formatINR(a.price)} per card`
                      : `${formatINR(a.price)} flat`}
                  </div>
                </div>
                <div
                  className={`h-5 w-5 rounded-full grid place-items-center border ${
                    active ? "bg-primary border-primary text-primary-foreground" : "border-gold-hairline"
                  }`}
                >
                  {active && <Check className="h-3 w-3" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepQuantity({
  card,
  state,
  setState,
  errors,
}: {
  card: InvitationCard;
  state: OrderState;
  setState: React.Dispatch<React.SetStateAction<OrderState>>;
  errors: Record<string, string>;
}) {
  const setQty = (n: number) => setState((s) => ({ ...s, quantity: Math.max(0, n) }));
  return (
    <div>
      <StepHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Step 3 of 5"
        title="Quantity & delivery"
        subtitle={`Minimum order: ${card.minOrder} cards.`}
      />
      <div className="mt-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Quick pick
        </div>
        <div className="flex flex-wrap gap-2">
          {QUANTITY_PRESETS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQty(q)}
              className={`px-4 py-2 rounded-full text-xs border ${
                state.quantity === q
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-gold-hairline hover:text-foreground text-muted-foreground"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="mt-4 max-w-xs">
          <LabeledInput
            label="Custom quantity"
            type="number"
            value={String(state.quantity)}
            onChange={(v) => setQty(Number(v) || 0)}
            error={errors.__qty}
          />
        </div>
      </div>
      {card.deliveryAvailable && (
        <div className="mt-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Delivery
          </div>
          <div className="grid grid-cols-2 gap-2 max-w-md">
            {(["delivery", "pickup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setState((s) => ({ ...s, delivery: m }))}
                className={`rounded-xl px-4 py-3 text-xs uppercase tracking-[0.18em] border ${
                  state.delivery === m
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-gold-hairline text-muted-foreground"
                }`}
              >
                {m === "delivery" ? `Home Delivery (${formatINR(card.deliveryCharge)})` : "Self Pickup (FREE)"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepCustomer({
  card,
  state,
  setCustomer,
  errors,
}: {
  card: InvitationCard;
  state: OrderState;
  setCustomer: (k: keyof OrderState["customer"], v: string) => void;
  errors: Record<string, string>;
}) {
  const needsAddress = card.type === "printed" && state.delivery === "delivery";
  return (
    <div>
      <StepHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Step 4 of 5"
        title="Your contact details"
        subtitle="So we can confirm and ship your order."
      />
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <LabeledInput label="Full Name" required placeholder="Enter your name" value={state.customer.name} onChange={(v) => setCustomer("name", v)} error={errors["customer.name"]} />
        <LabeledInput label="Mobile Number" required type="tel" placeholder="10-digit mobile" value={state.customer.mobile} onChange={(v) => setCustomer("mobile", v)} error={errors["customer.mobile"]} />
        <LabeledInput label="WhatsApp Number (Optional)" type="tel" placeholder="If different from mobile" value={state.customer.whatsapp} onChange={(v) => setCustomer("whatsapp", v)} error={errors["customer.whatsapp"]} />
        <LabeledInput label="Email (Optional)" type="email" placeholder="you@example.com" value={state.customer.email} onChange={(v) => setCustomer("email", v)} error={errors["customer.email"]} />
        <LabeledInput label="City" required={needsAddress} placeholder="Enter city" value={state.customer.city} onChange={(v) => setCustomer("city", v)} error={errors["customer.city"]} />
        <LabeledInput label="State" placeholder="Enter state" value={state.customer.state} onChange={(v) => setCustomer("state", v)} />
        {needsAddress && (
          <>
            <div className="sm:col-span-2">
              <LabeledTextarea label="Delivery Address" required placeholder="House / Flat, Street, Landmark" value={state.customer.address} onChange={(v) => setCustomer("address", v)} error={errors["customer.address"]} />
            </div>
            <LabeledInput label="PIN Code" required placeholder="6-digit PIN" value={state.customer.pin} onChange={(v) => setCustomer("pin", v)} error={errors["customer.pin"]} />
          </>
        )}
      </div>
    </div>
  );
}

function StepReview({
  card,
  categoryName,
  state,
  price,
  schema,
  orderId,
  committed,
  message,
  onSend,
}: {
  card: InvitationCard;
  categoryName: string;
  state: OrderState;
  price: ReturnType<typeof calculateOrder>;
  schema: FormField[];
  orderId: string;
  committed: boolean;
  message: string;
  onSend: () => void;
}) {
  return (
    <div>
      <StepHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Step 5 of 5"
        title="Review your order"
        subtitle="Confirm everything below, then send on WhatsApp."
      />

      <div className="mt-5 rounded-2xl border border-gold-hairline bg-card/50 p-5">
        <div className="grid sm:grid-cols-[140px_1fr] gap-4">
          <CardCover card={card} />
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{categoryName}</div>
            <div className="font-display text-2xl">{card.name}</div>
            <div className="text-xs text-muted-foreground">#{card.code} · {card.type === "digital" ? "Digital" : "Printed"}</div>
            {card.type === "printed" && (
              <div className="text-xs text-muted-foreground">Qty {state.quantity} · {state.delivery === "pickup" ? "Self Pickup" : "Home Delivery"}</div>
            )}
            <div className="text-xs text-muted-foreground">Order ID · <span className="text-foreground font-mono">{orderId}</span></div>
          </div>
        </div>
      </div>

      <SummaryGroup title="Customer">
        <SummaryItem k="Name" v={state.customer.name} />
        <SummaryItem k="Mobile" v={state.customer.mobile} />
        {state.customer.whatsapp && <SummaryItem k="WhatsApp" v={state.customer.whatsapp} />}
        {state.customer.email && <SummaryItem k="Email" v={state.customer.email} />}
        {state.customer.city && <SummaryItem k="City" v={state.customer.city} />}
        {state.customer.state && <SummaryItem k="State" v={state.customer.state} />}
        {state.customer.address && <SummaryItem k="Address" v={`${state.customer.address}${state.customer.pin ? `, ${state.customer.pin}` : ""}`} />}
      </SummaryGroup>

      <SummaryGroup title="Event">
        {schema.map((f) => {
          const v = state.fields[f.key];
          if (!v) return null;
          return <SummaryItem key={f.key} k={f.label} v={v} />;
        })}
      </SummaryGroup>

      {state.functions.length > 0 && (
        <SummaryGroup title="Wedding Functions">
          {state.functions.map((fn) => (
            <SummaryItem key={fn.name} k={fn.name} v={`${fn.date} ${fn.time} @ ${fn.venue}`} />
          ))}
        </SummaryGroup>
      )}

      <SummaryGroup title="Design Preferences">
        {state.design.language && <SummaryItem k="Language" v={state.design.language} />}
        {state.design.theme && <SummaryItem k="Theme" v={state.design.theme} />}
        {state.design.color && <SummaryItem k="Colour" v={state.design.color} />}
        {state.design.font && <SummaryItem k="Font" v={state.design.font} />}
        <SummaryItem k="Orientation" v={state.design.orientation} />
      </SummaryGroup>

      {committed && (
        <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300 flex items-center gap-2">
          <Check className="h-4 w-4" /> Order ID {orderId} locked in. Your WhatsApp draft is ready.
        </div>
      )}
    </div>
  );
}

// ----------------- UI primitives -----------------

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

function FieldRow({
  field,
  value,
  setValue,
  error,
}: {
  field: FormField;
  value: string;
  setValue: (v: string) => void;
  error?: string;
}) {
  const fullWidth = field.type === "textarea";
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      {field.type === "textarea" ? (
        <LabeledTextarea label={field.label} required={field.required} placeholder={field.placeholder} value={value} onChange={setValue} error={error} />
      ) : field.type === "select" ? (
        <LabeledSelect label={field.label} required={field.required} value={value} onChange={setValue} options={field.options ?? []} error={error} />
      ) : (
        <LabeledInput label={field.label} required={field.required} type={field.type} placeholder={field.placeholder} value={value} onChange={setValue} error={error} />
      )}
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

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-gold-hairline bg-card/40 px-4 py-3 cursor-pointer hover:border-primary/60">
      <span
        className={`h-5 w-5 rounded-md grid place-items-center border ${
          checked ? "bg-primary border-primary text-primary-foreground" : "border-gold-hairline"
        }`}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm">{label}</span>
    </label>
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
    <div className="flex items-start justify-between gap-3 px-4 py-2.5 text-sm">
      <span className="text-muted-foreground text-xs uppercase tracking-[0.15em]">{k}</span>
      <span className="text-right break-words max-w-[60%]">{v}</span>
    </div>
  );
}

function PriceSidebar({
  card,
  state,
  price,
}: {
  card: InvitationCard;
  state: OrderState;
  price: ReturnType<typeof calculateOrder>;
}) {
  return (
    <aside className="lg:sticky lg:top-0 h-fit">
      <div className="rounded-3xl border border-gold-hairline bg-gradient-to-b from-card to-[oklch(0.16_0.04_20)] p-5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
          Live Price Breakdown
        </div>
        <div className="space-y-2 text-sm">
          <Row label={card.type === "digital" ? "Design Fee" : `Cards × ${formatINR(card.price)}`} value={formatINR(price.cardSubtotal)} />
          {price.printingCharge > 0 && <Row label="Printing" value={formatINR(price.printingCharge)} />}
          <Row
            label={card.type === "digital" || state.delivery === "pickup" ? "Delivery (Self Pickup)" : "Delivery"}
            value={price.deliveryCharge === 0 ? "FREE" : formatINR(price.deliveryCharge)}
            accent={price.deliveryCharge === 0 ? "text-emerald-400" : undefined}
          />
          {price.packagingCharge > 0 && <Row label="Packaging" value={formatINR(price.packagingCharge)} />}
          {price.addOnLines.map((l) => (
            <Row key={l.id} label={l.label} value={formatINR(l.amount)} />
          ))}
          {price.tax > 0 && <Row label="Tax" value={formatINR(price.tax)} />}
        </div>
        <div className="mt-4 rounded-2xl bg-primary/10 border border-primary/30 p-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary">Grand Total</div>
          <div className="font-display text-3xl text-gradient-gold mt-1">{formatINR(price.total)}</div>
        </div>
        {card.type === "printed" && (
          <div className="text-[11px] text-muted-foreground mt-3 inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> Add or remove add-ons to update price instantly.
          </div>
        )}
      </div>
    </aside>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${accent ?? "text-foreground"}`}>{value}</span>
    </div>
  );
}