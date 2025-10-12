"use client";
import { Clock, Code2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { languages } from "@/config/code";
import type { CodeDraft } from "@/lib/storage/code-storage";
import { cn } from "@/lib/utils";

interface DraftItemProps {
  draft: CodeDraft;
  onLoad: (draftId: string) => void;
  onDelete: (draftId: string) => void;
}

export function DraftItem({
  draft,
  onLoad,
  onDelete,
  className,
  ...attr
}: DraftItemProps & Omit<React.HTMLAttributes<HTMLDivElement>, "onLoad">) {
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
          <p className="font-medium text-sm">
            {draft.title || "Untitled Draft"}
          </p>
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 text-xs"
          >
            <span className="-m-1 scale-50">
              {languages.find((l) => l[1] === draft.language)?.[2]}
            </span>
            {languages.find((l) => l[1] === draft.language)?.[0] || "Text"}
          </Badge>
          {draft.autoSaved && (
            <Badge variant="secondary" className="text-xs">
              Auto-saved
            </Badge>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
          <Clock className="size-3" />
          <span>Updated {formatTimeAgo(draft.updatedAt)}</span>
          <span>•</span>
          <span>{draft.code.length} characters</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onLoad(draft.id)}>
          Load
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(draft.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
