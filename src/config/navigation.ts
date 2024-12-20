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
      href: "",
      items: [
        {
          title: "Paste",
          items: [],
          href: "/",
          icon: ScrollText,
        },
        {
          title: "Docs",
          items: [],
          href: "/docs",
          icon: BookOpen,
        },
      ],
    },
  ],
  docs: [
    {
      title: "Getting Started",
      href: "",
      items: [
        {
          title: "Introduction",
          items: [],
          href: "/docs",
        },
      ],
    },
  ],
};
