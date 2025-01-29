"use client";
import Link, { LinkProps } from "next/link";
import type React from "react";
import { toast } from "sonner";

import { StoreType, store } from "@/lib/store";
import { useStoreState } from "easy-peasy";
import { SidebarMenuButton } from "./ui/sidebar";

export function UnsavedGateway({
  children,
  clicked,
  setClicked,

  sidebarMenuButtonProps,
  buttonProps,
  linkProps,
}: {
  children: React.ReactNode;
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;

  sidebarMenuButtonProps?: React.ComponentProps<typeof SidebarMenuButton>;
  buttonProps?: Omit<React.ComponentProps<"button">, "onClick">;
  linkProps: Omit<LinkProps, "onClick">;
}) {
  const storeActions = store.getActions();
  const isEditingCode = useStoreState(
    (state: StoreType) => state.isEditingCode,
  );

  return (
    <SidebarMenuButton {...sidebarMenuButtonProps}>
      {isEditingCode && !clicked ? (
        <button
          onClick={() => {
            toast.warning(
              "You have unsaved changes. Please save your code before leaving.",
              {
                description: "You can click again to proceed.",
              },
            );
            setClicked(true);
          }}
          {...buttonProps}
        >
          {children}
        </button>
      ) : (
        <Link
          onClick={() => {
            storeActions.setIsEditingCode(false);
          }}
          {...linkProps}
        >
          {children}
        </Link>
      )}
    </SidebarMenuButton>
  );
}
