import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";

import Image, { type ImageProps } from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MDX({ components, ...props }: MDXRemoteProps) {
  return (
    <MDXRemote
      components={{
        // Next Components
        // eslint-disable-next-line jsx-a11y/alt-text
        Image: (props: ImageProps) => <Image {...props} />,

        // UI Components
        Accordion: (props: any) => <Accordion {...props} />,
        AccordionContent: (props: any) => <AccordionContent {...props} />,
        AccordionItem: (props: any) => <AccordionItem {...props} />,
        AccordionTrigger: (props: any) => <AccordionTrigger {...props} />,

        Avatar: (props: any) => <Avatar {...props} />,
        AvatarFallback: (props: any) => <AvatarFallback {...props} />,
        AvatarImage: (props: any) => <AvatarImage {...props} />,

        Breadcrumb: (props: any) => <Breadcrumb {...props} />,
        BreadcrumbItem: (props: any) => <BreadcrumbItem {...props} />,
        BreadcrumbLink: (props: any) => <BreadcrumbLink {...props} />,
        BreadcrumbList: (props: any) => <BreadcrumbList {...props} />,
        BreadcrumbPage: (props: any) => <BreadcrumbPage {...props} />,
        BreadcrumbSeparator: (props: any) => <BreadcrumbSeparator {...props} />,

        Button: (props: any) => <Button {...props} />,

        Card: (props: any) => <Card {...props} />,
        CardContent: (props: any) => <CardContent {...props} />,
        CardDescription: (props: any) => <CardDescription {...props} />,
        CardFooter: (props: any) => <CardFooter {...props} />,
        CardHeader: (props: any) => <CardHeader {...props} />,
        CardTitle: (props: any) => <CardTitle {...props} />,

        Collapsible: (props: any) => <Collapsible {...props} />,
        CollapsibleContent: (props: any) => <CollapsibleContent {...props} />,
        CollapsibleTrigger: (props: any) => <CollapsibleTrigger {...props} />,

        Dialog: (props: any) => <Dialog {...props} />,
        DialogContent: (props: any) => <DialogContent {...props} />,
        DialogDescription: (props: any) => <DialogDescription {...props} />,
        DialogHeader: (props: any) => <DialogHeader {...props} />,
        DialogTitle: (props: any) => <DialogTitle {...props} />,
        DialogTrigger: (props: any) => <DialogTrigger {...props} />,

        DropdownMenu: (props: any) => <DropdownMenu {...props} />,
        DropdownMenuContent: (props: any) => <DropdownMenuContent {...props} />,
        DropdownMenuItem: (props: any) => <DropdownMenuItem {...props} />,
        DropdownMenuLabel: (props: any) => <DropdownMenuLabel {...props} />,
        DropdownMenuSeparator: (props: any) => (
          <DropdownMenuSeparator {...props} />
        ),
        DropdownMenuTrigger: (props: any) => <DropdownMenuTrigger {...props} />,

        Input: (props: any) => <Input {...props} />,

        Select: (props: any) => <Select {...props} />,
        SelectContent: (props: any) => <SelectContent {...props} />,
        SelectItem: (props: any) => <SelectItem {...props} />,
        SelectTrigger: (props: any) => <SelectTrigger {...props} />,
        SelectValue: (props: any) => <SelectValue {...props} />,

        Separator: (props: any) => <Separator {...props} />,

        Sheet: (props: any) => <Sheet {...props} />,
        SheetContent: (props: any) => <SheetContent {...props} />,
        SheetDescription: (props: any) => <SheetDescription {...props} />,
        SheetHeader: (props: any) => <SheetHeader {...props} />,
        SheetTitle: (props: any) => <SheetTitle {...props} />,
        SheetTrigger: (props: any) => <SheetTrigger {...props} />,

        Skeleton: (props: any) => <Skeleton {...props} />,

        Textarea: (props: any) => <Textarea {...props} />,

        Tooltip: (props: any) => <Tooltip {...props} />,
        TooltipContent: (props: any) => <TooltipContent {...props} />,
        TooltipProvider: (props: any) => <TooltipProvider {...props} />,
        TooltipTrigger: (props: any) => <TooltipTrigger {...props} />,

        // Other Components
        ...components,
      }}
      {...props}
    />
  );
}
