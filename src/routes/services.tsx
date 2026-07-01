import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/categories";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "All Services — MySanyoga" },
      { name: "description", content: "Browse vehicle rental, invitations, photography, catering, sweets and decor services for weddings, parties and ceremonies." },
      { property: "og:title", content: "All Services — MySanyoga" },
      { property: "og:description", content: "Browse vehicle rental, invitations, photography, catering, sweets and decor services." },
    ],
  }),
  component: ServicesLayout,
});

function ServicesLayout() {
  const matchRoute = useMatchRoute();
  const isIndex = matchRoute({ to: "/services", fuzzy: false });
  if (!isIndex) return <Outlet />;
  return <ServicesIndex />;
}

function ServicesIndex() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">All Services</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-4xl mx-auto">Every service your <span className="italic text-gradient-gold">celebration</span> needs</h1>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">Six universes of curated vendors and packages — pick what you need, get instant pricing on WhatsApp.</p>
        </motion.div>

        <div className="space-y-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <Link to="/services/$category" params={{ category: cat.slug }} className="group block rounded-3xl border border-gold-hairline bg-card overflow-hidden hover:shadow-gold-glow transition-shadow">
                <div className={`grid md:grid-cols-2 ${i % 2 ? "md:[&>:first-child]:order-2" : ""}`}>
                  <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                    <img src={cat.image} alt={cat.title} loading="lazy" width={1280} height={896} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-10 md:p-14 flex flex-col justify-center">
                    <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">0{i + 1} · {cat.tagline}</div>
                    <h2 className="font-display text-4xl md:text-5xl mb-4">{cat.title}</h2>
                    <p className="text-muted-foreground mb-6">{cat.description}</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-8">
                      {cat.services.slice(0, 4).map((s) => (
                        <li key={s.name} className="flex items-start gap-2 text-muted-foreground"><span className="text-primary">◆</span>{s.name}</li>
                      ))}
                    </ul>
                    <div className="inline-flex items-center gap-2 text-sm text-primary">Open category <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}