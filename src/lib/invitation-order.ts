import { calculatePrice, type InvitationCard, type DeliveryMode, formatINR } from "@/lib/invitations";

// ---------- Add-ons ----------
export type AddOn = {
  id: string;
  label: string;
  description?: string;
  price: number;
  unit: "flat" | "per-card" | "percent";
  appliesTo: "printed" | "digital" | "both";
};

export const ADDONS: AddOn[] = [
  { id: "paper-premium", label: "Premium Paper (350gsm)", price: 8, unit: "per-card", appliesTo: "printed" },
  { id: "foiling", label: "Gold Foiling", price: 10, unit: "per-card", appliesTo: "printed" },
  { id: "uv-finish", label: "UV Finish", price: 6, unit: "per-card", appliesTo: "printed" },
  { id: "rounded", label: "Rounded Corners", price: 3, unit: "per-card", appliesTo: "printed" },
  { id: "envelope", label: "Premium Envelope", price: 12, unit: "per-card", appliesTo: "printed" },
  { id: "qr", label: "QR Code (RSVP)", price: 500, unit: "flat", appliesTo: "both" },
  { id: "maps", label: "Google Maps Link Print", price: 300, unit: "flat", appliesTo: "both" },
  { id: "music", label: "Background Music", price: 500, unit: "flat", appliesTo: "digital" },
  { id: "animation", label: "Premium Animation", price: 999, unit: "flat", appliesTo: "digital" },
  { id: "rush", label: "Same-day Rush (+20%)", price: 20, unit: "percent", appliesTo: "both" },
];

// ---------- Wedding functions ----------
export const WEDDING_FUNCTIONS = [
  "Engagement",
  "Ring Ceremony",
  "Haldi",
  "Mehndi",
  "Sangeet",
  "Cocktail Party",
  "Wedding Ceremony",
  "Reception",
  "Baraat",
  "Vidaai",
] as const;

export type WeddingFunction = {
  name: string;
  date: string;
  time: string;
  venue: string;
  mapLink: string;
};

// ---------- Languages ----------
export const LANGUAGES = [
  "English",
  "Hindi",
  "Marathi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Custom",
];

// ---------- Quantity presets ----------
export const QUANTITY_PRESETS = [100, 200, 300, 500, 1000];

// ---------- Order state ----------
export type OrderCustomer = {
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  address: string;
  pin: string;
};

export type OrderDesign = {
  language: string;
  theme: string;
  color: string;
  font: string;
  orientation: string;
  includeQR: boolean;
  includeMaps: boolean;
  includeMusic: boolean;
  includeAnimation: boolean;
};

export type OrderState = {
  fields: Record<string, string>;          // category event fields
  functions: WeddingFunction[];            // wedding only
  design: OrderDesign;
  addOnIds: string[];
  quantity: number;
  delivery: DeliveryMode;
  customer: OrderCustomer;
};

export const emptyOrder = (card: InvitationCard): OrderState => ({
  fields: {},
  functions: [],
  design: {
    language: "",
    theme: card.theme || "",
    color: card.cardColor || "",
    font: "",
    orientation: card.orientation,
    includeQR: false,
    includeMaps: false,
    includeMusic: false,
    includeAnimation: false,
  },
  addOnIds: [],
  quantity: card.minOrder,
  delivery: card.type === "digital" || !card.deliveryAvailable ? "pickup" : "delivery",
  customer: { name: "", mobile: "", whatsapp: "", email: "", city: "", state: "", address: "", pin: "" },
});

// ---------- Pricing ----------
export type FullPriceBreakdown = {
  cardSubtotal: number;
  printingCharge: number;
  deliveryCharge: number;
  packagingCharge: number;
  addOnTotal: number;
  addOnLines: { id: string; label: string; amount: number }[];
  rushSurcharge: number;
  tax: number;
  total: number;
};

