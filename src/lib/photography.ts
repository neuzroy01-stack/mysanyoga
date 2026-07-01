// Photography & Film services, packages, FAQs and global helpers.
// Data-driven so individual services share the same detail-page template.
export type PhotoPackage = {
  name: string;
  price: number;
  highlights: string[];
};
export type PhotoFAQ = { q: string; a: string };
export type PhotoService = {
  slug: string;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  startingPrice: number;
  deliveryTime: string;
  whatsIncluded: string[];
  extraCharges: string[];
  packages: PhotoPackage[];
  faqs: PhotoFAQ[];

  samplePhotos: string[]; // gradient palette keys (procedural)
  sampleVideos: { label: string; url: string }[];
  
};
const COMMON_FAQS: PhotoFAQ[] = [
  {
    q: "How early should I book?",
    a: "We recommend booking 30–60 days in advance for premium dates and 15+ days for regular bookings.",
  },
  {
    q: "Do you travel outside the city?",
    a: "Yes, we cover all of India. Outstation travel, hotel and food charges are billed at actuals.",
  },
  {
    q: "When do I get my photos & videos?",
    a: "Edited photos 15–20 days, cinematic films 20–45 days, albums 15–30 days after the event.",
  },
  {
    q: "Can I get raw files?",
    a: "Yes, raw / unedited data is available as an add-on with separate charges.",
  },
];
const COMMON_EXTRA = [
  "Travel charges (outstation)",
  "Hotel & food for crew",
  "Toll, parking & permits",
  "Raw data export",
  "Additional edited reels",
  "Extra album copies",
];
export const PHOTO_SERVICES: PhotoService[] = [
  {
    slug: "photography",
    icon: "📸",
    name: "Photography",
    
    tagline: "Candid · Traditional · Portraits",
    description:
      "Full-day professional photography with candid moments, traditional portraits and detail shots — edited & colour-graded.",
    startingPrice: 8999,
    deliveryTime: "15–20 days",
    whatsIncluded: [
      "1 lead photographer (full day)",
      "300+ edited high-resolution photos",
      "Online private gallery",
      "Basic colour correction & retouch",
    ],
    extraCharges: COMMON_EXTRA,
    packages: [
      { name: "Basic", price: 8999, highlights: ["6 hrs coverage", "150+ edited photos", "Online gallery"] },
      { name: "Standard", price: 15999, highlights: ["Full day", "300+ photos", "Premium retouch", "Online + USB delivery"] },
      { name: "Premium", price: 29999, highlights: ["2 photographers", "500+ photos", "Pre-event consult", "Album-ready edits"] },
    ],
    faqs: COMMON_FAQS,
    samplePhotos: ["royal", "rose", "ivory", "sapphire", "emerald", "marigold"],
    sampleVideos: [],
  },
  {
    slug: "videography",
    icon: "🎥",
    name: "Videography",
    tagline: "Multi-cam HD coverage",
    description:
      "Multi-camera HD videography with professional audio, traditional highlights and full event documentation.",
    startingPrice: 10999,
    deliveryTime: "20–30 days",
    whatsIncluded: ["2-cam HD coverage", "Pro audio", "Full event film", "Highlight reel (3–5 min)"],
    extraCharges: COMMON_EXTRA,
    packages: [
      { name: "Basic", price: 10999, highlights: ["1 cam", "Full event film", "Basic edit"] },
      { name: "Standard", price: 18999, highlights: ["2 cam", "Highlight reel", "Coloured edit"] },
      { name: "Premium", price: 25999, highlights: ["3 cam + slider", "Cinematic edit", "Same-day reel"] },
    ],
    faqs: COMMON_FAQS,
    samplePhotos: ["sapphire", "royal", "marigold"],
    sampleVideos: [],
  },
  {
    slug: "cinematic-wedding-film",
    icon: "🎬",

    name: "Cinematic Wedding Film",
    image: "/images/photography/cinematic-wedding-film.jpg", // Background image
    tagline: "5–8 min cinematic story",
    description:
      "A cinematic, story-driven 5–8 minute wedding film with colour-grading, professional sound design and licensed music.",
    startingPrice: 25999,
    deliveryTime: "30–45 days",
    whatsIncluded: ["Cinematic 5–8 min film", "Colour grading", "Sound design", "Licensed music"],
    extraCharges: COMMON_EXTRA,
    packages: [
      { name: "Basic", price: 25999, highlights: ["1 cinematographer", "5 min film"] },
      { name: "Premium", price: 49999, highlights: ["2 cinematographers", "8 min film", "Drone shots", "Teaser reel"] },
    ],
    faqs: COMMON_FAQS,
    samplePhotos: ["royal", "ivory"],
    sampleVideos: [],
  },
  {
    slug: "pre-wedding-shoot",
    icon: "❤️",
    name: "Pre-Wedding Shoot",
    tagline: "Outdoor · Indoor · Concept",
    description:
      "Concept-based pre-wedding shoot at scenic locations with wardrobe & creative direction support.",
    startingPrice: 14999,
    deliveryTime: "15–25 days",
    whatsIncluded: ["Half-day shoot", "1–2 locations", "Concept planning", "100+ edited photos", "1 min reel"],
    extraCharges: ["Location permits", "Wardrobe / styling", "Travel & stay (outstation)"],
    packages: [
      { name: "Basic", price: 14999, highlights: ["1 location", "Half day", "Photos only"] },
      { name: "Standard", price: 24999, highlights: ["2 locations", "Photo + Video", "1 min reel"] },
      { name: "Premium", price: 39999, highlights: ["Multi-location", "Cinematic film", "Drone shots"] },
    ],
    faqs: COMMON_FAQS,
    samplePhotos: ["rose", "marigold", "emerald"],
    sampleVideos: [],
  },
  {
    slug: "drone-shoot",
    icon: "🚁",
    name: "Drone Shoot",
    tagline: "4K aerial cinematography",
    description:
      "Licensed-pilot 4K aerial photography & videography for grand reveals, venue shots and cinematic transitions.",
    startingPrice: 4999,
    deliveryTime: "10–20 days",
    whatsIncluded: ["Licensed pilot", "4K drone", "Up to 4 hrs", "Edited aerial clips"],
    extraCharges: ["No-fly zone permits", "Extended hours", "Outstation travel"],
    packages: [
      { name: "Basic", price: 4999, highlights: ["2 hrs", "Raw + basic edit"] },
      { name: "Standard", price: 8999, highlights: ["Half day", "Edited cinematic clips"] },
      { name: "Premium", price: 14999, highlights: ["Full event", "Multi-day capable"] },
    ],
    faqs: COMMON_FAQS,
    samplePhotos: ["sapphire", "ivory"],
    sampleVideos: [],
  },
  {
    slug: "instagram-reel",
    icon: "🎞️",
    name: "Instagram Reel",
    tagline: "Same-day, scroll-stopping reels",
    description:
      "30–60 second Instagram-ready reels with trending music, colour-grading and quick turnaround.",
    startingPrice: 3499,
    deliveryTime: "24–72 hrs",
    whatsIncluded: ["1 cinematic reel (30–60s)", "Trending audio", "Vertical 9:16 export"],
    extraCharges: ["Additional reels", "Same-day delivery"],
    packages: [
      { name: "Single Reel", price: 3499, highlights: ["1 reel", "48 hr delivery"] },
      { name: "Combo (3 reels)", price: 8999, highlights: ["3 reels", "Priority edit"] },
      { name: "Wedding Series (5+)", price: 14999, highlights: ["5+ reels", "Same-day teaser"] },
    ],
    faqs: COMMON_FAQS,
    samplePhotos: ["rose", "marigold"],
    sampleVideos: [],
  },
  {
    slug: "album-design",
    icon: "📖",
    name: "Album Design & Print",
    tagline: "Hardbound flush-mount albums",
    description:
      "Premium hardbound flush-mount albums with custom design, premium paper and protective cover.",
    startingPrice: 6500,
    deliveryTime: "15–30 days",
    whatsIncluded: ["12×18 hardbound album", "30 sheets / 60 pages", "Custom design", "Premium box"],
    extraCharges: ["Extra sheets", "Parent copies", "Leather/wooden cover"],
    packages: [
      { name: "Basic", price: 6500, highlights: ["12×18", "30 sheets"] },
      { name: "Standard", price: 11999, highlights: ["12×36 flush", "40 sheets", "Premium box"] },
      { name: "Premium", price: 18999, highlights: ["Leather cover", "60 sheets", "2 parent copies"] },
    ],
    faqs: COMMON_FAQS,
    samplePhotos: ["ivory", "royal"],
    sampleVideos: [],
  },
  {
    slug: "wedding-coverage",
    icon: "💍",
    name: "Full Wedding Coverage",
    tagline: "Photography + Video bundle",
    description:
      "Complete wedding coverage with photography, videography, cinematic film, drone and reels in a single bundle.",
    startingPrice: 49999,
    deliveryTime: "30–45 days",
    whatsIncluded: [
      "2 photographers + 2 cinematographers",
      "Drone coverage",
      "Cinematic film + highlight reel",
      "500+ edited photos",
      "Premium album",
    ],
    extraCharges: COMMON_EXTRA,
    packages: [
      { name: "Silver", price: 49999, highlights: ["1 day", "Photo + Video", "Highlight reel"] },
      { name: "Gold", price: 89999, highlights: ["2 days", "Drone", "Cinematic film", "Album"] },
      { name: "Platinum", price: 149999, highlights: ["3 days", "Pre-wedding included", "Premium album + reels"] },
    ],
    faqs: COMMON_FAQS,
    samplePhotos: ["royal", "rose", "ivory", "sapphire"],
    sampleVideos: [],
  },
  {
    slug: "birthday-event",
    icon: "🎉",
    name: "Birthday / Event Coverage",
    tagline: "Birthdays, parties & corporate",
    description:
      "Coverage for birthdays, anniversaries, corporate events and private parties — photo, video and reels.",
    startingPrice: 7999,
    deliveryTime: "10–20 days",
    whatsIncluded: ["3–4 hr coverage", "150+ edited photos", "1 highlight reel"],
    extraCharges: ["Extra hours", "Drone add-on", "Same-day reel"],
    packages: [
      { name: "Basic", price: 7999, highlights: ["3 hrs", "Photo only"] },
      { name: "Standard", price: 12999, highlights: ["4 hrs", "Photo + Video", "Reel"] },
      { name: "Premium", price: 19999, highlights: ["Full event", "Drone", "Same-day reel"] },
    ],
    faqs: COMMON_FAQS,
    samplePhotos: ["marigold", "rose"],
    sampleVideos: [],
  },
];
export const IMPORTANT_NOTES = [
  "Travel charges extra for outstation",
  "Hotel & food required if outstation",
  "Toll & parking paid by customer",
  "Advance booking required to confirm date",
  "Remaining payment on event day",
  "Raw data export has extra charges",
  "Album delivery in 15–30 days",
  "Video delivery in 20–45 days",
];
export function getPhotoService(slug: string) {
  return PHOTO_SERVICES.find((s) => s.slug === slug);
}
export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
// Build a human-friendly Order ID for photography enquiries.
// Format: MYS-YYYYMMDD-XXXXXX (XXXXXX is the global 6-digit ID).
export function formatPhotoOrderId(sixDigit: string) {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `MYS-${y}${m}${day}-${sixDigit}`;
}
// Procedural cover gradients keyed by name (no asset deps).
export const PHOTO_PALETTES: Record<string, string> = {
  royal: "linear-gradient(135deg, oklch(0.32 0.12 25) 0%, oklch(0.55 0.18 70) 100%)",
  rose: "linear-gradient(135deg, oklch(0.45 0.13 15) 0%, oklch(0.78 0.10 45) 100%)",
  ivory: "linear-gradient(135deg, oklch(0.92 0.04 80) 0%, oklch(0.65 0.10 60) 100%)",
  sapphire: "linear-gradient(135deg, oklch(0.22 0.10 260) 0%, oklch(0.55 0.18 250) 100%)",
  emerald: "linear-gradient(135deg, oklch(0.30 0.10 160) 0%, oklch(0.60 0.15 150) 100%)",
  marigold: "linear-gradient(135deg, oklch(0.55 0.18 60) 0%, oklch(0.80 0.16 80) 100%)",
};