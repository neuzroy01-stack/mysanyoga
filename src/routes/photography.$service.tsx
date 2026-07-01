import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  Phone,
  Clock,
  Instagram,
  Youtube,
  Camera,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";
import {
  getPhotoService,
  PHOTO_PALETTES,
  IMPORTANT_NOTES,
  formatINR,
  formatPhotoOrderId,
  type PhotoService,
} from "@/lib/photography";
import { SITE, waLink } from "@/lib/site";
import { reserveOrderId, commitOrderId, releaseOrderId } from "@/lib/order-id";

export const Route = createFileRoute("/photography/$service")({
  loader: ({ params }) => {
    const svc = getPhotoService(params.service);
    if (!svc) throw notFound();
    return { svc };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.svc;
    if (!s) return { meta: [{ title: "Photography — MySanyoga" }] };
    return {
      meta: [
        { title: `${s.name} — Photography | MySanyoga` },
        { name: "description", content: s.description },
        { property: "og:title", content: `${s.name} — MySanyoga` },
        { property: "og:description", content: s.description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Service not found</h1>
        <Link to="/photography" className="text-primary underline">
          Browse all photography services
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Link to="/photography" className="text-primary underline">
          Back
        </Link>
      </div>
    </div>
  ),
  component: PhotographyDetail,
});

function PhotographyDetail() {
  const { svc } = Route.useLoaderData() as { svc: PhotoService };
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [showForm, setShowForm] = useState(false);
  const [preselectedPackage, setPreselectedPackage] = useState<string>("");

  function openInquiry(pkg?: string) {
    setPreselectedPackage(pkg ?? "");
    setShowForm(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: PHOTO_PALETTES[svc.samplePhotos[0] ?? "royal"] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Link
            to="/photography"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> All photography services
          </Link>
          <div className="text-5xl mb-3">{svc.icon}</div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">{svc.tagline}</div>
          <h1 className="font-display text-4xl md:text-6xl">{svc.name}</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">{svc.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Starting
              </div>
              <div className="font-display text-3xl text-gradient-gold">
                {formatINR(svc.startingPrice)}
              </div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-gold-hairline" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" /> Delivery {svc.deliveryTime}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => openInquiry()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold-glow"
            >
              <Sparkles className="h-4 w-4" /> Book Now
            </button>
            <a
              href={waLink(`Hi MySanyoga, I'd like a quote for ${svc.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-6 py-3 text-sm hover:border-primary/50"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Enquiry
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio / Samples */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Portfolio</div>
          <h2 className="font-display text-3xl mb-6">Sample work</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {svc.samplePhotos.map((p, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl relative overflow-hidden border border-gold-hairline"
                style={{ background: PHOTO_PALETTES[p] }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 text-xs text-white/80">Sample {i + 1}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:border-primary/50"
            >
              <Instagram className="h-3.5 w-3.5" /> View Reels
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:border-primary/50"
            >
              <Youtube className="h-3.5 w-3.5" /> YouTube Videos
            </a>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:border-primary/50"
            >
              <Camera className="h-3.5 w-3.5" /> View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Packages</div>
          <h2 className="font-display text-3xl mb-6">Choose your package</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {svc.packages.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative rounded-2xl border p-6 ${
                  i === 1
                    ? "border-primary/60 bg-primary/5"
                    : "border-gold-hairline bg-card"
                }`}
              >
                {i === 1 && (
                  <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="font-display text-xl">{p.name}</div>
                <div className="font-display text-3xl text-gradient-gold mt-2">
                  {formatINR(p.price)}
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openInquiry(p.name)}
                  className="mt-6 w-full rounded-full bg-primary py-2.5 text-xs font-medium text-primary-foreground"
                >
                  Book {p.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Included + Extra */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gold-hairline bg-card p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
              What's included
            </div>
            <ul className="space-y-2">
              {svc.whatsIncluded.map((x) => (
                <li key={x} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gold-hairline bg-card p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
              Extra charges
            </div>
            <ul className="space-y-2">
              {svc.extraCharges.map((x) => (
                <li key={x} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">+</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Important notes */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Important</div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {IMPORTANT_NOTES.map((n) => (
                <li key={n} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">FAQ</div>
          <h2 className="font-display text-3xl mb-6">Frequently asked questions</h2>
          <div className="space-y-2">
            {svc.faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-gold-hairline bg-card">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-sm">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition ${openFAQ === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFAQ === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="font-display text-3xl md:text-4xl">
            Book {svc.name} <span className="italic text-gradient-gold">today</span>
          </h3>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => openInquiry()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold-glow"
            >
              <Sparkles className="h-4 w-4" /> Open Inquiry Form
            </button>
            <a
              href={`tel:${SITE.whatsapp}`}
              className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-6 py-3 text-sm"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
        </div>
      </section>

      {showForm && (
        <InquiryModal
          svc={svc}
          preselectedPackage={preselectedPackage}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Inquiry Modal
// ────────────────────────────────────────────────────────────────────────────

function InquiryModal({
  svc,
  preselectedPackage,
  onClose,
}: {
  svc: PhotoService;
  preselectedPackage: string;
  onClose: () => void;
}) {
  // Reserve a global 6-digit ID; commit on submit, release on close.
  const [sixDigit, setSixDigit] = useState<string>("");
  const committedRef = useRef(false);
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

  const [f, setF] = useState({
    fullName: "",
    mobile: "",
    whatsapp: "",
    email: "",
    eventType: "Wedding",
    functionName: "",
    pkg: preselectedPackage || svc.packages[0]?.name || "",
    eventDate: "",
    eventTime: "",
    state: "",
    city: "",
    address: "",
    mapLink: "",
    venueType: "Indoor",
    days: 1,
    guests: "",
    requirements: "",
    budget: "",
    terms: false,
  });
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  const valid =
    f.fullName.trim().length > 1 &&
    /^\d{10}$/.test(f.mobile) &&
    f.eventDate &&
    f.city.trim().length > 0 &&
    f.terms;

  function buildMessage() {
    return [
      `*New Booking Inquiry*`,
      `Order ID: ${orderId}`,
      ``,
      `Name: ${f.fullName}`,
      `Phone: +91 ${f.mobile}`,
      `WhatsApp: +91 ${f.whatsapp || f.mobile}`,
      f.email ? `Email: ${f.email}` : "",
      ``,
      `Service: ${svc.name}`,
      `Package: ${f.pkg}`,
      ``,
      `Event: ${f.eventType}${f.functionName ? ` (${f.functionName})` : ""}`,
      `Date: ${f.eventDate}`,
      f.eventTime ? `Time: ${f.eventTime}` : "",
      ``,
      `Location: ${f.address ? f.address + ", " : ""}${f.city}${f.state ? ", " + f.state : ""}`,
      f.mapLink ? `Map: ${f.mapLink}` : "",
      ``,
      `Indoor/Outdoor: ${f.venueType}`,
      `Days: ${f.days}`,
      f.guests ? `Guests: ${f.guests}` : "",
      f.budget ? `Budget: ₹${f.budget}` : "",
      f.requirements ? `Special Requirement: ${f.requirements}` : "",
      ``,
      `Please contact customer.`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function handleSubmit() {
    if (!valid) return;
    commitOrderId(sixDigit);
    committedRef.current = true;
    window.open(waLink(buildMessage()), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl border border-gold-hairline bg-background shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="p-8 md:p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-4">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-3xl mb-2">Thank You!</h3>
            <p className="text-muted-foreground">Inquiry submitted successfully.</p>
            <div className="mt-6 inline-block rounded-xl border border-primary/40 bg-primary/5 px-5 py-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Order ID
              </div>
              <div className="font-mono text-lg text-primary">{orderId}</div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Booking Status: <span className="text-primary font-medium">Pending</span> · Our team
              will contact you within 30 minutes.
            </div>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <a
                href={waLink(`Hi MySanyoga, regarding my inquiry ${orderId}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Support
              </a>
              <a
                href={`tel:${SITE.whatsapp}`}
                className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-5 py-2.5 text-xs"
              >
                <Phone className="h-3.5 w-3.5" /> Call Now
              </a>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.25em] text-primary">Inquiry</div>
            <h3 className="font-display text-2xl">{svc.name} — Book Now</h3>
            <div className="mt-1 text-xs text-muted-foreground">
              Order ID: <span className="font-mono text-primary">{orderId}</span>
            </div>

            <FormSection title="Customer Details">
              <Field label="Full Name *">
                <input
                  className="input"
                  value={f.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
              </Field>
              <Field label="Mobile Number *">
                <input
                  className="input"
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit"
                  value={f.mobile}
                  onChange={(e) => update("mobile", e.target.value.replace(/\D/g, ""))}
                />
              </Field>
              <Field label="WhatsApp Number">
                <input
                  className="input"
                  type="tel"
                  maxLength={10}
                  placeholder="Same as mobile if blank"
                  value={f.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value.replace(/\D/g, ""))}
                />
              </Field>
              <Field label="Email (Optional)">
                <input
                  className="input"
                  type="email"
                  value={f.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
            </FormSection>

            <FormSection title="Event Details">
              <Field label="Event Type">
                <select
                  className="input"
                  value={f.eventType}
                  onChange={(e) => update("eventType", e.target.value)}
                >
                  {["Wedding", "Reception", "Engagement", "Pre-Wedding", "Birthday", "Anniversary", "Corporate", "Other"].map(
                    (x) => (
                      <option key={x}>{x}</option>
                    ),
                  )}
                </select>
              </Field>
              <Field label="Function Name">
                <input
                  className="input"
                  placeholder="e.g. Haldi, Sangeet"
                  value={f.functionName}
                  onChange={(e) => update("functionName", e.target.value)}
                />
              </Field>
              <Field label="Service">
                <input className="input" value={svc.name} disabled />
              </Field>
              <Field label="Package">
                <select className="input" value={f.pkg} onChange={(e) => update("pkg", e.target.value)}>
                  {svc.packages.map((p) => (
                    <option key={p.name}>{p.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Event Date *">
                <input
                  className="input"
                  type="date"
                  value={f.eventDate}
                  onChange={(e) => update("eventDate", e.target.value)}
                />
              </Field>
              <Field label="Event Time">
                <input
                  className="input"
                  type="time"
                  value={f.eventTime}
                  onChange={(e) => update("eventTime", e.target.value)}
                />
              </Field>
            </FormSection>

            <FormSection title="Location">
              <Field label="State">
                <input className="input" value={f.state} onChange={(e) => update("state", e.target.value)} />
              </Field>
              <Field label="City *">
                <input className="input" value={f.city} onChange={(e) => update("city", e.target.value)} />
              </Field>
              <Field label="Full Address" full>
                <input className="input" value={f.address} onChange={(e) => update("address", e.target.value)} />
              </Field>
              <Field label="Google Map Link" full>
                <input
                  className="input"
                  placeholder="https://maps.google.com/..."
                  value={f.mapLink}
                  onChange={(e) => update("mapLink", e.target.value)}
                />
              </Field>
            </FormSection>

            <FormSection title="Additional">
              <Field label="Indoor / Outdoor">
                <select
                  className="input"
                  value={f.venueType}
                  onChange={(e) => update("venueType", e.target.value)}
                >
                  {["Indoor", "Outdoor", "Both"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="Number of Days">
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={f.days}
                  onChange={(e) => update("days", Number(e.target.value) || 1)}
                />
              </Field>
              <Field label="Guest Count">
                <input
                  className="input"
                  type="number"
                  value={f.guests}
                  onChange={(e) => update("guests", e.target.value)}
                />
              </Field>
              <Field label="Expected Budget (₹)">
                <input
                  className="input"
                  type="number"
                  value={f.budget}
                  onChange={(e) => update("budget", e.target.value)}
                />
              </Field>
              <Field label="Special Requirements" full>
                <textarea
                  className="input min-h-[80px]"
                  value={f.requirements}
                  onChange={(e) => update("requirements", e.target.value)}
                />
              </Field>
            </FormSection>

            <label className="mt-4 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={f.terms}
                onChange={(e) => update("terms", e.target.checked)}
              />
              <span className="text-muted-foreground">
                I agree with the Terms & Conditions and Privacy Policy.
              </span>
            </label>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-gold-hairline py-3 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!valid}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground shadow-gold-glow disabled:opacity-40 disabled:shadow-none"
              >
                Submit & Send on WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .input {
          width: 100%;
          background: transparent;
          border: 1px solid color-mix(in oklab, var(--primary) 20%, transparent);
          border-radius: 0.5rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: inherit;
        }
        .input:focus { outline: none; border-color: color-mix(in oklab, var(--primary) 60%, transparent); }
      `}</style>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-3">{title}</div>
      <div className="grid sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}