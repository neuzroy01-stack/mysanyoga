import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Camera, Check, Instagram, Youtube, Star } from "lucide-react";
import { PHOTO_SERVICES, IMPORTANT_NOTES, formatINR, PHOTO_PALETTES, type PhotoService } from "@/lib/photography";
import { SITE, waLink } from "@/lib/site";
import { PhotoBookingModal } from "@/components/PhotoBookingModal";

/**
 * Per-card background media. Each key is a PHOTO_SERVICES slug.
 *
 * To set a background later, fill `image` (any URL or imported asset)
 * and/or `video` (mp4 ≈ 6s, muted, looping). Both are optional —
 * when both are blank the existing palette gradient is shown.
 *
 * Example below shows how to wire one in. Leave the rest empty until
 * you have assets to drop in.
 *
 *   // import sampleVideo from "@/assets/photography/wedding-loop.mp4";
 *   // import sampleImage from "@/assets/photography/wedding-cover.jpg";
 *   "wedding-photography": { image: sampleImage, video: sampleVideo },
 */
type ServiceMedia = { image?: string; video?: string };
const PHOTO_MEDIA: Record<string, ServiceMedia> = {
  // Premium stock backgrounds per service. Swap any `image` with a local asset later.
  "photography":            { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80" },
  "videography":            { image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80" },
  "cinematic-wedding-film": { image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80" },
  "pre-wedding-shoot":      { image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1400&q=80" },
  "drone-shoot":            { image: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?auto=format&fit=crop&w=1400&q=80" },
  "instagram-reel":         { image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80" },
  "album-design":           { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80" },
  "wedding-coverage":       { image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80" },
  "birthday-event":         { image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1400&q=80" },
};

// Category-based fallback if a slug isn't listed above.
const PHOTO_FALLBACK =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80";

export function PhotographyHubSection({ embedded = false }: { embedded?: boolean }) {
  const [bookingSvc, setBookingSvc] = useState<PhotoService | null>(null);
  return (
    <>
      {/* Hero — hidden when embedded inside the category page (which renders its own hero) */}
      {!embedded && (
        <section className="relative py-24 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: PHOTO_PALETTES.royal }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          <div className="relative mx-auto max-w-7xl px-6">
            <Link
              to="/services/$category"
              params={{ category: "photography" }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to services
            </Link>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Photography & Film
            </div>
            <h1 className="font-display text-5xl md:text-7xl max-w-3xl">
              Memories, <span className="italic text-gradient-gold">framed forever</span>
            </h1>
            <p className="mt-5 text-muted-foreground max-w-xl">
              Choose from 9 specialised services — photography, cinematic films,
              drone, reels and full wedding bundles. Transparent packages, instant
              WhatsApp booking.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:border-primary/50"
              >
                <Instagram className="h-3.5 w-3.5" /> View Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:border-primary/50"
              >
                <Youtube className="h-3.5 w-3.5" /> Watch Wedding Films
              </a>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:border-primary/50"
              >
                <Camera className="h-3.5 w-3.5" /> View Portfolio
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick portfolio / social row when embedded so the user still sees the links */}
      {embedded && (
        <div className="mb-10 flex flex-wrap gap-3 justify-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:border-primary/50"
          >
            <Instagram className="h-3.5 w-3.5" /> View Instagram
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:border-primary/50"
          >
            <Youtube className="h-3.5 w-3.5" /> Watch Wedding Films
          </a>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:border-primary/50"
          >
            <Camera className="h-3.5 w-3.5" /> View Portfolio
          </Link>
        </div>
      )}

      {/* Services grid */}
      <section className={embedded ? "" : "py-16"}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PHOTO_SERVICES.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => setBookingSvc(s)}
                  className="group block w-full text-left rounded-2xl border border-gold-hairline bg-card overflow-hidden hover:border-primary/50 transition cursor-pointer"
                >
                  <div
                    className="aspect-[4/3] relative overflow-hidden"
                    style={{ background: PHOTO_PALETTES[s.samplePhotos[0] ?? "royal"] }}
                  >
                    {/* Background media layer — image and/or 6s looping video.
                        Falls back to the palette gradient above when both are blank. */}
                    <img
                      src={PHOTO_MEDIA[s.slug]?.image || PHOTO_FALLBACK}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {PHOTO_MEDIA[s.slug]?.video && (
                      <video
                        src={PHOTO_MEDIA[s.slug]!.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4 text-3xl">{s.icon}</div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-1">
                        {s.tagline}
                      </div>
                      <div className="font-display text-2xl text-white">{s.name}</div>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Starting
                      </div>
                      <div className="font-display text-xl text-gradient-gold">
                        {formatINR(s.startingPrice)}
                      </div>
                    </div>
                    <span className="text-xs text-primary group-hover:translate-x-1 transition">
                      Explore →
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important notes */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 md:p-10">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Important notes
            </div>
            <h3 className="font-display text-3xl mb-6">Things to know before booking</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {IMPORTANT_NOTES.map((n) => (
                <li key={n} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { k: "500+", v: "Weddings Covered" },
              { k: "2,000+", v: "Happy Customers" },
              { k: "8 yrs", v: "Of Experience" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-gold-hairline bg-card p-6 text-center">
                <div className="font-display text-3xl text-gradient-gold">{s.k}</div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "Priya & Arjun", t: "Cinematic film was beyond expectations. Family is still talking about it!" },
              { n: "Rohit S.", t: "Drone shots of our baraat — absolutely magical. Highly recommend." },
              { n: "Anjali", t: "Got our reels within 48 hours. Loved every frame." },
            ].map((r) => (
              <div key={r.n} className="rounded-2xl border border-gold-hairline bg-card p-6">
                <div className="flex gap-0.5 text-primary mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">"{r.t}"</p>
                <div className="mt-3 text-xs font-medium">— {r.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="font-display text-3xl md:text-4xl">
            Ready to <span className="italic text-gradient-gold">book your shoot?</span>
          </h3>
          <p className="text-muted-foreground mt-3">
            Chat with us on WhatsApp at {SITE.whatsappDisplay} or pick a service above to enquire.
          </p>
          <a
            href={waLink("Hi MySanyoga, I'd like a photography quote.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-gold-glow"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <PhotoBookingModal
        svc={bookingSvc}
        open={!!bookingSvc}
        onOpenChange={(v) => { if (!v) setBookingSvc(null); }}
      />
    </>
  );
}