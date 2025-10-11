import type { MainNavItem } from "@/types/nav";
import { BookCopy, BookDashed, BookOpen, ScrollText } from "lucide-react";

export interface NavConfig {
  main: MainNavItem[];
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
          title: "Drafts",
          items: [],
          href: "/drafts",
          icon: BookDashed,
        },
        {
          title: "Pastes",
          items: [],
          href: "/pastes",
          icon: BookCopy,
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
};
