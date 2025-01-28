"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { BookOpen, ScrollText, Settings } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UnsavedGateway } from "@/components/unsaved-gateway";

const data = {
  navMain: [
    {
      name: "Paste",
      url: "/",
      icon: ScrollText,
    },
    {
      name: "Docs",
      url: "/docs",
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({
  type,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  type: "default" | "docs";
}) {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="mx-auto ml-1 flex aspect-square size-6 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src="/static/images/logo-light.png"
                    alt="Pastebon Logo"
                    width={100}
                    height={100}
                    priority
                    className="hidden h-auto w-auto items-center dark:block"
                  />
                  <Image
                    src="/static/images/logo-dark.png"
                    alt="Pastebon Logo"
                    width={100}
                    height={100}
                    priority
                    className="block h-auto w-auto items-center dark:hidden"
                  />
                </div>
                <div className="grid flex-1 text-left text-base leading-tight">
                  <span className="truncate font-grotesque font-medium">
                    Pastebon
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain clicked={clicked} setClicked={setClicked} />
      </SidebarContent>
      <SidebarFooter>
        <UnsavedGateway
          clicked={clicked}
          setClicked={setClicked}
          sidebarMenuButtonProps={{
            asChild: true,
            size: "sm",
            tooltip: "Settings",
          }}
          linkProps={{ href: "/settings" }}
        >
          <Settings />
          <span>Settings</span>
        </UnsavedGateway>
        <SidebarMenuButton asChild size="sm" tooltip="Open Sidebar">
          <SidebarTrigger size="sm" className="justify-start">
            Close Sidebar
          </SidebarTrigger>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
