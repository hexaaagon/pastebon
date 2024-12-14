"use client";

import { type ComponentProps, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "./ui/sonner";

export function ThemeProvider({ children }: ComponentProps<"div">) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster richColors expand />
    </NextThemesProvider>
  );
}
