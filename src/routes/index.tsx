import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import heroImg from "@/assets/hero-wedding.jpg";
import { CATEGORIES } from "@/lib/categories";
import { SITE, waLink } from "@/lib/site";
import { ArrowRight, Sparkles, Star, Search, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MySanyoga — Wedding & Event Services Marketplace" },
      { name: "description", content: "Book vehicles, invitations, photography, catering, sweets and decor for weddings, parties & ceremonies — one cinematic platform." },
      { property: "og:title", content: "MySanyoga — Wedding & Event Universe" },
      { property: "og:description", content: "A complete marketplace for weddings, receptions, birthdays & religious events." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Home,
});

function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
  <Hero />

  <section className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-gold-hairline">
    <div className="mx-auto max-w-7xl px-6 py-4 flex justify-end">

      {!searchOpen ? (
        <button
          onClick={() => setSearchOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl transition hover:scale-110"
        >
          <Search className="h-5 w-5" />
        </button>
      ) : (
        <div className="relative w-full max-w-md">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-full border border-gold-hairline bg-background pl-12 pr-14 py-3 shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            onClick={() => {
              setSearchQuery("");
              setSearchOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600 hover:rotate-90 hover:scale-110"
          >
            <X className="h-4 w-4" />
          </button>

        </div>
      )}

    </div>
  </section>

  <Marquee />
      <CategoriesSection searchQuery={searchQuery} />
      <FeaturedPackages />
      <ProcessSection />
      <ReviewsSection />
      <GalleryPreview />
      <ContactCTA />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100vh] overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img src={heroImg} alt="Royal Indian wedding ceremony" className="h-full w-full object-cover" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </motion.div>

      {/* Floating mandala */}
      <div className="absolute -right-32 top-1/3 h-[600px] w-[600px] mandala-ring animate-spin-slow opacity-40 pointer-events-none" />
      <div className="absolute -left-40 -bottom-20 h-[500px] w-[500px] mandala-ring animate-spin-slow opacity-30 pointer-events-none" style={{ animationDirection: "reverse" }} />

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 rounded-full border border-gold-hairline bg-background/40 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-primary">
          <Sparkles className="h-3 w-3" /> Complete Event Marketplace
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }} className="mt-8 font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] max-w-5xl">
          <span className="text-gradient-gold">Every celebration,</span>
          <br />
          <span className="text-foreground italic">one royal platform.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="mt-8 max-w-2xl text-base md:text-lg text-muted-foreground">
          Vehicles, invitations, photography, catering, sweets and decor — discover, compare and book every wedding & event service through a single cinematic experience.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/services" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-gold-glow transition hover:scale-[1.02]">
            Explore Services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a href={waLink("Hi MySanyoga, I'd like a quick quote for my event.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gold-hairline bg-background/30 backdrop-blur px-7 py-3.5 text-sm text-foreground hover:bg-background/60 transition">
            Get Quote on WhatsApp
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Scroll to discover ↓
        </motion.div>
      </motion.div>
    </section>
  );
}

