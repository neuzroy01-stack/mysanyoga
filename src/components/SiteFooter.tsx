import { Link } from "@tanstack/react-router";
import { SITE, waLink } from "@/lib/site";
import { CATEGORIES } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-gold-hairline bg-[oklch(0.09_0.015_25)]">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl text-gradient-gold mb-3">{SITE.name}</div>
          <p className="text-sm text-muted-foreground max-w-sm">
            A complete marketplace for weddings, parties, receptions, birthdays and religious ceremonies — vehicles, invitations, photography, catering, sweets and decor, all in one place.
          </p>
          <a href={waLink("Hi MySanyoga, I'd like to enquire.")} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline">
            Chat on WhatsApp →
          </a>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Services</div>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to="/services/$category" params={{ category: c.slug }} className="text-muted-foreground hover:text-foreground transition">{c.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
            <li><Link to="/services" className="text-muted-foreground hover:text-foreground">All Services</Link></li>
            <li><Link to="/gallery" className="text-muted-foreground hover:text-foreground">Gallery</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold-hairline">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} {SITE.name}. Crafted for celebrations.</div>
          <div>All bookings & enquiries on WhatsApp.</div>
        </div>
      </div>
    </footer>
  );
}