import type { ReactNode } from "react";

// Lightweight wrapper — heavy motion transitions hurt perceived perf on mobile.
// Use CSS fade-in instead of framer-motion for route-level mounts.
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="animate-in fade-in duration-200">{children}</div>;
}