function Marquee() {
  const items = ["Wedding Cars", "Luxury Sedans", "Halwai Catering", "Drone Cinematography", "Mandap Decor", "Mithai & Gift Boxes", "DJ & Lighting", "Video Invitations", "Bus Booking"];
  return (
    <div className="border-y border-gold-hairline bg-[oklch(0.09_0.015_25)] py-5 overflow-hidden">
      <div className="flex gap-12 animate-[shimmer_30s_linear_infinite] whitespace-nowrap" style={{ animation: "marquee 35s linear infinite" }}>
        {[...items, ...items, ...items].map((it, i) => (
          <div key={i} className="flex items-center gap-12 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            <span>{it}</span>
            <span className="text-primary">✦</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function CategoriesSection({ searchQuery }: { searchQuery: string }) {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>

            
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Service Categories



            </div>
            <h2 className="font-display text-4xl md:text-6xl max-w-2xl">Six universes, <span className="italic text-gradient-gold">one celebration</span></h2>
          </div>
          <p className="text-muted-foreground max-w-md">Each category opens into a detailed page with packages, pricing, sample work and instant WhatsApp booking.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES
  .filter((cat) => {
    if (!searchQuery) return true;

    return (
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    );
  })
  .map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              style={{ perspective: 1000 }}
            >
              <Link
                to="/services/$category"
                params={{ category: cat.slug }}
                className="group block relative overflow-hidden rounded-2xl border border-gold-hairline bg-card transition-transform duration-500 hover:-translate-y-2 hover:shadow-gold-glow"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={cat.image} alt={cat.title} loading="lazy" width={1280} height={896} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-primary">0{i + 1}</div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">{cat.tagline}</div>
                  <h3 className="font-display text-3xl mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
                    Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedPackages() {
  const packs = [
    { name: "Intimate Wedding", price: "₹1.85 L", tag: "100 guests", items: ["Decorated wedding car", "Photographer + reel", "Halwai catering (100)", "Stage decoration", "Sound & DJ"] },
    { name: "Royal Wedding", price: "₹4.50 L", tag: "300 guests", items: ["Luxury car + 2 SUVs", "Cinematic film + drone", "Premium catering (300)", "Mandap + flower decor", "Lighting + DJ + tent"], featured: true },
    { name: "Reception Night", price: "₹1.25 L", tag: "200 guests", items: ["SUV for couple", "Photo + video coverage", "Snacks + dinner (200)", "Stage + lighting", "DJ for 4 hours"] },
  ];
  return (
    <section className="relative py-28 bg-[oklch(0.09_0.015_25)] border-y border-gold-hairline">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Featured Packages</div>
          <h2 className="font-display text-4xl md:text-6xl">Curated bundles, <span className="italic text-gradient-gold">honest pricing</span></h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {packs.map((p) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`relative rounded-2xl border p-8 ${p.featured ? "border-primary bg-card shadow-gold-glow" : "border-gold-hairline bg-card/50"}`}
            >
              {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] uppercase tracking-[0.25em] text-primary-foreground">Most Loved</div>}
              <div className="text-xs uppercase tracking-[0.25em] text-primary">{p.tag}</div>
              <h3 className="mt-3 font-display text-3xl">{p.name}</h3>
              <div className="mt-4 text-4xl font-display text-gradient-gold">{p.price}</div>
              <div className="text-xs text-muted-foreground mt-1">all-inclusive · customisable</div>
              <ul className="mt-6 space-y-3 text-sm">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span className="text-muted-foreground">{it}</span></li>
                ))}
              </ul>
              <a href={waLink(`Hi MySanyoga, I'm interested in the ${p.name} package.`)} target="_blank" rel="noopener noreferrer" className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm transition ${p.featured ? "bg-primary text-primary-foreground hover:scale-[1.02]" : "border border-gold-hairline hover:bg-primary hover:text-primary-foreground"}`}>
                Enquire on WhatsApp
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { n: "01", t: "Browse & Choose", d: "Explore six service universes and shortlist what you need." },
    { n: "02", t: "Get Custom Quote", d: "Send your dates and guest count — we'll respond on WhatsApp within minutes." },
    { n: "03", t: "Confirm & Pay", d: "Lock your slot with advance payment via UPI, PhonePe, Google Pay or card." },
    { n: "04", t: "Celebrate", d: "Track drivers live, get real-time updates and enjoy your event." },
  ];
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">How It Works</div>
          <h2 className="font-display text-4xl md:text-6xl">From dream to <span className="italic text-gradient-gold">done</span></h2>
        </div>
        <div className="grid gap-8 md:grid-cols-4 relative">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-hairline bg-background font-display text-xl text-primary">{s.n}</div>
              <h3 className="font-display text-xl mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const reviews = [
    { n: "Priya & Aditya", e: "Royal Wedding · Jaipur", t: "MySanyoga handled everything — cars, catering, decor, photography. It felt like having a personal wedding concierge.", r: 5 },
    { n: "Rohan Mehta", e: "Birthday Party · Mumbai", t: "Booked DJ, snacks and decor in one place. WhatsApp response was instant and pricing was completely transparent.", r: 5 },
    { n: "Sharma Family", e: "Religious Ceremony · Delhi", t: "Halwai, tent, and pure-veg catering — every detail respected our traditions. Will book again for every event.", r: 5 },
  ];
  return (
    <section className="py-28 bg-[oklch(0.09_0.015_25)] border-y border-gold-hairline">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Customer Stories</div>
          <h2 className="font-display text-4xl md:text-6xl">Loved by <span className="italic text-gradient-gold">thousands of families</span></h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-gold-hairline bg-card p-8">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.r }).map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="font-display text-lg leading-relaxed mb-6">"{r.t}"</p>
              <div className="border-t border-gold-hairline pt-4">
                <div className="font-medium">{r.n}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{r.e}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Moments</div>
            <h2 className="font-display text-4xl md:text-6xl">A glimpse into our <span className="italic text-gradient-gold">celebrations</span></h2>
          </div>
          <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">View full gallery <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c, i) => (
            <motion.div key={c.slug} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={`relative overflow-hidden rounded-xl group ${i === 0 ? "row-span-2 col-span-2" : ""}`}>
              <img src={c.image} alt={c.title} loading="lazy" width={1280} height={896} className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${i === 0 ? "h-full min-h-[400px]" : "h-48 md:h-56"}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-xs uppercase tracking-[0.2em] text-primary">{c.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 mandala-ring opacity-10" style={{ background: "radial-gradient(circle at center, oklch(0.36 0.13 20 / 30%), transparent 60%)" }} />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-5xl md:text-7xl">
          Ready to <span className="italic text-gradient-gold">begin?</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Send us your date, guest count and a wishlist of services. We'll respond on WhatsApp with a curated quote within minutes.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href={waLink("Hi MySanyoga, I'm planning an event and would like a custom quote.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-gold-glow hover:scale-[1.02] transition">
            Start on WhatsApp <ArrowRight className="h-4 w-4" />
          </a>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-8 py-4 text-sm hover:bg-background/60 transition">
            Send Enquiry Form
          </Link>
        </div>
        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {SITE.whatsappDisplay} · Replies within minutes
        </p>
      </div>
    </section>
  );
}
