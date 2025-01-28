"use client";
import { useState, type Dispatch, type SetStateAction } from "react";
import { config } from "@/config/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UnsavedGateway } from "@/components/unsaved-gateway";

export function NavMain({
  clicked,
  setClicked,
}: {
  clicked: boolean;
  setClicked: Dispatch<SetStateAction<boolean>>;
}) {
  return config.main.map((nav) => (
    <SidebarGroup key={nav.title}>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          {nav.items.map((item) => (
            <UnsavedGateway
              key={item.title}
              clicked={clicked}
              setClicked={setClicked}
              sidebarMenuButtonProps={{ asChild: true, tooltip: item.title }}
              linkProps={{ href: item.href }}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </UnsavedGateway>
          ))}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  ));
}
