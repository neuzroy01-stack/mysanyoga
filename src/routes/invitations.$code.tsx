import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Clock, MessageCircle, Package, PlayCircle, Truck } from "lucide-react";
import {
  getCardByCode,
  formatINR,
  INVITATION_CARDS,
  type InvitationCard,
} from "@/lib/invitations";
import { CardCover } from "@/components/CardCover";
import { OrderModal } from "@/components/OrderModal";

export const Route = createFileRoute("/invitations/$code")({
  loader: ({ params }) => {
    const card = getCardByCode(params.code);
    if (!card) throw notFound();
    return { card };
  },
  head: ({ loaderData }) => {
    const card = loaderData?.card;
    if (!card) return { meta: [{ title: "Invitation — MySanyoga" }] };
    return {
      meta: [
        { title: `${card.name} (#${card.code}) — MySanyoga` },
        { name: "description", content: card.description },
        { property: "og:title", content: `${card.name} — MySanyoga` },
        { property: "og:description", content: card.description },
      ],
    };
  },
  component: InvitationDetail,
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Design not found</h1>
        <Link to="/invitations" className="text-primary underline">Browse all designs</Link>
      </div>
    </div>
  ),
});

const RECENT_KEY = "mysanyoga:recent-invitations";

function pushRecent(code: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    const next = [code, ...arr.filter((c) => c !== code)].slice(0, 8);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {/* */}
}

function InvitationDetail() {
  const { card } = Route.useLoaderData() as { card: InvitationCard };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    pushRecent(card.code);
    // Auto-open the modal on deep link so the flow is one-click.
    const t = setTimeout(() => setOpen(true), 250);
    return () => clearTimeout(t);
  }, [card.code]);

  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-2" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/invitations" className="hover:text-primary">Invitations</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{card.name}</span>
        </nav>

        <Link to="/invitations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Gallery
        </Link>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-10">
          <div className="space-y-6">
            <CardCover card={card} className="shadow-gold-glow" />
            {card.videoUrl && (
              <div className="rounded-2xl overflow-hidden border border-gold-hairline bg-black">
                <video src={card.videoUrl} controls playsInline preload="metadata" className="w-full aspect-video object-cover" />
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-gold-hairline bg-card p-6 md:p-8 h-fit">
            <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-1">#{card.code}</div>
            <h1 className="font-display text-3xl md:text-4xl">{card.name}</h1>
            <p className="text-muted-foreground mt-3">{card.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 text-xs">
              <Meta icon={<Package className="h-3.5 w-3.5" />} label="Min Order" value={`${card.minOrder} cards`} />
              <Meta icon={<Clock className="h-3.5 w-3.5" />} label="Printing" value={card.printingDays} />
              <Meta icon={<Truck className="h-3.5 w-3.5" />} label="Delivery" value={card.deliveryAvailable ? formatINR(card.deliveryCharge) : "Pickup only"} />
              <Meta label="Theme" value={card.theme} />
              <Meta label="Language" value={card.language} />
              <Meta label="Orientation" value={card.orientation} />
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Starting from</div>
                <div className="font-display text-4xl text-gradient-gold">
                  {card.price === 0 ? "On request" : formatINR(card.price)}
                </div>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold-glow hover:scale-[1.02] transition"
              >
                <MessageCircle className="h-4 w-4" /> Order This Card
              </button>
            </div>

            {card.previews.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Preview</div>
                <div className="flex flex-wrap gap-2">
                  {card.previews.map((p) => (
                    <a
                      key={p.url + p.label}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-gold-hairline px-4 py-2 text-xs hover:bg-primary hover:text-primary-foreground transition"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <RelatedCards card={card} />
      </div>

      <OrderModal card={card} open={open} onOpenChange={setOpen} />
    </div>
  );
}

function Meta({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gold-hairline bg-background/40 px-3 py-2">
      <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  );
}

function RelatedCards({ card }: { card: InvitationCard }) {
  const related = INVITATION_CARDS.filter(
    (c) => c.code !== card.code && (c.category === card.category || c.theme === card.theme)
  ).slice(0, 4);
  if (related.length === 0) return null;
  return (
    <section className="mt-20">
      <h3 className="font-display text-2xl mb-5">Similar Designs</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {related.map((c) => (
          <Link
            key={c.code}
            to="/invitations/$code"
            params={{ code: c.code }}
            className="group rounded-2xl border border-gold-hairline bg-card overflow-hidden"
          >
            <CardCover card={c} className="transition-transform duration-500 group-hover:scale-[1.03]" />
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">#{c.code}</div>
              <div className="font-display text-lg mt-0.5">{c.name}</div>
              <div className="font-display text-base text-gradient-gold mt-1">
                {c.price === 0 ? "On request" : formatINR(c.price)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}