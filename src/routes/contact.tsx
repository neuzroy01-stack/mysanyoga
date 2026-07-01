import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { SITE, waLink } from "@/lib/site";
import { MessageCircle, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MySanyoga" },
      { name: "description", content: "Get in touch on WhatsApp for instant quotes on weddings, parties and event services." },
      { property: "og:title", content: "Contact — MySanyoga" },
      { property: "og:description", content: "Get in touch on WhatsApp for instant quotes on weddings, parties and event services." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", service: CATEGORIES[0].title, date: "", guests: "", note: "" });
  const message = `Hi MySanyoga, I'd like a quote.%0A%0AName: ${form.name}%0AService: ${form.service}%0AEvent Date: ${form.date}%0AGuest count: ${form.guests}%0ANotes: ${form.note}`;
  const href = `https://wa.me/${SITE.whatsapp}?text=${message}`;

  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Contact</div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1]">Let's plan <span className="italic text-gradient-gold">your moment</span></h1>
          <p className="mt-6 text-muted-foreground max-w-md">Fill the form and send it straight to our WhatsApp — we'll respond with options, packages and pricing within minutes.</p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full border border-gold-hairline flex items-center justify-center text-primary"><MessageCircle className="h-4 w-4" /></div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">WhatsApp</div>
                <a href={waLink("Hi MySanyoga")} className="font-display text-xl hover:text-primary">{SITE.whatsappDisplay}</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full border border-gold-hairline flex items-center justify-center text-primary"><Clock className="h-4 w-4" /></div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Hours</div>
                <div className="font-display text-xl">9 AM – 11 PM · All days</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full border border-gold-hairline flex items-center justify-center text-primary"><MapPin className="h-4 w-4" /></div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Service Area</div>
                <div className="font-display text-xl">Pan-India bookings</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={(e) => { e.preventDefault(); window.open(href, "_blank"); }}
          className="rounded-3xl border border-gold-hairline bg-card p-8 md:p-10"
        >
          <div className="grid gap-5">
            <Field label="Your Name">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Full name" />
            </Field>
            <Field label="Service Interested In">
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="input">
                {CATEGORIES.map((c) => <option key={c.slug} value={c.title} className="bg-background">{c.title}</option>)}
                <option value="Multiple Services" className="bg-background">Multiple Services / Full Package</option>
              </select>
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Event Date">
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
              </Field>
              <Field label="Guest Count">
                <input type="number" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="input" placeholder="e.g. 200" />
              </Field>
            </div>
            <Field label="Tell us more">
              <textarea rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input resize-none" placeholder="City, venue, preferences..." />
            </Field>
            <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-gold-glow hover:scale-[1.01] transition">
              <MessageCircle className="h-4 w-4" /> Send via WhatsApp
            </button>
            <p className="text-xs text-muted-foreground text-center">Your enquiry opens in WhatsApp — no spam, no calls.</p>
          </div>
        </motion.form>
      </div>

      <style>{`.input { width:100%; background: oklch(0.13 0.02 25); border:1px solid oklch(0.3 0.05 30 / 40%); border-radius: 0.75rem; padding: 0.85rem 1rem; color: var(--foreground); font-size: 0.9rem; outline: none; transition: border-color .2s; }
        .input:focus { border-color: var(--primary); }
        .input::placeholder { color: oklch(0.55 0.03 70); }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</div>
      {children}
    </label>
  );
}