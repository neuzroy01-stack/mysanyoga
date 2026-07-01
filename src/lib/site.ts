export const SITE = {
  name: "MySanyoga",
  tagline: "Wedding & Event Universe",
  whatsapp: "919328443030",
  whatsappDisplay: "+91 93284 43030",
};

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