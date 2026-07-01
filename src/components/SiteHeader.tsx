import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-gold-hairline bg-background/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9">
            <div className="absolute inset-0 mandala-ring animate-spin-slow" />
            <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center font-display text-primary font-semibold">M</div>
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg tracking-wide text-foreground">{SITE.name}</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{SITE.tagline}</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="text-muted-foreground hover:text-foreground transition">Home</Link>
          <Link to="/services" activeProps={{ className: "text-primary" }} className="text-muted-foreground hover:text-foreground transition">Services</Link>
          <Link to="/gallery" activeProps={{ className: "text-primary" }} className="text-muted-foreground hover:text-foreground transition">Gallery</Link>
          <Link to="/contact" activeProps={{ className: "text-primary" }} className="text-muted-foreground hover:text-foreground transition">Contact</Link>
        </nav>
        <Link to="/contact" className="hidden sm:inline-flex items-center rounded-full border border-gold-hairline px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary hover:bg-primary hover:text-primary-foreground transition">
          Book Now
        </Link>
      </div>
    </header>
  );
}