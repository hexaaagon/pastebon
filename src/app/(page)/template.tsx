"use client";

import MobileNavbar from "@/components/mobile-navbar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar type="default" />
      <SidebarInset className="overflow-x-hidden">
        <MobileNavbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
