import vehicle from "@/assets/cat-vehicle.jpg";
import invitation from "@/assets/cat-invitation.jpg";
import photo from "@/assets/cat-photo.jpg";
import catering from "@/assets/cat-catering.jpg";
import sweets from "@/assets/cat-sweets.jpg";
import decor from "@/assets/cat-decor.jpg";
import type { Category } from "./site";

export const CATEGORIES: Category[] = [
  
  {
    slug: "invitations",
    title: "Invitations",
    tagline: "First impressions, beautifully printed",
    description:
      "Printed wedding cards, birthday cards, event cards, digital invitations and cinematic video invitation reels.",
    image: invitation,
    services: [
      { name: "Printed Wedding Cards", detail: "Gold foil, laser cut, hardbound options", from: "₹35 / card" },
      { name: "Birthday Cards", detail: "Themed, custom illustrations", from: "₹18 / card" },
      { name: "Event Cards", detail: "Religious, corporate, anniversary", from: "₹22 / card" },
      { name: "Digital Invitation", detail: "PDF + animated WhatsApp e-invite", from: "₹499 flat" },
      { name: "Video Invitation Reel", detail: "Cinematic 30s reel with your photos", from: "₹1,499 flat" },
    ],
  },

  {
    slug: "vehicle-rental",
    title: "Vehicle Rental",
    tagline: "Arrive like royalty",
    description:
      "Wedding cars, luxury sedans, SUVs, tempo travellers and buses — chauffeur included, transparent kilometre pricing.",
    image: vehicle,
    services: [
      { name: "Scorpio", detail: "Scorpio class with chauffeur", from: "₹1,800 / day" },
      { name: "Hyundai Cret", detail: "Hyundai Creta for family transfers", from: "₹1,700 / day" },
      { name: "Maruti Swift Dzire", detail: "Maruti Swift Dzire perfect for baraat & guests", from: "₹1,500 / day" },
      { name: "Wedding Car (Decorated)", detail: "AC sedan with floral decor, driver included", from: "₹6,500 / day"},
      { name: "Bus Booking", detail: "32–55 seater coach with experienced driver", from: "₹14,000 / day" },
    ],
  },

  /*{
    slug: "invitations",
    title: "Invitations",
    tagline: "First impressions, beautifully printed",
    description:
      "Printed wedding cards, birthday cards, event cards, digital invitations and cinematic video invitation reels.",
    image: invitation,
    services: [
      { name: "Printed Wedding Cards", detail: "Gold foil, laser cut, hardbound options", from: "₹35 / card" },
      { name: "Birthday Cards", detail: "Themed, custom illustrations", from: "₹18 / card" },
      { name: "Event Cards", detail: "Religious, corporate, anniversary", from: "₹22 / card" },
      { name: "Digital Invitation", detail: "PDF + animated WhatsApp e-invite", from: "₹499 flat" },
      { name: "Video Invitation Reel", detail: "Cinematic 30s reel with your photos", from: "₹1,499 flat" },
   ],
  }, */
  
  {
    slug: "photography",
    title: "Photography & Film",
    tagline: "Memories, framed forever",
    description:
      "Photographers, videographers, drone shoots, cinematic wedding films, reels and printed album design.",
    image: photo,
    services: [
      { name: "Photographer", detail: "Full-day candid + traditional coverage", from: "₹15,000 / day" },
      { name: "Videographer", detail: "Multi-cam HD coverage with edits", from: "₹18,000 / day" },
      { name: "Drone Shoot", detail: "4K aerial coverage with licensed pilot", from: "₹8,000 / event" },
      { name: "Cinematic Wedding Film", detail: "5–8 min cinematic edit, color graded", from: "₹35,000" },
      { name: "Reels (Same-Day)", detail: "Instagram-ready 30–60s reels", from: "₹3,500" },
      { name: "Album Design & Print", detail: "Premium hardbound flush mount albums", from: "₹6,500" },
    ],
  },
  
  {
    slug: "catering",
    title: "Catering",
    tagline: "Feasts that linger in memory",
    description:
      "Halwai booking, wedding catering, party catering and religious event catering — per plate pricing, live counters.",
    image: catering,
    services: [
      { name: "Halwai Booking", detail: "Traditional in-house cooking with team", from: "₹220 / plate" },
      { name: "Wedding Catering", detail: "Multi-cuisine, live counters, full service", from: "₹450 / plate" },
      { name: "Party Catering", detail: "Birthday, anniversary, corporate", from: "₹320 / plate" },
      { name: "Religious Event Catering", detail: "Sattvik · Jain · Pure veg menus", from: "₹260 / plate" },
    ],
  },
  {
    slug: "sweets-snacks",
    title: "Sweets & Snacks",
    tagline: "Mithai, namkeen & gift boxes",
    description:
      "Bulk mithai orders, namkeen, event snack packaging and beautifully wrapped gift boxes.",
    image: sweets,
    services: [
      { name: "Mithai Orders", detail: "Kaju katli, barfi, laddoo, sandesh & more", from: "₹520 / kg" },
      { name: "Namkeen Orders", detail: "Mixture, bhujia, chivda — fresh batches", from: "₹280 / kg" },
      { name: "Event Snack Packaging", detail: "Per-guest snack boxes, branded", from: "₹85 / box" },
      { name: "Gift Boxes", detail: "Premium dry fruit & mithai assortments", from: "₹650 / box" },
    ],
  },
  {
    slug: "decor-and-more",
    title: "Decor, DJ & Tent",
    tagline: "The stage for your celebration",
    description:
      "Decoration, DJ & sound, tent house, flower decoration and lighting — assembled into one seamless production.",
    image: decor,
    services: [
      { name: "Decoration Services", detail: "Mandap, stage, entrance, themed setups", from: "₹25,000" },
      { name: "DJ & Sound System", detail: "Pro DJ with line-array sound + mic", from: "₹12,000 / night" },
      { name: "Tent House Services", detail: "Tents, chairs, tables, carpets, crockery", from: "₹35,000" },
      { name: "Flower Decoration", detail: "Fresh floral installations & garlands", from: "₹18,000" },
      { name: "Lighting Services", detail: "Fairy, gobo, uplighting, facade lighting", from: "₹15,000" },
    ],
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}