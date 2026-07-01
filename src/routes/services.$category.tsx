import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CATEGORIES, getCategory } from "@/lib/categories";
import type { Category } from "@/lib/site";
import { waLink } from "@/lib/site";
import { ArrowLeft, MessageCircle, Check } from "lucide-react";
import { InvitationsGallerySection } from "@/components/InvitationsGallerySection";
import { PhotographyHubSection } from "@/components/PhotographyHubSection";

export const Route = createFileRoute("/services/$category")({
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.cat;
    if (!cat) return { meta: [{ title: "Service — MySanyoga" }] };
    return {
      meta: [
        { title: `${cat.title} — MySanyoga` },
        { name: "description", content: cat.description },
        { property: "og:title", content: `${cat.title} — MySanyoga` },
        { property: "og:description", content: cat.description },
        { property: "og:image", content: cat.image },
        { name: "twitter:image", content: cat.image },
      ],
    };
  },
  component: CategoryPage,
  errorComponent: ({ error }) => (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Link to="/services" className="text-primary underline">Back to services</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Category not found</h1>
        <Link to="/services" className="text-primary underline">Browse all services</Link>
      </div>
    </div>
  ),
});

function CategoryPage() {
  const { cat } = Route.useLoaderData() as { cat: Category };
  const others = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 3);
  const isMerged = cat.slug === "invitations" || cat.slug === "photography";
  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.img initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} src={cat.image} alt={cat.title} className="absolute inset-0 h-full w-full object-cover" width={1280} height={896} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex flex-col justify-end pb-16">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit">
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{cat.tagline}</div>
            <h1 className="font-display text-5xl md:text-7xl max-w-3xl">{cat.title}</h1>
            <p className="mt-5 text-muted-foreground max-w-xl">{cat.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Services list */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          {cat.slug === "vehicle-rental" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl border border-primary/40 bg-primary/5 p-6 md:p-8"
            >
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                  New · Smart Fare Calculator
                </div>
                <h3 className="font-display text-2xl md:text-3xl">
                  Calculate your fare instantly
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  Add multiple vehicles, set distance & waiting hours and watch
                  the live breakdown update in real-time.
                </p>
              </div>
              <Link
                to="/vehicle-booking"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold-glow"
              >
                Open Calculator
              </Link>
            </motion.div>
          )}

          {cat.slug === "invitations" && (
            <InvitationsGallerySection embedded />
          )}

          {cat.slug === "photography" && (
            <PhotographyHubSection embedded />
          )}

          {!isMerged && (
          <div className="grid gap-5">
            {cat.services.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group grid md:grid-cols-12 gap-6 items-center rounded-2xl border border-gold-hairline bg-card p-6 md:p-8 hover:border-primary/50 transition"
              >
                <div className="md:col-span-1 text-3xl font-display text-primary/60">{String(i + 1).padStart(2, "0")}</div>
                <div className="md:col-span-5">
                  <h3 className="font-display text-2xl">{s.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.detail}</p>
                </div>
                <div className="md:col-span-3">
                  {s.from && (
                    <>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Starting</div>
                      <div className="font-display text-2xl text-gradient-gold">{s.from}</div>
                    </>
                  )}
                </div>
                <div className="md:col-span-3 flex md:justify-end gap-2">
                  <a href={waLink(`Hi MySanyoga, I'd like a quote for: ${s.name} (${cat.title}).`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:scale-[1.02] transition">
                    <MessageCircle className="h-3.5 w-3.5" /> Enquire
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          {!isMerged && (
          <>
          {/* Trust strip */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6 text-center">
            {[
              "Transparent pricing — no hidden fees",
              "Verified vendors across India",
              "WhatsApp support, advance & full payment",
            ].map((t) => (
              <div key={t} className="rounded-2xl border border-gold-hairline bg-card/50 p-6">
                <Check className="h-5 w-5 text-primary mx-auto mb-3" />
                <div className="text-sm text-muted-foreground">{t}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-3xl border border-gold-hairline bg-[oklch(0.16_0.04_20)] p-10 md:p-14 text-center">
            <h3 className="font-display text-3xl md:text-4xl">Custom package for your <span className="italic text-gradient-gold">{cat.title.toLowerCase()}</span></h3>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Share your dates, guest count and preferences. We'll respond with a tailored quote on WhatsApp.</p>
            <a href={waLink(`Hi MySanyoga, I'd like a custom quote for ${cat.title}.`)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-gold-glow">
              <MessageCircle className="h-4 w-4" /> Get Custom Quote
            </a>
          </div>
          </>
          )}

          {/* Other categories */}
          <div className="mt-24">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Continue exploring</div>
            <div className="grid sm:grid-cols-3 gap-4">
              {others.map((o) => (
                <Link key={o.slug} to="/services/$category" params={{ category: o.slug }} className="group relative overflow-hidden rounded-xl border border-gold-hairline aspect-video">
                  <img src={o.image} alt={o.title} loading="lazy" width={1280} height={896} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-1">Next</div>
                    <div className="font-display text-xl">{o.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
