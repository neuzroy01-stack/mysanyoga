import { COVER_PALETTES, type InvitationCard } from "@/lib/invitations";

/**
 * Procedural premium cover for an invitation card.
 * Uses CSS gradients + typography so we avoid managing dozens of image files.
 */
export function CardCover({
  card,
  className = "",
  showCode = true,
}: {
  card: InvitationCard;
  className?: string;
  showCode?: boolean;
}) {
  const palette = COVER_PALETTES[card.cover] ?? COVER_PALETTES.royal;
  const aspect =
    card.orientation === "Landscape"
      ? "aspect-[4/3]"
      : card.orientation === "Square"
        ? "aspect-square"
        : "aspect-[3/4]";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${aspect} ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 30% 0%, ${palette.via} 0%, ${palette.from} 60%, ${palette.from} 100%)`,
        color: palette.ink,
      }}
    >
      {/* gold filigree corner accents */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 10% 10%, rgba(255,255,255,0.18), transparent 35%), radial-gradient(circle at 90% 90%, rgba(255,255,255,0.10), transparent 40%)",
        }}
      />
      <div
        className="absolute inset-3 rounded-xl border pointer-events-none"
        style={{ borderColor: card.accent, opacity: 0.55 }}
      />
      <div
        className="absolute inset-6 rounded-lg border pointer-events-none"
        style={{ borderColor: card.accent, opacity: 0.25 }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div
          className="text-[10px] uppercase tracking-[0.4em] mb-3"
          style={{ color: card.accent }}
        >
          MySanyoga
        </div>
        <div
          className="font-display text-2xl md:text-3xl leading-tight"
          style={{ color: palette.ink }}
        >
          {card.name}
        </div>
        <div
          className="mt-3 h-px w-12"
          style={{ background: card.accent, opacity: 0.8 }}
        />
        <div
          className="mt-3 text-[10px] uppercase tracking-[0.35em]"
          style={{ color: card.accent }}
        >
          {card.theme}
        </div>
      </div>

      <div
        className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] backdrop-blur"
        style={{
          background: "rgba(0,0,0,0.35)",
          color: card.accent,
          border: `1px solid ${card.accent}55`,
        }}
      >
        {card.type === "digital" ? "Digital" : "Printed"}
      </div>

      {showCode && (
        <div
          className="absolute bottom-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-widest backdrop-blur"
          style={{
            background: "rgba(0,0,0,0.45)",
            color: card.accent,
            border: `1px solid ${card.accent}55`,
          }}
        >
          #{card.code}
        </div>
      )}
    </div>
  );
}