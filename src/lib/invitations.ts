// Invitation card catalogue, categories, form schemas and pricing helpers.
// Designed to be data-driven and easily extended.
export type InvitationCategory = {
  slug: string;
  name: string;
  icon: string; // emoji glyph (kept light so no asset deps)
};
export const INVITATION_CATEGORIES: InvitationCategory[] = [
  { slug: "wedding", name: "Wedding", icon: "💍" },
  { slug: "reception", name: "Reception", icon: "🥂" },
  { slug: "engagement", name: "Engagement", icon: "💎" },
  { slug: "haldi", name: "Haldi", icon: "🌼" },
  { slug: "mehendi", name: "Mehendi", icon: "🌿" },
  { slug: "sangeet", name: "Sangeet", icon: "🎶" },
  { slug: "birthday", name: "Birthday", icon: "🎂" },
  { slug: "anniversary", name: "Anniversary", icon: "❤️" },
  { slug: "baby-shower", name: "Baby Shower", icon: "🍼" },
  { slug: "naming", name: "Naming Ceremony", icon: "👶" },
  { slug: "housewarming", name: "Housewarming", icon: "🏠" },
  { slug: "corporate", name: "Corporate Events", icon: "🏢" },
  { slug: "religious", name: "Religious Events", icon: "🕉️" },
  { slug: "farewell", name: "Farewell", icon: "🙏" },
  { slug: "welcome", name: "Welcome Party", icon: "🎊" },
  { slug: "school", name: "School Events", icon: "🎓" },
  { slug: "college", name: "College Events", icon: "📚" },
  { slug: "business", name: "Business Events", icon: "💼" },
  { slug: "festival", name: "Festival Invitations", icon: "🪔" },
  { slug: "custom", name: "Custom Invitations", icon: "✨" },
];
export type InvitationType = "printed" | "digital";
export type PreviewLink = {
  label: string;
  kind: "instagram-reel" | "instagram-post" | "youtube-short" | "youtube-video" | "other";
  url: string;
};
export type InvitationCard = {
  code: string;            // 4-digit unique design code
  name: string;
  category: string;        // slug of InvitationCategory
  type: InvitationType;
  cover: string;           // CSS gradient palette key
  accent: string;          // accent text colour
  price: number;           // per card / per design
  minOrder: number;
  printingDays: string;
  language: string;
  theme: string;
  cardColor: string;
  orientation: "Portrait" | "Landscape" | "Square";
  deliveryAvailable: boolean;
  deliveryCharge: number;
  pickupAvailable: boolean;
  description: string;
  videoUrl?: string;
  previews: PreviewLink[];
  tags: ("popular" | "latest" | "trending")[];
};
// Palette presets used for the procedurally-rendered cover (no asset files).
export const COVER_PALETTES: Record<
  string,
  { from: string; via: string; to: string; ink: string }
