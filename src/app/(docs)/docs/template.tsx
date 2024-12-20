import MobileNavbar from "@/components/mobile-navbar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DocsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar type="docs" />
      <SidebarInset>
        <MobileNavbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
