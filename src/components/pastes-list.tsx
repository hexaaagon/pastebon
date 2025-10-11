"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStoreState } from "easy-peasy";
import { Clock, Code2, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

import { usePasteHistory } from "@/lib/storage/hooks";
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

interface PastesListProps {
  limit?: number;
  showEmpty?: boolean;
  onViewPaste?: (url: string) => void;
}

export function PastesList({
  limit,
  showEmpty = true,
  onViewPaste,
}: PastesListProps) {
  const { pastes, deletePaste } = usePasteHistory();
  const router = useRouter();
  const storeActions = store.getActions();
  const isEditingCode = useStoreState(
    (state: StoreType) => state.isEditingCode,
  );

  const [showViewPasteDialog, setShowViewPasteDialog] = useState(false);
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState<{
    action: () => void;
  } | null>(null);
  const [pendingPasteUrl, setPendingPasteUrl] = useState<string | null>(null);

  const handleViewPaste = (url: string) => {
    if (onViewPaste) {
      onViewPaste(url);
      return;
    }

    if (isEditingCode) {
      setPendingPasteUrl(url);
      setShowViewPasteDialog(true);
    } else {
      router.push(url);
    }
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const displayedPastes = limit ? pastes.slice(0, limit) : pastes;
  const hasMore = limit && pastes.length > limit;

  if (pastes.length === 0 && showEmpty) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ExternalLink className="size-8" />
          </EmptyMedia>
          <EmptyTitle>No Paste History</EmptyTitle>
          <EmptyDescription>
            You haven't created any pastes yet. Create a new paste on the{" "}
            <Link href="/" className="text-primary hover:underline">
              home page
            </Link>{" "}
            to get started.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (pastes.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="size-5" />
                Recent Pastes
                <Badge variant="secondary">{pastes.length}</Badge>
              </CardTitle>
              <CardDescription>Your recently submitted pastes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayedPastes.map((paste) => (
              <div
                key={paste.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Code2 className="size-4 text-muted-foreground" />
                    <Link
                      href={paste.url}
                      className="font-medium text-primary text-sm hover:underline"
                    >
                      {paste.pasteId}
                    </Link>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span className="-m-1 scale-50">
                        {languages.find((l) => l[1] === paste.language)?.[2]}
                      </span>
                      {languages.find((l) => l[1] === paste.language)?.[0] ||
                        "Text"}
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
                    Admin: {paste.adminPassword}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewPaste(paste.url)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      setDeleteConfirmationDialog({
                        action: () => deletePaste(paste.id),
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
                And {pastes.length - limit} more paste
                {pastes.length - limit > 1 ? "s" : ""}...{" "}
                <Link href="/pastes" className="text-primary hover:underline">
                  View all
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Paste Confirmation Dialog */}
      <AlertDialog
        open={showViewPasteDialog}
        onOpenChange={setShowViewPasteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved code in the editor. Please save your code before
              leaving. You can click again to proceed anyway.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingPasteUrl(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingPasteUrl) {
                  storeActions.setIsEditingCode(false);
                  router.push(pendingPasteUrl);
                  setPendingPasteUrl(null);
                }
                setShowViewPasteDialog(false);
              }}
            >
              Continue Anyway
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
              Are you sure you want to permanently delete this Paste?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The paste will be permanently
              removed from your local history.
              <br />
              <br />
              <strong>Note:</strong> The paste will still be accessible to
              others and can be viewed online.
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
