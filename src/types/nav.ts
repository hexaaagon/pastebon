import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

export interface NavItem {
  title: string;
  items: NavItem[];
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem {
  title: string;
  href: string;
  items: NavItem[];
}

export interface DocsNavItem extends MainNavItem {}
