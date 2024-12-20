"use client";
import { config } from "@/config/navigation";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";

export function NavDocs() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Docs</SidebarGroupLabel>
      <SidebarMenu>
        {config.docs.map((nav) => (
          <Collapsible
            key={nav.title}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton key={nav.title} tooltip={nav.title}>
                  <span>{nav.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {nav.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={item.href}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// <SidebarMenuItem key={nav.title}>
//   {nav.items.map((item) => (
//     <SidebarMenuButton asChild key={item.title} tooltip={item.title}>
//       <Link href={item.href}>
//         {item.icon && <item.icon />}
//         <span>{item.title}</span>
//       </Link>
//     </SidebarMenuButton>
//   ))}
// </SidebarMenuItem>
