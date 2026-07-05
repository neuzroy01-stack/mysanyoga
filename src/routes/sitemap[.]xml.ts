import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/categories";
import { INVITATION_CARDS } from "@/lib/invitations";

type Entry = {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const base = SITE.url;
        const entries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/services", changefreq: "weekly", priority: "0.9" },
          { path: "/vehicle-booking", changefreq: "weekly", priority: "0.9" },
          { path: "/photography", changefreq: "weekly", priority: "0.9" },
          { path: "/invitations", changefreq: "weekly", priority: "0.9" },
          { path: "/gallery", changefreq: "monthly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
        ];

        for (const c of CATEGORIES) {
          entries.push({ path: `/services/${c.slug}`, changefreq: "monthly", priority: "0.8" });
        }
        for (const card of INVITATION_CARDS) {
          entries.push({ path: `/invitations/${card.code}`, changefreq: "monthly", priority: "0.6" });
        }

        const lastmod = new Date().toISOString();
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${base}${e.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${e.changefreq ?? "monthly"}</changefreq>\n    <priority>${e.priority ?? "0.5"}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});