export function calculateOrder(
  card: InvitationCard,
  state: OrderState
): FullPriceBreakdown {
  const base = calculatePrice({
    card,
    quantity: card.type === "digital" ? 1 : state.quantity,
    delivery: state.delivery,
  });
  const qty = card.type === "digital" ? 1 : Math.max(0, state.quantity || 0);
  let addOnTotal = 0;
  let rushSurcharge = 0;
  const addOnLines: FullPriceBreakdown["addOnLines"] = [];
  for (const id of state.addOnIds) {
    const a = ADDONS.find((x) => x.id === id);
    if (!a) continue;
    if (a.appliesTo !== "both" && a.appliesTo !== card.type) continue;
    let amount = 0;
    if (a.unit === "per-card") amount = a.price * qty;
    else if (a.unit === "flat") amount = a.price;
    else if (a.unit === "percent") {
      // applied at end on subtotal
      amount = 0;
    }
    addOnTotal += amount;
    addOnLines.push({ id: a.id, label: a.label, amount });
  }
  const subtotalBeforeRush =
    base.cardSubtotal + base.printingCharge + base.deliveryCharge + base.packagingCharge + addOnTotal;
  if (state.addOnIds.includes("rush")) {
    rushSurcharge = Math.round(subtotalBeforeRush * 0.2);
    addOnLines.push({ id: "rush", label: "Same-day Rush (20%)", amount: rushSurcharge });
  }
  const total = subtotalBeforeRush + rushSurcharge + base.tax;
  return {
    cardSubtotal: base.cardSubtotal,
    printingCharge: base.printingCharge,
    deliveryCharge: base.deliveryCharge,
    packagingCharge: base.packagingCharge,
    addOnTotal,
    addOnLines,
    rushSurcharge,
    tax: base.tax,
    total,
  };
}

// ---------- Validation ----------
const MOBILE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_RE = /^\d{6}$/;

export function validateStep(
  step: number,
  card: InvitationCard,
  schemaKeys: { key: string; label: string; required: boolean }[],
  state: OrderState
): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 1) {
    schemaKeys.forEach((f) => {
      if (f.required && !(state.fields[f.key] ?? "").trim()) {
        e[f.key] = `${f.label} is required.`;
      }
    });
    if (card.category === "wedding" && state.functions.length === 0) {
      e.__functions = "Select at least one wedding function.";
    }
    state.functions.forEach((fn, i) => {
      if (!fn.date) e[`fn-${i}-date`] = "Date required.";
      if (!fn.time) e[`fn-${i}-time`] = "Time required.";
      if (!fn.venue.trim()) e[`fn-${i}-venue`] = "Venue required.";
    });
  }
  if (step === 2) {
    if (!state.design.language) e["design.language"] = "Choose a language.";
  }
  if (step === 3 && card.type === "printed") {
    if (state.quantity < card.minOrder)
      e.__qty = `Minimum order is ${card.minOrder}.`;
  }
  if (step === 4) {
    if (!state.customer.name.trim()) e["customer.name"] = "Name is required.";
    if (!MOBILE_RE.test(state.customer.mobile.trim()))
      e["customer.mobile"] = "Enter a valid 10-digit mobile number.";
    if (state.customer.whatsapp && !MOBILE_RE.test(state.customer.whatsapp.trim()))
      e["customer.whatsapp"] = "Enter a valid 10-digit WhatsApp number.";
    if (state.customer.email && !EMAIL_RE.test(state.customer.email.trim()))
      e["customer.email"] = "Enter a valid email.";
    if (card.type === "printed" && state.delivery === "delivery") {
      if (!state.customer.address.trim())
        e["customer.address"] = "Delivery address is required.";
      if (!state.customer.city.trim()) e["customer.city"] = "City is required.";
      if (!PIN_RE.test(state.customer.pin.trim()))
        e["customer.pin"] = "Enter a valid 6-digit PIN.";
    }
  }
  return e;
}

