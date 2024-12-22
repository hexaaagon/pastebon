"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

import { useIsMobile } from "@/lib/hooks/use-mobile";
import { Separator } from "./ui/separator";

export default function MobileNavbar() {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <nav className="flex items-center justify-between overflow-x-hidden border-b p-4 transition-[padding]">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <span>
          <Image
            src="/static/images/logo-text-light.png"
            alt="Pastebon Logo"
            width={90}
            height={23}
            priority
            className="hidden dark:block"
          />
          <Image
            src="/static/images/logo-text-dark.png"
            alt="Pastebon Logo"
            width={90}
            height={23}
            priority
            className="block dark:hidden"
          />
        </span>
      </div>
    </nav>
  );
}
