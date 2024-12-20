import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem {
  title: string;
  items: NavItem[];
}

export interface DocsNavItem extends MainNavItem {}
