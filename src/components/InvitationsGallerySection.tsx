import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  Sparkles,
  Filter,
  ArrowLeft,
  Star,
  Clock,
  Truck,
  Package,
  Play,
  X,
} from "lucide-react";
import {
  INVITATION_CARDS,
  INVITATION_CATEGORIES,
  formatINR,
  type InvitationCard,
} from "@/lib/invitations";
import { OrderModal } from "@/components/OrderModal";

/**
 * Per-card background image. Key is the invitation card `code`.
 *
 * Leave blank to keep the current generated CardCover artwork. To use a
 * real photo later, just set the value to an imported asset or URL.
 *
 * Example (uncomment + import):
 *   // import royalCover from "@/assets/invitations/INV-001.jpg";
 *   "INV-001": royalCover,
 */
// Per-card override — key is the 4-digit `code` (e.g. "1001").
const CARD_BACKGROUNDS: Record<string, string> = {
  "1001": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80", // Royal Mandala
  "1002": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=900&q=80", // Ivory Heritage
  "1003": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80", // Peacock Court
  "1004": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80", // Cinematic Save-the-Date
  "1101": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80", // Champagne Toast
  "1102": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80", // Reception Reel (video)
  "1201": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80", // Diamond Vow
  "1301": "https://images.unsplash.com/photo-1601233748803-a8c2ad4c78d3?auto=format&fit=crop&w=900&q=80", // Marigold Glow
  "1401": "https://images.unsplash.com/photo-1610030006870-e83bdaba1e2b?auto=format&fit=crop&w=900&q=80", // Henna Garden
  "1501": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80", // Disco Sangeet
  "2001": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=80", // Confetti Pop
  "3701": "https://images.unsplash.com/photo-1604423043492-41303bfa8fbf?auto=format&fit=crop&w=900&q=80", // Diwali Diyas
};

// Category-level fallback images so no card ever renders without a background.
const CATEGORY_BACKGROUNDS: Record<string, string> = {
  wedding:      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  reception:    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80",
  engagement:   "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80",
  haldi:        "https://images.unsplash.com/photo-1601233748803-a8c2ad4c78d3?auto=format&fit=crop&w=900&q=80",
  mehendi:      "https://images.unsplash.com/photo-1610030006870-e83bdaba1e2b?auto=format&fit=crop&w=900&q=80",
  sangeet:      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
  birthday:     "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=80",
  anniversary:  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80",
  "baby-shower":"https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80",
  naming:       "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80",
  housewarming: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
  corporate:    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
  religious:    "https://images.unsplash.com/photo-1604423043492-41303bfa8fbf?auto=format&fit=crop&w=900&q=80",
  farewell:     "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80",
  welcome:      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
  school:       "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
  college:      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
  business:     "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
  festival:     "https://images.unsplash.com/photo-1604423043492-41303bfa8fbf?auto=format&fit=crop&w=900&q=80",
  custom:       "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
};

function cardBackground(card: InvitationCard): string {
  return (
    CARD_BACKGROUNDS[card.code] ||
    CATEGORY_BACKGROUNDS[card.category] ||
    CATEGORY_BACKGROUNDS.wedding
  );
}

