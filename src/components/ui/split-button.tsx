"use client";

import * as React from "react";

import { ChevronDown } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

export function SplitButton({
  buttonChildren,
  className,
  dropdownChildren,
  disabled,
  options,
  ...props
}: {
  buttonChildren: React.ReactNode;
  className?: {
    main?: string;
    button?: string;
  };
  dropdownChildren: React.ReactNode;
  disabled?: boolean;
  options?: {
    Button?: Omit<ButtonProps, "className">;
    DropdownMenuContent?: DropdownMenuContentProps;
  };
} & Omit<React.HTMLProps<HTMLDivElement>, "className">) {
  return (
    <div
      className={cn(
        "flex items-center rounded-md bg-primary hover:bg-primary/90",
        disabled ? "opacity-50" : "",
        className?.main,
      )}
      {...props}
    >
      <Button
        className={cn("rounded-r-none", className?.button)}
        size="default"
        disabled={disabled}
        {...options?.Button}
      >
        {buttonChildren}
      </Button>
      <Separator orientation="vertical" className="h-[60%]" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-px rounded-l-none px-2" disabled={disabled}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px]"
          {...options?.DropdownMenuContent}
        >
          {dropdownChildren}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
