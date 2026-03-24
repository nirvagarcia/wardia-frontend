"use client";

/**
 * Theme Provider Component
 * Wraps the app with next-themes provider for seamless theme switching.
 */

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="wardia-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
