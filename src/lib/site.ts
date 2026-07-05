export const SITE = {
  name: "MySanyoga",
  tagline: "Wedding & Event Universe",
  whatsapp: "919328443030",
  whatsappDisplay: "+91 93284 43030",
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://mysanyoga.com",
  description:
    "MySanyoga — India's complete wedding & event marketplace. Book vehicles, invitations, photography, catering, sweets and decor for weddings, receptions, birthdays and ceremonies.",
};

export function absUrl(path: string = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${p}`;
}

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type Category = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  services: { name: string; detail: string; from?: string }[];
};