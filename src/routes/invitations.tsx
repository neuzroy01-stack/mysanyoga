import { createFileRoute } from "@tanstack/react-router";
import { InvitationsGallerySection } from "@/components/InvitationsGallerySection";

export const Route = createFileRoute("/invitations")({
  head: () => ({
    meta: [
      { title: "Premium Invitations — Printed & Digital | MySanyoga" },
      {
        name: "description",
        content:
          "Browse premium printed and digital invitation cards for weddings, birthdays, receptions, corporate and every event. Live search, smart filters, instant order.",
      },
      { property: "og:title", content: "Premium Invitations — MySanyoga" },
      {
        property: "og:description",
        content:
          "Wedding · Reception · Birthday · Corporate · Festival — premium printed & digital invitations.",
      },
    ],
  }),
  component: InvitationsPage,
});

function InvitationsPage() {
  return <InvitationsGallerySection />;
}