import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface CreditGaugeProps {
  score: number;
  maxScore?: number;
  className?: string;
}

export function CreditGauge({ score, maxScore = 1000, className }: CreditGaugeProps) {
  const percentage = Math.max(0, Math.min(1, score / maxScore));
  const circumference = Math.PI * 90;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <svg viewBox="0 0 220 130" className="h-36 w-full max-w-[240px] overflow-visible" aria-hidden="true">
        <path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none"
          stroke="color-mix(in oklab, var(--color-bayan-amber) 12%, white)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none"
          stroke="var(--color-bayan-amber)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
      <div className="-mt-14 text-center">
        <p className="display-heading text-6xl text-bayan-green-deep">{score}</p>
        <p className="text-sm text-muted-foreground">/ {maxScore}</p>
      </div>
    </div>
  );
}
