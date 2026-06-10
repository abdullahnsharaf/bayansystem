import { motion } from "framer-motion";

import type { ShapFactor } from "@/lib/types";

export function ShapBars({ factors }: { factors: ShapFactor[] }) {
  const maxMagnitude = Math.max(...factors.map((factor) => Math.abs(factor.shap)), 1);

  return (
    <div className="space-y-4">
      {factors.map((factor, index) => {
        const width = `${(Math.abs(factor.shap) / maxMagnitude) * 46}%`;
        const positive = factor.shap > 0;

        return (
          <div key={factor.feature} className="grid gap-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">{factor.feature}</p>
                <p className="text-xs text-muted-foreground">{factor.value}</p>
              </div>
              <p className="font-mono text-xs text-muted-foreground">{factor.shap > 0 ? "+" : ""}{factor.shap.toFixed(2)}</p>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-muted">
              <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                className={positive ? "absolute left-1/2 top-0 h-full rounded-r-full bg-danger" : "absolute right-1/2 top-0 h-full rounded-l-full bg-success"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
