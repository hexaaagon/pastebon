import { MainNavItem, DocsNavItem } from "@/types/nav";
import { BookOpen, ScrollText } from "lucide-react";

export interface NavConfig {
  main: MainNavItem[];
  docs: DocsNavItem[];
}

export const config: NavConfig = {
  main: [
    {
      title: "Menu",
      items: [
        {
          title: "Paste",
          href: "/",
          icon: ScrollText,
        },
        {
          title: "Docs",
          href: "/docs",
          icon: BookOpen,
        },
      ],
    },
  ],
  docs: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
      ],
    },
  ],
};