const WISHLIST_KEY = "mysanyoga:wishlist";
const RECENT_KEY = "mysanyoga:recent-invitations";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}
function writeSet(key: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function InvitationsGallerySection({ embedded = false }: { embedded?: boolean }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [type, setType] = useState<"all" | "printed" | "digital">("all");
  const [tag, setTag] = useState<"all" | "popular" | "latest" | "trending">("all");
  const [theme, setTheme] = useState<string>("all");
  const [language, setLanguage] = useState<string>("all");
  const [color, setColor] = useState<string>("all");
  const [orientation, setOrientation] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [recent, setRecent] = useState<string[]>([]);
  const [orderCard, setOrderCard] = useState<InvitationCard | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    setWishlist(readSet(WISHLIST_KEY));
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      setRecent(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleWishlist = (code: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      writeSet(WISHLIST_KEY, next);
      return next;
    });
  };

  const themes = useMemo(
    () => Array.from(new Set(INVITATION_CARDS.map((c) => c.theme))).sort(),
    []
  );
  const languages = useMemo(
    () => Array.from(new Set(INVITATION_CARDS.map((c) => c.language))).sort(),
    []
  );
  const colors = useMemo(
    () => Array.from(new Set(INVITATION_CARDS.map((c) => c.cardColor))).sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INVITATION_CARDS.filter((c) => {
      if (activeCategory !== "all" && c.category !== activeCategory) return false;
      if (type !== "all" && c.type !== type) return false;
      if (tag !== "all" && !c.tags.includes(tag)) return false;
      if (theme !== "all" && c.theme !== theme) return false;
      if (language !== "all" && c.language !== language) return false;
      if (color !== "all" && c.cardColor !== color) return false;
      if (orientation !== "all" && c.orientation !== orientation) return false;
      if (c.price > maxPrice && c.price !== 0) return false;
      if (q) {
        const hay = `${c.name} ${c.category} ${c.theme} ${c.cardColor} ${c.code} ${c.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, activeCategory, type, tag, theme, language, color, orientation, maxPrice]);

  const popular = INVITATION_CARDS.filter((c) => c.tags.includes("popular")).slice(0, 4);
  const trending = INVITATION_CARDS.filter((c) => c.tags.includes("trending")).slice(0, 4);
  const recentCards = recent
    .map((code) => INVITATION_CARDS.find((c) => c.code === code))
    .filter(Boolean)
    .slice(0, 4) as InvitationCard[];

  return (
    <div className={embedded ? "" : "pt-24 pb-24"}>
      <div className="mx-auto max-w-7xl px-6">
        {!embedded && (
          <>
            <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-2" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-primary">Services</Link>
              <span>/</span>
              <Link to="/services/$category" params={{ category: "invitations" }} className="hover:text-primary">
                Invitations
              </Link>
              <span>/</span>
              <span className="text-foreground">Gallery</span>
            </nav>

            <Link
              to="/services/$category"
              params={{ category: "invitations" }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Invitations
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3 inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> Premium Card Gallery
              </div>
              <h1 className="font-display text-4xl md:text-6xl leading-tight">
                Invitations, crafted to <span className="italic text-gradient-gold">impress</span>
              </h1>
              <p className="mt-4 text-muted-foreground max-w-xl">
                Printed cards, digital reels and video invites for every celebration —
                instantly searchable, beautifully designed, ready to order on WhatsApp.
              </p>
            </motion.div>
          </>
        )}

        {/* Sticky search & filter */}
        <div className={`sticky top-20 z-30 ${embedded ? "" : "mt-10"}`}>
          <div className="rounded-3xl border border-gold-hairline bg-background/80 backdrop-blur-xl p-4 md:p-5 shadow-gold-glow">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, theme, code or category…"
                  className="w-full rounded-xl border border-gold-hairline bg-background/60 pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
                aria-controls="invite-filter-panel"
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs uppercase tracking-[0.2em] border transition ${
                  showFilters
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-gold-hairline text-foreground hover:border-primary/60"
                }`}
              >
                {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                {showFilters ? "Close" : "Filters"}
              </button>
            </div>

            {showFilters && (
              <motion.div
                id="invite-filter-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-2 mt-4">
                {(["all", "printed", "digital"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] border transition ${
                      type === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-gold-hairline text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "all" ? "All Types" : t}
                  </button>
                ))}
                {(["all", "popular", "latest", "trending"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] border transition ${
                      tag === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-gold-hairline text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
                </div>
                <div className="grid md:grid-cols-5 gap-3 mt-4">
              <FilterSelect label="Theme" value={theme} setValue={setTheme} options={themes} />
              <FilterSelect label="Language" value={language} setValue={setLanguage} options={languages} />
              <FilterSelect label="Card Color" value={color} setValue={setColor} options={colors} />
              <FilterSelect
                label="Orientation"
                value={orientation}
                setValue={setOrientation}
                options={["Portrait", "Landscape", "Square"]}
              />
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 inline-flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Max Price · {formatINR(maxPrice)}
                </div>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[oklch(0.78_0.13_80)]"
                />
              </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-8 -mx-2 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          <CategoryChip
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            icon="🎴"
            name="All"
          />
          {INVITATION_CATEGORIES.map((c) => (
            <CategoryChip
              key={c.slug}
              active={activeCategory === c.slug}
              onClick={() => setActiveCategory(c.slug)}
              icon={c.icon}
              name={c.name}
            />
          ))}
        </div>

        {recentCards.length > 0 && (
          <ShelfRow title="Recently Viewed" cards={recentCards} wishlist={wishlist} toggle={toggleWishlist} onOrder={setOrderCard} />
        )}

        <div className="mt-10">
          <div className="flex items-end justify-between mb-5">
            <h2 className="font-display text-2xl">
              {filtered.length} {filtered.length === 1 ? "design" : "designs"}{" "}
              {activeCategory !== "all" && `· ${INVITATION_CATEGORIES.find(c => c.slug === activeCategory)?.name}`}
            </h2>
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-gold-hairline bg-card/40 p-12 text-center text-muted-foreground">
              No designs match your filters. Try clearing one or two.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((card, i) => (
                <CardTile
                  key={card.code}
                  card={card}
                  index={i}
                  wished={wishlist.has(card.code)}
                  onToggle={() => toggleWishlist(card.code)}
                  onOrder={() => setOrderCard(card)}
                />
              ))}
            </div>
          )}
        </div>

        <ShelfRow title="Popular Cards" cards={popular} wishlist={wishlist} toggle={toggleWishlist} onOrder={setOrderCard} />
        <ShelfRow title="Trending Now" cards={trending} wishlist={wishlist} toggle={toggleWishlist} onOrder={setOrderCard} />
      </div>

      <OrderModal card={orderCard} open={!!orderCard} onOpenChange={(v) => !v && setOrderCard(null)} />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-gold-hairline bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
      >
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function CategoryChip({
  active,
  onClick,
  icon,
  name,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  name: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm transition whitespace-nowrap ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-gold-glow"
          : "border-gold-hairline text-muted-foreground hover:text-foreground hover:border-primary/50"
      }`}
    >
      <span>{icon}</span>
      <span>{name}</span>
    </button>
  );
}

function CardTile({
  card,
  index,
  wished,
  onToggle,
  onOrder,
}: {
  card: InvitationCard;
  index: number;
  wished: boolean;
  onToggle: () => void;
  onOrder: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="group relative rounded-3xl border border-gold-hairline bg-card overflow-hidden flex flex-col"
    >
      <Link
        to="/invitations/$code"
        params={{ code: card.code }}
        className="block relative overflow-hidden"
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <img
            src={cardBackground(card)}
            alt={card.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="text-[10px] uppercase tracking-[0.25em] text-primary/90">
              {card.theme}
            </div>
            {card.tags.includes("popular") && (
              <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-primary-foreground">
                Featured
              </span>
            )}
          </div>
          {card.type === "digital" && (
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="h-14 w-14 rounded-full bg-black/45 backdrop-blur-sm grid place-items-center ring-1 ring-primary/50">
                <Play className="h-6 w-6 text-primary fill-current" />
              </div>
            </div>
          )}
        </div>
      </Link>

      <button
        onClick={onToggle}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 z-10 h-9 w-9 rounded-full grid place-items-center backdrop-blur transition ${
          wished
            ? "bg-primary text-primary-foreground"
            : "bg-background/50 text-foreground hover:bg-background/80"
        }`}
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
      </button>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>#{card.code}</span>
          <span>{card.orientation}</span>
        </div>
        <div className="font-display text-lg leading-tight">{card.name}</div>
        <div className="text-xs text-muted-foreground line-clamp-2">{card.description}</div>

        <div className="mt-1 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">From</div>
            <div className="font-display text-xl text-gradient-gold">
              {card.price === 0 ? "On request" : formatINR(card.price)}
              {card.type === "printed" && card.price > 0 && (
                <span className="text-xs text-muted-foreground font-body"> /card</span>
              )}
            </div>
          </div>
          <div className="text-right text-[10px] text-muted-foreground space-y-0.5">
            <div className="inline-flex items-center gap-1"><Package className="h-3 w-3" /> Min {card.minOrder}</div>
            <div className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {card.printingDays}</div>
            <div className="inline-flex items-center gap-1"><Truck className="h-3 w-3" /> {card.deliveryAvailable ? `${formatINR(card.deliveryCharge)}` : "Pickup only"}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOrder}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:scale-[1.02] transition"
        >
          View & Order
        </button>
      </div>
    </motion.div>
  );
}

function ShelfRow({
  title,
  cards,
  wishlist,
  toggle,
  onOrder,
}: {
  title: string;
  cards: InvitationCard[];
  wishlist: Set<string>;
  toggle: (c: string) => void;
  onOrder: (c: InvitationCard) => void;
}) {
  if (cards.length === 0) return null;
  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-5">
        <Star className="h-4 w-4 text-primary" />
        <h3 className="font-display text-2xl">{title}</h3>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <CardTile
            key={`${title}-${c.code}`}
            card={c}
            index={i}
            wished={wishlist.has(c.code)}
            onToggle={() => toggle(c.code)}
            onOrder={() => onOrder(c)}
          />
        ))}
      </div>
    </section>
  );
}