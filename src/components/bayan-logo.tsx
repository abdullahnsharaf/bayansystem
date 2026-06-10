import { cn } from "@/lib/utils";

interface BayanLogoProps {
  className?: string;
  inverse?: boolean;
  compact?: boolean;
  showTagline?: boolean;
}

export function BayanLogo({ className, inverse = false, compact = false, showTagline = true }: BayanLogoProps) {
  const primaryClass = inverse ? "text-primary-foreground" : "text-bayan-green-deep";
  const accentClass = inverse ? "text-bayan-gold-warm" : "text-bayan-gold-warm";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("font-arabic text-4xl leading-none", accentClass)} lang="ar" dir="rtl">
        بَيَان
      </div>
      <div className={cn("bayan-wordmark mt-1 text-4xl leading-none", primaryClass)}>BAYAN</div>
      {!compact && (
        <div className={cn("mt-2 h-px w-28", inverse ? "bg-bayan-gold-warm/40" : "bg-bayan-green-deep/25")} />
      )}
      {showTagline && (
        <p className={cn("mt-2 text-center text-xs italic", accentClass)}>
          {compact ? "Cognitive credit for Islamic banks" : "Clear credit for the underserved"}
        </p>
      )}
    </div>
  );
}
