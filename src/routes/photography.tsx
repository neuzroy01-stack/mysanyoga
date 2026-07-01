
import { createFileRoute } from "@tanstack/react-router";
import { PhotographyHubSection } from "@/components/PhotographyHubSection";

export const Route = createFileRoute("/photography")({
  head: () => ({
    meta: [
      { title: "Photography & Film — MySanyoga" },
      {
        name: "description",
        content:
          "Wedding photography, cinematic films, pre-wedding shoots, drone & reels — packages starting ₹4,999. Browse services, pricing & book instantly.",
      },
      { property: "og:title", content: "Photography & Film — MySanyoga" },
      {
        property: "og:description",
        content:
          "Photo · Video · Cinematic · Drone · Reels · Album — premium wedding & event coverage.",
      },
    ],
  }),
  component: PhotographyHub,
});

function PhotographyHub() {
  return <PhotographyHubSection />;
}