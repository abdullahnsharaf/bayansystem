import { cn } from "@/lib/utils";
import logoLight from "@/assets/bayan-logo-light.png";
import logoDark from "@/assets/bayan-logo-dark.png";

interface BayanLogoProps {
  className?: string;
  /** When true, render the variant tuned for dark backgrounds (sidebar). */
  inverse?: boolean;
  compact?: boolean;
  showTagline?: boolean;
}

export function BayanLogo({ className, inverse = false, compact = false, showTagline = true }: BayanLogoProps) {
  const src = inverse ? logoDark : logoLight;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img
        src={src}
        alt="BAYAN"
        className={cn("h-24 w-auto select-none", compact && "h-20")}
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
