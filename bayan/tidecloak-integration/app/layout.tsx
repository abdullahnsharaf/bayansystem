import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TideCloakProvider } from "@tidecloak/nextjs";
import { tcConfig, isConfigured } from "@/lib/config";
import { DemoAuthProvider } from "@/components/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "BAYAN - Breach-resilient Islamic micro-financing",
  description: "Shariah-compliant credit for gig workers, secured by TideCloak.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {isConfigured ? <TideCloakProvider config={tcConfig}>{children}</TideCloakProvider> : <DemoAuthProvider>{children}</DemoAuthProvider>}
      </body>
    </html>
  );
}
