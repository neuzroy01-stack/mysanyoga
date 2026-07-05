import { lazy, Suspense, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Lazy load the scene file
const Scene = lazy(() => import("./Vehicle3DScene"));

type Props = {
  vehicleName?: string;
};

export function Vehicle3DPreview({ vehicleName }: Props) {
  const [isClient, setIsClient] = useState(false);

  // This hook only runs in the browser, ensuring safe client-side execution
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative h-80 w-full rounded-3xl overflow-hidden border border-neutral-800 bg-[#060609] shadow-2xl transition-all duration-300">
      {/* Top HUD Display Details */}
      <div className="absolute top-4 left-5 z-10 flex flex-col gap-0.5 pointer-events-none">
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-sky-400">
          Interactive Pipeline
        </span>
        <span className="text-[12px] font-medium text-neutral-400">
          Simulated Fleet Preview
        </span>
      </div>
      
      <div className="absolute top-4 right-5 z-10 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950/80 backdrop-blur-md text-[11px] font-mono tracking-wider text-neutral-200">
        {vehicleName || "Luxury Edition"}
      </div>

      <Suspense
        fallback={
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-neutral-950 text-neutral-400">
            <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
            <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
              Initializing Engine Parameters…
            </div>
          </div>
        }
      >
        {/* ONLY render the 3D scene if we are safely verified inside a browser environment */}
        {isClient ? (
          <Scene vehicleName={vehicleName} />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-neutral-950 text-neutral-400">
            <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
            <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
              Preparing Server Components…
            </div>
          </div>
        )}
      </Suspense>

      {/* Bottom Aesthetic Shade Blending */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#060609] to-transparent pointer-events-none" />
    </div>
  );
}

export default Vehicle3DPreview;