import { cn } from "@/lib/utils";
import logoImage from "@/assets/bayan-logo.png";

interface BayanLogoProps {
  className?: string;
  inverse?: boolean;
  compact?: boolean;
  showTagline?: boolean;
}

export function BayanLogo({ className, inverse = false, compact = false, showTagline = true }: BayanLogoProps) {
  const accentClass = "text-bayan-gold-warm";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img
        src={logoImage}
        alt="BAYAN"
        className={cn("h-24 w-auto select-none", compact && "h-20")}
        draggable={false}
      />
      {showTagline && (
        <p className={cn("mt-2 text-center text-xs italic", accentClass, inverse && "text-bayan-gold-warm")}>
          {compact ? "Cognitive credit for Islamic banks" : "Clear credit for the underserved"}
        </p>
      )}
    </div>
  );
}
