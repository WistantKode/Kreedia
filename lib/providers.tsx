"use client";

import { SessionProvider } from "next-auth/react";
import { RainbowKitProviders } from "./rainbowkit/providers";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <RainbowKitProviders>{children}</RainbowKitProviders>
      </ThemeProvider>
    </SessionProvider>
  );
}
