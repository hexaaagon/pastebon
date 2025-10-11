"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStoreState } from "easy-peasy";
import { Clock, Code2, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

import { useDrafts } from "@/lib/storage/hooks";
import { store, type StoreType } from "@/lib/store";
import { languages } from "@/config/code";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface DraftsListProps {
  limit?: number;
  showEmpty?: boolean;
  onLoadDraft?: (draftId: string) => void;
}

export function DraftsList({
  limit,
  showEmpty = true,
  onLoadDraft,
}: DraftsListProps) {
  const { drafts, deleteDraft, getDraftById } = useDrafts();
  const router = useRouter();
  const storeActions = store.getActions();
  const isEditingCode = useStoreState(
    (state: StoreType) => state.isEditingCode,
  );

  const [showLoadDraftDialog, setShowLoadDraftDialog] = useState(false);
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState<{
    action: () => void;
  } | null>(null);
  const [pendingDraftId, setPendingDraftId] = useState<string | null>(null);

  const handleLoadDraft = (draftId: string) => {
    if (onLoadDraft) {
      onLoadDraft(draftId);
      return;
    }

    if (isEditingCode) {
      setPendingDraftId(draftId);
      setShowLoadDraftDialog(true);
    } else {
      loadDraft(draftId);
    }
  };

  const loadDraft = (draftId: string) => {
    const draft = getDraftById(draftId);
    if (draft) {
      storeActions.setIsEditingCode(false);
      router.push(`/?draft=${draftId}`);
    }
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const displayedDrafts = limit ? drafts.slice(0, limit) : drafts;
  const hasMore = limit && drafts.length > limit;

  if (drafts.length === 0 && showEmpty) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText className="size-8" />
          </EmptyMedia>
          <EmptyTitle>No Drafts Found</EmptyTitle>
          <EmptyDescription>
            You haven't saved any drafts yet. Create a new paste on the{" "}
            <Link href="/" className="text-primary hover:underline">
              home page
            </Link>{" "}
            and save it as a draft.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (drafts.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Your Drafts
                <Badge variant="secondary">{drafts.length}</Badge>
              </CardTitle>
              <CardDescription>
                Load or delete your saved drafts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayedDrafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
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
                      {languages.find((l) => l[1] === draft.language)?.[0] ||
                        "Text"}
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLoadDraft(draft.id)}
                  >
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      setDeleteConfirmationDialog({
                        action: () => deleteDraft(draft.id),
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            {hasMore && (
              <p className="pt-2 text-center text-muted-foreground text-sm">
                And {drafts.length - limit} more draft
                {drafts.length - limit > 1 ? "s" : ""}...{" "}
                <Link href="/drafts" className="text-primary hover:underline">
                  View all
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Load Draft Confirmation Dialog */}
      <AlertDialog
        open={showLoadDraftDialog}
        onOpenChange={setShowLoadDraftDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              Loading this draft will replace your current code. Any unsaved
              changes will be lost. Please save your code before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDraftId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDraftId) {
                  loadDraft(pendingDraftId);
                  setPendingDraftId(null);
                }
                setShowLoadDraftDialog(false);
              }}
            >
              Load Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmationDialog !== null}
        onOpenChange={
          deleteConfirmationDialog !== null
            ? () => setDeleteConfirmationDialog(null)
            : undefined
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to permanently delete this Draft?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The draft will be permanently
              removed from your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteConfirmationDialog?.action();
                setDeleteConfirmationDialog(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
