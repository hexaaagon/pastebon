"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookCopy, Loader2 } from "lucide-react";

import { usePasteHistory } from "@/lib/storage/hooks";
import { PasteItem } from "@/components/paste-item";
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

export default function PasteHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const { pastes, deletePaste, refresh } = usePasteHistory();
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState<{
    action: () => void;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // listen for paste saved events
  useEffect(() => {
    const handlePasteSaved = () => refresh();
    window.addEventListener("pasteSaved", handlePasteSaved);
    return () => window.removeEventListener("pasteSaved", handlePasteSaved);
  }, [refresh]);

  const handleViewPaste = (url: string) => {
    router.push(url);
  };

  const handleDeletePaste = (pasteId: string) => {
    deletePaste(pasteId);
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
            Pastebon - Paste History
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
            <EmptyTitle>Loading Paste History...</EmptyTitle>
            <EmptyDescription>
              We're sorting out your pastes...
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : pastes.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookCopy />
            </EmptyMedia>
            <EmptyTitle>No pastes yet</EmptyTitle>
            <EmptyDescription>
              Your paste history will appear here. Create some pastes to see
              them listed.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookCopy className="size-5" />
              <CardTitle>Paste History</CardTitle>
              <Badge variant="secondary">{pastes.length}</Badge>
            </div>
            <CardDescription>
              All your created pastes are stored locally in your browser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pastes.map((paste) => (
                <PasteItem
                  key={paste.id}
                  paste={paste}
                  onView={handleViewPaste}
                  onDelete={(id) =>
                    setDeleteConfirmationDialog({
                      action: () => handleDeletePaste(id),
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
              paste from your browser history.
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