// ---------- WhatsApp message ----------
export function buildOrderMessage({
  card,
  categoryName,
  state,
  price,
  orderId,
  schema,
}: {
  card: InvitationCard;
  categoryName: string;
  state: OrderState;
  price: FullPriceBreakdown;
  orderId: string;
  schema: { key: string; label: string }[];
}): string {
  const L: string[] = [];
  L.push("*MySanyoga — New Invitation Order*");
  L.push("");
  L.push(`*Order ID:* ${orderId}`);
  L.push(`*Date:* ${new Date().toLocaleString("en-IN")}`);
  L.push("");
  L.push(`*Category:* ${categoryName}`);
  L.push(`*Design:* ${card.name}  (#${card.code})`);
  L.push(`*Type:* ${card.type === "digital" ? "Digital Invitation" : "Printed Card"}`);
  if (card.type === "printed") {
    L.push(`*Quantity:* ${state.quantity}`);
    L.push(`*Delivery:* ${state.delivery === "pickup" ? "Self Pickup" : "Home Delivery"}`);
  }
  L.push("");

  L.push("*Customer:*");
  L.push(`• Name: ${state.customer.name}`);
  L.push(`• Mobile: ${state.customer.mobile}`);
  if (state.customer.whatsapp) L.push(`• WhatsApp: ${state.customer.whatsapp}`);
  if (state.customer.email) L.push(`• Email: ${state.customer.email}`);
  if (state.customer.city) L.push(`• City: ${state.customer.city}`);
  if (state.customer.state) L.push(`• State: ${state.customer.state}`);
  if (state.customer.address)
    L.push(`• Address: ${state.customer.address}${state.customer.pin ? `, ${state.customer.pin}` : ""}`);
  L.push("");

  L.push("*Event Details:*");
  schema.forEach((f) => {
    const v = (state.fields[f.key] ?? "").trim();
    if (v) L.push(`• ${f.label}: ${v}`);
  });
  if (state.functions.length) {
    L.push("");
    L.push("*Wedding Functions:*");
    state.functions.forEach((fn) => {
      L.push(`• ${fn.name} — ${fn.date} ${fn.time} @ ${fn.venue}${fn.mapLink ? ` (${fn.mapLink})` : ""}`);
    });
  }
  L.push("");

  L.push("*Design Preferences:*");
  L.push(`• Language: ${state.design.language || "—"}`);
  if (state.design.theme) L.push(`• Theme: ${state.design.theme}`);
  if (state.design.color) L.push(`• Color: ${state.design.color}`);
  if (state.design.font) L.push(`• Font: ${state.design.font}`);
  L.push(`• Orientation: ${state.design.orientation}`);
  const features = [
    state.design.includeQR && "QR Code",
    state.design.includeMaps && "Google Maps",
    state.design.includeMusic && "Background Music",
    state.design.includeAnimation && "Animation",
  ].filter(Boolean) as string[];
  if (features.length) L.push(`• Features: ${features.join(", ")}`);
  if (state.addOnIds.length) {
    const labels = state.addOnIds
      .map((id) => ADDONS.find((a) => a.id === id)?.label)
      .filter(Boolean) as string[];
    L.push(`• Add-ons: ${labels.join(", ")}`);
  }
  L.push("");

  L.push("*Pricing:*");
  L.push(`• Cards Subtotal: ${formatINR(price.cardSubtotal)}`);
  if (price.printingCharge > 0) L.push(`• Printing: ${formatINR(price.printingCharge)}`);
  if (price.deliveryCharge > 0) L.push(`• Delivery: ${formatINR(price.deliveryCharge)}`);
  if (price.packagingCharge > 0) L.push(`• Packaging: ${formatINR(price.packagingCharge)}`);
  price.addOnLines
    .filter((l) => l.id !== "rush")
    .forEach((l) => L.push(`• ${l.label}: ${formatINR(l.amount)}`));
  if (price.rushSurcharge > 0) L.push(`• Rush Surcharge: ${formatINR(price.rushSurcharge)}`);
  if (price.tax > 0) L.push(`• Tax: ${formatINR(price.tax)}`);
  L.push(`*Total: ${formatINR(price.total)}*`);
  return L.join("\n");
}