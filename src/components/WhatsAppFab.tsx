import { waLink } from "@/lib/site";
import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a
      href={waLink("Hi My Sanyoga, I'd like to know more about your services.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.62_0.16_150)] text-white shadow-gold-glow transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[oklch(0.62_0.16_150)] opacity-30" />
    </a>
  );
}