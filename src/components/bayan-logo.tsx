import { cn } from "@/lib/utils";
import logoLightAsset from "@/assets/bayan-logo-light.jpg.asset.json";
import logoDarkAsset from "@/assets/bayan-logo-dark.jpg.asset.json";

interface BayanLogoProps {
  className?: string;
  /** When true, render the variant tuned for dark backgrounds (sidebar). */
  inverse?: boolean;
  compact?: boolean;
  showTagline?: boolean;
}

export function BayanLogo({ className, inverse = false, compact = false, showTagline = true }: BayanLogoProps) {
  const src = inverse ? logoDarkAsset.url : logoLightAsset.url;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img
        src={src}
        alt="BAYAN"
        className={cn("w-auto select-none object-contain", compact ? "h-20" : "h-24")}
        draggable={false}
      />
      {showTagline && (
        <p className="mt-2 text-center text-xs italic text-bayan-gold-warm">
          {compact ? "Cognitive credit for Islamic banks" : "Clear credit for the underserved"}
        </p>
      )}
    </div>
  );
}
