"use client";

import { type ComponentProps, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "./ui/sonner";
import { StoreProvider } from "easy-peasy";
import { store } from "@/lib/store";

export function ThemeProvider({ children }: ComponentProps<"div">) {
  return (
    <StoreProvider store={store}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster richColors expand />
      </NextThemesProvider>
    </StoreProvider>
  );
}