> = {
  royal: { from: "#3d0a0a", via: "#7a1a1a", to: "#c9a14a", ink: "#fff7e0" },
  ivory: { from: "#fdf6e3", via: "#f3e2b6", to: "#d4af37", ink: "#3d2b00" },
  emerald: { from: "#0b2e22", via: "#1d6b4f", to: "#d4af37", ink: "#fff7e0" },
  blush: { from: "#3a0f1a", via: "#a14a6b", to: "#f6d6c8", ink: "#fff7e0" },
  midnight: { from: "#0a0a2a", via: "#1a1a55", to: "#d4af37", ink: "#fff7e0" },
  saffron: { from: "#3a1500", via: "#c2410c", to: "#fcd34d", ink: "#fff7e0" },
  peacock: { from: "#062e3a", via: "#0e7490", to: "#d4af37", ink: "#fff7e0" },
  rose: { from: "#3a0f1a", via: "#9f1239", to: "#fda4af", ink: "#fff7e0" },
};
// A reasonable starter catalogue. New cards plug straight in.
export const INVITATION_CARDS: InvitationCard[] = [
  // ---------- Wedding ----------
  { code: "1001", name: "Royal Mandala", category: "wedding", type: "printed", cover: "royal", accent: "#f8d77a", price: 65, minOrder: 100, printingDays: "5–7 days", language: "Hindi + English", theme: "Traditional", cardColor: "Maroon & Gold", orientation: "Portrait", deliveryAvailable: true, deliveryCharge: 350, pickupAvailable: true, description: "Hand-illustrated mandala cover with hot-foiled gold script. Premium 350gsm matte board.", previews: [{ label: "Instagram Reel", kind: "instagram-reel", url: "https://www.instagram.com/" }, { label: "YouTube Short", kind: "youtube-short", url: "https://youtube.com/" }], tags: ["popular", "trending"] },
  { code: "1002", name: "Ivory Heritage", category: "wedding", type: "printed", cover: "ivory", accent: "#7a1a1a", price: 85, minOrder: 100, printingDays: "6–8 days", language: "English", theme: "Modern Classic", cardColor: "Ivory & Burgundy", orientation: "Portrait", deliveryAvailable: true, deliveryCharge: 350, pickupAvailable: true, description: "Letterpress card with embossed monogram and silk ribbon tie. Optional inner sheet.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["latest"] },
  { code: "1003", name: "Peacock Court", category: "wedding", type: "printed", cover: "peacock", accent: "#f8d77a", price: 95, minOrder: 50, printingDays: "7–10 days", language: "Hindi + English", theme: "Royal Rajasthani", cardColor: "Teal & Gold", orientation: "Portrait", deliveryAvailable: true, deliveryCharge: 400, pickupAvailable: true, description: "Laser-cut peacock motif with gold mirror inlay. Includes RSVP card.", previews: [{ label: "YouTube Video", kind: "youtube-video", url: "https://youtube.com/" }], tags: ["trending"] },
  { code: "1004", name: "Cinematic Save-the-Date", category: "wedding", type: "digital", cover: "midnight", accent: "#f8d77a", price: 1499, minOrder: 1, printingDays: "Same day", language: "English", theme: "Cinematic", cardColor: "Midnight & Gold", orientation: "Square", deliveryAvailable: false, deliveryCharge: 0, pickupAvailable: false, description: "30-second cinematic reel with your photos, names, date and venue. 1080p MP4 + WhatsApp e-card.", previews: [{ label: "Instagram Reel", kind: "instagram-reel", url: "https://www.instagram.com/" }, { label: "YouTube Short", kind: "youtube-short", url: "https://youtube.com/" }], tags: ["latest", "trending"] },
  // ---------- Reception ----------
  { code: "1101", name: "Champagne Toast", category: "reception", type: "printed", cover: "blush", accent: "#f8d77a", price: 70, minOrder: 75, printingDays: "5–7 days", language: "English", theme: "Modern Elegant", cardColor: "Blush & Gold", orientation: "Landscape", deliveryAvailable: true, deliveryCharge: 300, pickupAvailable: true, description: "Soft-touch matte card with rose-gold foil and minimal typography.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["popular"] },
  { code: "1102", name: "Reception Reel", category: "reception", type: "digital", cover: "rose", accent: "#f8d77a", price: 999, minOrder: 1, printingDays: "Same day", language: "English", theme: "Modern", cardColor: "Rose & Gold", orientation: "Square", deliveryAvailable: false, deliveryCharge: 0, pickupAvailable: false, description: "Animated digital invite with venue map and RSVP link.", previews: [{ label: "Instagram Reel", kind: "instagram-reel", url: "https://www.instagram.com/" }], tags: ["latest"] },
  // ---------- Engagement ----------
  { code: "1201", name: "Diamond Vow", category: "engagement", type: "printed", cover: "midnight", accent: "#f8d77a", price: 60, minOrder: 75, printingDays: "5–7 days", language: "English", theme: "Modern Luxe", cardColor: "Navy & Gold", orientation: "Portrait", deliveryAvailable: true, deliveryCharge: 300, pickupAvailable: true, description: "Foil-stamped diamond motif on midnight blue. Perfectly minimal.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["trending"] },
  { code: "1202", name: "Promise Reel", category: "engagement", type: "digital", cover: "blush", accent: "#7a1a1a", price: 899, minOrder: 1, printingDays: "Same day", language: "English", theme: "Cinematic", cardColor: "Blush", orientation: "Square", deliveryAvailable: false, deliveryCharge: 0, pickupAvailable: false, description: "6-second highlight reel + animated e-card.", previews: [{ label: "YouTube Short", kind: "youtube-short", url: "https://youtube.com/" }], tags: ["latest"] },
  // ---------- Haldi ----------
  { code: "1301", name: "Marigold Glow", category: "haldi", type: "printed", cover: "saffron", accent: "#3a1500", price: 45, minOrder: 50, printingDays: "4–6 days", language: "Hindi + English", theme: "Traditional", cardColor: "Saffron & Yellow", orientation: "Square", deliveryAvailable: true, deliveryCharge: 250, pickupAvailable: true, description: "Bright marigold print on textured kraft. Eco-friendly.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["popular"] },
  // ---------- Mehendi ----------
  { code: "1401", name: "Henna Garden", category: "mehendi", type: "printed", cover: "emerald", accent: "#f8d77a", price: 50, minOrder: 50, printingDays: "4–6 days", language: "Hindi + English", theme: "Floral", cardColor: "Emerald & Gold", orientation: "Square", deliveryAvailable: true, deliveryCharge: 250, pickupAvailable: true, description: "Detailed henna-inspired illustration with gold foil leaves.", previews: [{ label: "Instagram Reel", kind: "instagram-reel", url: "https://www.instagram.com/" }], tags: ["trending"] },
  // ---------- Sangeet ----------
  { code: "1501", name: "Disco Sangeet", category: "sangeet", type: "printed", cover: "midnight", accent: "#f8d77a", price: 55, minOrder: 50, printingDays: "4–6 days", language: "Hindi + English", theme: "Bollywood", cardColor: "Midnight & Neon", orientation: "Square", deliveryAvailable: true, deliveryCharge: 250, pickupAvailable: true, description: "Bollywood-styled sangeet card with holographic finish.", previews: [{ label: "Instagram Reel", kind: "instagram-reel", url: "https://www.instagram.com/" }], tags: ["latest"] },
  // ---------- Birthday ----------
  { code: "2001", name: "Confetti Pop", category: "birthday", type: "printed", cover: "rose", accent: "#f8d77a", price: 25, minOrder: 30, printingDays: "3–5 days", language: "English", theme: "Fun", cardColor: "Pink & Gold", orientation: "Square", deliveryAvailable: true, deliveryCharge: 200, pickupAvailable: true, description: "Playful confetti illustration with metallic accents.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["popular"] },
  { code: "2002", name: "Cake & Candles", category: "birthday", type: "digital", cover: "blush", accent: "#7a1a1a", price: 499, minOrder: 1, printingDays: "Same day", language: "English", theme: "Cute", cardColor: "Blush", orientation: "Portrait", deliveryAvailable: false, deliveryCharge: 0, pickupAvailable: false, description: "Animated WhatsApp e-card with name & age.", previews: [{ label: "Instagram Reel", kind: "instagram-reel", url: "https://www.instagram.com/" }], tags: ["latest"] },
  // ---------- Anniversary ----------
  { code: "2101", name: "Forever & Always", category: "anniversary", type: "printed", cover: "ivory", accent: "#7a1a1a", price: 40, minOrder: 30, printingDays: "4–6 days", language: "English", theme: "Romantic", cardColor: "Ivory & Burgundy", orientation: "Landscape", deliveryAvailable: true, deliveryCharge: 250, pickupAvailable: true, description: "Foil-pressed script on ivory card. Includes envelope.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["trending"] },
  // ---------- Baby Shower ----------
  { code: "2201", name: "Tiny Toes", category: "baby-shower", type: "printed", cover: "blush", accent: "#7a1a1a", price: 30, minOrder: 30, printingDays: "3–5 days", language: "English", theme: "Sweet", cardColor: "Pastel Pink", orientation: "Square", deliveryAvailable: true, deliveryCharge: 200, pickupAvailable: true, description: "Soft watercolour design with baby motifs.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["popular"] },
  // ---------- Naming ----------
  { code: "2301", name: "Naamkaran Bliss", category: "naming", type: "printed", cover: "saffron", accent: "#3a1500", price: 35, minOrder: 50, printingDays: "4–6 days", language: "Hindi + English", theme: "Traditional", cardColor: "Saffron & Cream", orientation: "Portrait", deliveryAvailable: true, deliveryCharge: 250, pickupAvailable: true, description: "Traditional naming ceremony card with Sanskrit verse.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["latest"] },
  // ---------- Housewarming ----------
  { code: "2401", name: "Griha Pravesh", category: "housewarming", type: "printed", cover: "emerald", accent: "#f8d77a", price: 40, minOrder: 50, printingDays: "4–6 days", language: "Hindi + English", theme: "Auspicious", cardColor: "Green & Gold", orientation: "Portrait", deliveryAvailable: true, deliveryCharge: 250, pickupAvailable: true, description: "Kalash & toran motif card for griha-pravesh.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["popular"] },
  // ---------- Corporate ----------
  { code: "3001", name: "Boardroom Black", category: "corporate", type: "printed", cover: "midnight", accent: "#f8d77a", price: 75, minOrder: 100, printingDays: "5–7 days", language: "English", theme: "Minimal", cardColor: "Black & Gold", orientation: "Landscape", deliveryAvailable: true, deliveryCharge: 350, pickupAvailable: true, description: "Premium corporate invite with embossed logo space.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["trending"] },
  { code: "3002", name: "Corporate E-Invite", category: "corporate", type: "digital", cover: "peacock", accent: "#f8d77a", price: 799, minOrder: 1, printingDays: "Same day", language: "English", theme: "Modern", cardColor: "Teal & Gold", orientation: "Landscape", deliveryAvailable: false, deliveryCharge: 0, pickupAvailable: false, description: "Branded e-invite with calendar & map.", previews: [{ label: "YouTube Video", kind: "youtube-video", url: "https://youtube.com/" }], tags: ["latest"] },
  // ---------- Religious ----------
  { code: "3101", name: "Satyanarayan Katha", category: "religious", type: "printed", cover: "saffron", accent: "#3a1500", price: 35, minOrder: 50, printingDays: "4–6 days", language: "Hindi", theme: "Devotional", cardColor: "Saffron & Red", orientation: "Portrait", deliveryAvailable: true, deliveryCharge: 250, pickupAvailable: true, description: "Devotional motifs and Sanskrit invocation.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["popular"] },
  // ---------- Farewell ----------
  { code: "3201", name: "Sunset Farewell", category: "farewell", type: "printed", cover: "rose", accent: "#f8d77a", price: 30, minOrder: 30, printingDays: "3–5 days", language: "English", theme: "Heartfelt", cardColor: "Rose & Gold", orientation: "Landscape", deliveryAvailable: true, deliveryCharge: 200, pickupAvailable: true, description: "Warm sunset gradient with heartfelt typography.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["latest"] },
  // ---------- Welcome ----------
  { code: "3301", name: "Grand Welcome", category: "welcome", type: "printed", cover: "ivory", accent: "#7a1a1a", price: 35, minOrder: 30, printingDays: "3–5 days", language: "English", theme: "Celebratory", cardColor: "Ivory & Burgundy", orientation: "Square", deliveryAvailable: true, deliveryCharge: 200, pickupAvailable: true, description: "Warm welcome card with confetti illustration.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["popular"] },
  // ---------- School ----------
  { code: "3401", name: "Annual Day", category: "school", type: "printed", cover: "midnight", accent: "#f8d77a", price: 20, minOrder: 100, printingDays: "5–7 days", language: "English", theme: "Academic", cardColor: "Navy & Gold", orientation: "Portrait", deliveryAvailable: true, deliveryCharge: 350, pickupAvailable: true, description: "Classic annual-day card with school crest space.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["latest"] },
  // ---------- College ----------
  { code: "3501", name: "Fest Vibes", category: "college", type: "printed", cover: "peacock", accent: "#f8d77a", price: 22, minOrder: 100, printingDays: "5–7 days", language: "English", theme: "Youthful", cardColor: "Teal & Neon", orientation: "Square", deliveryAvailable: true, deliveryCharge: 350, pickupAvailable: true, description: "High-energy college fest invite.", previews: [{ label: "Instagram Reel", kind: "instagram-reel", url: "https://www.instagram.com/" }], tags: ["trending"] },
  // ---------- Business ----------
  { code: "3601", name: "Launch Night", category: "business", type: "printed", cover: "midnight", accent: "#f8d77a", price: 80, minOrder: 100, printingDays: "5–7 days", language: "English", theme: "Premium", cardColor: "Black & Gold", orientation: "Landscape", deliveryAvailable: true, deliveryCharge: 350, pickupAvailable: true, description: "Product launch invite with embossed logo space.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["trending"] },
  // ---------- Festival ----------
  { code: "3701", name: "Diwali Diyas", category: "festival", type: "printed", cover: "saffron", accent: "#3a1500", price: 30, minOrder: 50, printingDays: "4–6 days", language: "Hindi + English", theme: "Festive", cardColor: "Saffron & Gold", orientation: "Square", deliveryAvailable: true, deliveryCharge: 250, pickupAvailable: true, description: "Diya illustration with rangoli border.", previews: [{ label: "Instagram Post", kind: "instagram-post", url: "https://www.instagram.com/" }], tags: ["popular"] },
  // ---------- Custom ----------
  { code: "3801", name: "Bespoke Design", category: "custom", type: "printed", cover: "royal", accent: "#f8d77a", price: 0, minOrder: 50, printingDays: "Quote on request", language: "Any", theme: "Custom", cardColor: "Any", orientation: "Portrait", deliveryAvailable: true, deliveryCharge: 0, pickupAvailable: true, description: "Fully bespoke design — share your brief and our designers will craft something unique.", previews: [], tags: ["latest"] },
];
export function getCardByCode(code: string): InvitationCard | undefined {
  return INVITATION_CARDS.find((c) => c.code === code);
}
// ----------------- Form schema per category -----------------
export type FormField = {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "date" | "time" | "number" | "textarea" | "select" | "tel" | "email";
  required: boolean;
  options?: string[];
};
const SHARED_END: FormField[] = [
  { key: "language", label: "Language", placeholder: "Select an Option", type: "select", required: true, options: ["English", "Hindi", "Hindi + English", "Marathi", "Gujarati", "Tamil", "Telugu", "Other"] },
  { key: "theme", label: "Theme / Style", placeholder: "Select an Option", type: "select", required: false, options: ["Traditional", "Modern", "Royal", "Minimal", "Cinematic", "Floral", "Custom"] },
  { key: "quantity", label: "Quantity", placeholder: "Enter quantity", type: "number", required: true },
  { key: "specialMessage", label: "Special Message (Optional)", placeholder: "Any special note to print on the card", type: "textarea", required: false },
];
const SHARED_CONTACT: FormField[] = [
  { key: "customerName", label: "Your Name", placeholder: "Enter Your Name", type: "text", required: true },
  { key: "phone", label: "Phone Number", placeholder: "Enter 10-digit mobile", type: "tel", required: true },
  { key: "deliveryAddress", label: "Delivery Address", placeholder: "Enter complete address (skip if self pickup)", type: "textarea", required: false },
];
export const FORM_SCHEMAS: Record<string, FormField[]> = {
  wedding: [
    { key: "groomName", label: "Groom Name", placeholder: "Enter Groom Name", type: "text", required: true },
    { key: "brideName", label: "Bride Name", placeholder: "Enter Bride Name", type: "text", required: true },
    { key: "groomParents", label: "Groom's Parents", placeholder: "Enter Parents' Names", type: "text", required: true },
    { key: "brideParents", label: "Bride's Parents", placeholder: "Enter Parents' Names", type: "text", required: true },
    { key: "weddingDate", label: "Wedding Date", placeholder: "", type: "date", required: true },
    { key: "weddingTime", label: "Wedding Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue with City", type: "textarea", required: true },
    { key: "receptionDetails", label: "Reception Details (Optional)", placeholder: "Date, time & venue of reception", type: "textarea", required: false },
    { key: "rsvp", label: "RSVP Number", placeholder: "Enter RSVP contact number", type: "tel", required: false },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  reception: [
    { key: "hostNames", label: "Host Names", placeholder: "Enter host names", type: "text", required: true },
    { key: "eventDate", label: "Reception Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Reception Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue with City", type: "textarea", required: true },
    { key: "rsvp", label: "RSVP Number", placeholder: "Enter RSVP contact number", type: "tel", required: false },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  engagement: [
    { key: "groomName", label: "Name (1)", placeholder: "Enter First Name", type: "text", required: true },
    { key: "brideName", label: "Name (2)", placeholder: "Enter Second Name", type: "text", required: true },
    { key: "eventDate", label: "Engagement Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Engagement Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue with City", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  haldi: [
    { key: "celebrantName", label: "Celebrant Name", placeholder: "Enter Name", type: "text", required: true },
    { key: "eventDate", label: "Haldi Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Haldi Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  mehendi: [
    { key: "celebrantName", label: "Celebrant Name", placeholder: "Enter Name", type: "text", required: true },
    { key: "eventDate", label: "Mehendi Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Mehendi Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  sangeet: [
    { key: "hostNames", label: "Host Names", placeholder: "Enter host names", type: "text", required: true },
    { key: "eventDate", label: "Sangeet Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Sangeet Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  birthday: [
    { key: "birthdayName", label: "Birthday Person Name", placeholder: "Enter Name", type: "text", required: true },
    { key: "age", label: "Age", placeholder: "Enter Age", type: "number", required: true },
    { key: "eventDate", label: "Birthday Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  anniversary: [
    { key: "coupleNames", label: "Couple Names", placeholder: "Enter Names", type: "text", required: true },
    { key: "yearsCompleted", label: "Years Completed", placeholder: "Enter Years", type: "number", required: true },
    { key: "eventDate", label: "Event Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Event Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  "baby-shower": [
    { key: "motherName", label: "Mother's Name", placeholder: "Enter Mother's Name", type: "text", required: true },
    { key: "eventDate", label: "Event Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Event Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  naming: [
    { key: "babyName", label: "Baby's Name", placeholder: "Enter Baby's Name", type: "text", required: true },
    { key: "parentsNames", label: "Parents' Names", placeholder: "Enter Parents' Names", type: "text", required: true },
    { key: "eventDate", label: "Ceremony Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Ceremony Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  housewarming: [
    { key: "familyName", label: "Family Name", placeholder: "Enter Family Name", type: "text", required: true },
    { key: "eventDate", label: "Griha Pravesh Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "New House Address", placeholder: "Enter Full Address", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  corporate: [
    { key: "companyName", label: "Company Name", placeholder: "Enter Company Name", type: "text", required: true },
    { key: "eventTitle", label: "Event Title", placeholder: "Enter Event Title", type: "text", required: true },
    { key: "eventDate", label: "Event Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Event Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    { key: "dressCode", label: "Dress Code (Optional)", placeholder: "e.g. Formal", type: "text", required: false },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  religious: [
    { key: "eventTitle", label: "Ceremony / Puja Name", placeholder: "Enter Ceremony Name", type: "text", required: true },
    { key: "hostNames", label: "Host Names", placeholder: "Enter Host Names", type: "text", required: true },
    { key: "eventDate", label: "Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  farewell: [
    { key: "honoreeName", label: "Honoree Name", placeholder: "Enter Name", type: "text", required: true },
    { key: "eventDate", label: "Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  welcome: [
    { key: "honoreeName", label: "Welcoming For", placeholder: "Enter Name", type: "text", required: true },
    { key: "eventDate", label: "Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  school: [
    { key: "schoolName", label: "School Name", placeholder: "Enter School Name", type: "text", required: true },
    { key: "eventTitle", label: "Event Title", placeholder: "Enter Event Title", type: "text", required: true },
    { key: "eventDate", label: "Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  college: [
    { key: "collegeName", label: "College Name", placeholder: "Enter College Name", type: "text", required: true },
    { key: "eventTitle", label: "Event Title", placeholder: "Enter Event Title", type: "text", required: true },
    { key: "eventDate", label: "Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  business: [
    { key: "companyName", label: "Brand / Company", placeholder: "Enter Brand Name", type: "text", required: true },
    { key: "eventTitle", label: "Event Title", placeholder: "e.g. Product Launch", type: "text", required: true },
    { key: "eventDate", label: "Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  festival: [
    { key: "festivalName", label: "Festival Name", placeholder: "e.g. Diwali Get-Together", type: "text", required: true },
    { key: "hostNames", label: "Hosted By", placeholder: "Enter Host Name(s)", type: "text", required: true },
    { key: "eventDate", label: "Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
  custom: [
    { key: "eventTitle", label: "Event Title", placeholder: "Enter Event Title", type: "text", required: true },
    { key: "hostNames", label: "Hosted By", placeholder: "Enter Host Name(s)", type: "text", required: true },
    { key: "eventDate", label: "Date", placeholder: "", type: "date", required: true },
    { key: "eventTime", label: "Time", placeholder: "", type: "time", required: true },
    { key: "venue", label: "Venue", placeholder: "Enter Venue", type: "textarea", required: true },
    { key: "briefNotes", label: "Design Brief", placeholder: "Describe what you want", type: "textarea", required: true },
    ...SHARED_END,
    ...SHARED_CONTACT,
  ],
};
export function getFormSchema(category: string): FormField[] {
  return FORM_SCHEMAS[category] ?? FORM_SCHEMAS.custom;
}
// ----------------- Pricing -----------------
export type DeliveryMode = "delivery" | "pickup";
export type PriceInput = {
  card: InvitationCard;
  quantity: number;
  delivery: DeliveryMode;
  printingChargePerCard?: number;
  packagingCharge?: number;
  taxPercent?: number;
};
export type PriceBreakdown = {
  cardSubtotal: number;
  printingCharge: number;
  deliveryCharge: number;
  packagingCharge: number;
  tax: number;
  total: number;
};
export function calculatePrice(input: PriceInput): PriceBreakdown {
  const qty = Math.max(0, Number(input.quantity) || 0);
  const cardSubtotal = input.card.price * qty;
  // Printing charges baked in for digital; printed items add a small per-card finishing fee.
  const perCardPrint = input.card.type === "digital" ? 0 : (input.printingChargePerCard ?? 5);
  const printingCharge = perCardPrint * qty;
  const deliveryCharge =
    input.delivery === "pickup" || input.card.type === "digital"
      ? 0
      : input.card.deliveryCharge;
  const packagingCharge =
    input.card.type === "digital" ? 0 : (input.packagingCharge ?? 0);
  const taxable = cardSubtotal + printingCharge + deliveryCharge + packagingCharge;
  const tax = Math.round((taxable * (input.taxPercent ?? 0)) / 100);
  const total = taxable + tax;
  return {
    cardSubtotal,
    printingCharge,
    deliveryCharge,
    packagingCharge,
    tax,
    total,
  };
}
export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
export function getCategory(slug: string): InvitationCategory | undefined {
  return INVITATION_CATEGORIES.find((c) => c.slug === slug);
}