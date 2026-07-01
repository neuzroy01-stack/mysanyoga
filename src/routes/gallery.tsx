import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/categories";
import heroImg from "@/assets/hero-wedding.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — MySanyoga" },
      { name: "description", content: "A cinematic gallery of weddings, receptions and events powered by MySanyoga." },
      { property: "og:title", content: "Gallery — MySanyoga" },
      { property: "og:description", content: "A cinematic gallery of weddings, receptions and events powered by MySanyoga." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const images = [heroImg, ...CATEGORIES.map((c) => c.image), ...CATEGORIES.map((c) => c.image).reverse()];
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Gallery</div>
          <h1 className="font-display text-5xl md:text-7xl">A reel of <span className="italic text-gradient-gold">celebrations</span></h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">Moments from weddings, receptions, birthdays and ceremonies — all assembled, captured and remembered through MySanyoga.</p>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="relative break-inside-avoid overflow-hidden rounded-xl border border-gold-hairline group"
            >
              <img src={src} alt="Event moment" loading="lazy" width={1280} height={896} className="w-full transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}