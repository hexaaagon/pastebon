"use client";
import { Clock, Code2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { languages } from "@/config/code";
import type { SubmittedPaste } from "@/lib/storage/code-storage";
import { cn } from "@/lib/utils";

interface PasteItemProps {
  paste: SubmittedPaste;
  onView: (url: string) => void;
  onDelete: (pasteId: string) => void;
}

export function PasteItem({
  paste,
  onView,
  onDelete,
  className,
  ...attr
}: PasteItemProps & Omit<React.HTMLAttributes<HTMLDivElement>, "onView">) {
  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50",
        className,
      )}
      {...attr}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-muted-foreground" />
          <Link
            href={paste.url}
            className="font-medium text-primary text-sm hover:underline"
          >
            {paste.title || "Untitled Paste"}
          </Link>
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 text-xs"
          >
            <span className="-m-1 scale-50">
              {languages.find((l) => l[1] === paste.language)?.[2]}
            </span>
            {languages.find((l) => l[1] === paste.language)?.[0] || "Text"}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
          <Clock className="size-3" />
          <span>Created {formatTimeAgo(paste.createdAt)}</span>
          <span>•</span>
          <span>{paste.code.length} characters</span>
          {paste.expiresAt && (
            <>
              <span>•</span>
              <span>Expires {formatTimeAgo(paste.expiresAt)}</span>
            </>
          )}
        </div>
        <p className="mt-1 font-mono text-muted-foreground text-xs">
          {paste.pasteId}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onView(paste.url)}>
          View
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(paste.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
