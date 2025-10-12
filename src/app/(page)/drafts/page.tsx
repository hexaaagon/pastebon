"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";

import { useDrafts } from "@/lib/storage/hooks";
import { store } from "@/lib/store";
import { DraftItem } from "@/components/draft-item";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function DraftsPage() {
  const [mounted, setMounted] = useState(false);
  const { drafts, getDraftById, deleteDraft, refresh } = useDrafts();
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState<{
    action: () => void;
  } | null>(null);
  const router = useRouter();
  const _storeActions = store.getActions();

  useEffect(() => {
    setMounted(true);
  }, []);

  // listen for draft saved events
  useEffect(() => {
    const handleDraftSaved = () => refresh();
    window.addEventListener("draftSaved", handleDraftSaved);
    return () => window.removeEventListener("draftSaved", handleDraftSaved);
  }, [refresh]);

  const handleLoadDraft = (draftId: string) => {
    const draft = getDraftById(draftId);
    if (draft) {
      // store the draft id in localStorage so the landing page can load it
      localStorage.setItem("loadDraftId", draftId);
      router.push("/");
    }
  };

  const handleDeleteDraft = (draftId: string) => {
    deleteDraft(draftId);
    setDeleteConfirmationDialog(null);
  };

  return (
    <main className="p-8 px-10">
      <header className="pb-4 leading-tight">
        <span className="flex items-center gap-2">
          <Image
            src="/static/images/logo-light.png"
            alt="Pastebon Logo"
            width={48}
            height={48}
            priority
            className="hidden size-6 items-center dark:block"
          />
          <Image
            src="/static/images/logo-dark.png"
            alt="Pastebon Logo"
            width={48}
            height={48}
            priority
            className="block size-6 items-center dark:hidden"
          />
          <p className="font-grotesque font-medium text-xl">
            Pastebon - Drafts
          </p>
        </span>
        <p className="text-sm">
          Paste your codes, logs, and errors{" "}
          <strong className="font-semibold underline">anonymously</strong>.
        </p>
      </header>
      {!mounted ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Loader2 className="animate-spin" />
            </EmptyMedia>
            <EmptyTitle>Loading Drafts...</EmptyTitle>
            <EmptyDescription>
              We're sorting out your drafts...
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : drafts.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No drafts yet</EmptyTitle>
            <EmptyDescription>
              Your saved drafts will appear here. Start creating some drafts to
              see them listed.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="size-5" />
              <CardTitle>Your Drafts</CardTitle>
              <Badge variant="secondary">{drafts.length}</Badge>
            </div>
            <CardDescription>
              All your saved drafts are stored locally in your browser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {drafts.map((draft) => (
                <DraftItem
                  key={draft.id}
                  draft={draft}
                  onLoad={handleLoadDraft}
                  onDelete={(id) =>
                    setDeleteConfirmationDialog({
                      action: () => handleDeleteDraft(id),
                    })
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmationDialog}
        onOpenChange={(open) => !open && setDeleteConfirmationDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              draft from your browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmationDialog?.action()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
