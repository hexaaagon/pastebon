"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ExternalLink } from "lucide-react";
import { CreateCodeEditor } from "@/components/create-code-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DraftItem } from "@/components/draft-item";
import { PasteItem } from "@/components/paste-item";
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
import { useDrafts, usePasteHistory } from "@/lib/storage/hooks";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landing() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const {
    drafts,
    getDraftById,
    deleteDraft,
    refresh: refreshDrafts,
  } = useDrafts();
  const { pastes, deletePaste, refresh: refreshPastes } = usePasteHistory();
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState<{
    action: () => void;
  } | null>(null);
  const router = useRouter();
  const storeActions = store.getActions();

  // Listen for draft and paste saved events
  useEffect(() => {
    const handleDraftSaved = () => refreshDrafts();
    const handlePasteSaved = () => refreshPastes();

    window.addEventListener("draftSaved", handleDraftSaved);
    window.addEventListener("pasteSaved", handlePasteSaved);

    return () => {
      window.removeEventListener("draftSaved", handleDraftSaved);
      window.removeEventListener("pasteSaved", handlePasteSaved);
    };
  }, [refreshDrafts, refreshPastes]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we do want this to run only once on mount
  useEffect(() => {
    const loadDraftId = localStorage.getItem("loadDraftId");
    if (loadDraftId) {
      localStorage.removeItem("loadDraftId");
      handleLoadDraft(loadDraftId);
    }
  }, []);

  const handleLoadDraft = (draftId: string) => {
    const draft = getDraftById(draftId);
    if (draft) {
      setCode(draft.code);
      setLanguage(draft.language);
      setCurrentDraftId(draftId);
      storeActions.setIsEditingCode(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleViewPaste = (url: string) => {
    router.push(url);
  };

  const handleDeleteDraft = (draftId: string) => {
    deleteDraft(draftId);
    if (currentDraftId === draftId) {
      setCurrentDraftId(null);
      setCode("");
      setLanguage("plaintext");
    }
    setDeleteConfirmationDialog(null);
  };

  const handleDeletePaste = (pasteId: string) => {
    deletePaste(pasteId);
    setDeleteConfirmationDialog(null);
  };

  const recentDrafts = drafts.length > 5 ? drafts.slice(0, 6) : drafts;
  const recentPastes = pastes.length > 5 ? pastes.slice(0, 6) : pastes;

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
          <p className="font-grotesque font-medium text-xl">Pastebon</p>
        </span>
        <p className="text-sm">
          Paste your codes, logs, and errors{" "}
          <strong className="font-semibold underline">anonymously</strong>.
        </p>
      </header>

      {/* Main Editor */}
      <Card>
        <CreateCodeEditor
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          currentDraftId={currentDraftId}
          onDraftSaved={() => {
            refreshDrafts();
            setCurrentDraftId(null);
          }}
          onDraftUpdated={() => {
            refreshDrafts();
          }}
        />
      </Card>

      {/* Drafts Section */}
      {recentDrafts.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="size-5" />
                <CardTitle>Recent Drafts</CardTitle>
                <Badge variant="secondary">{drafts.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentDrafts.map((draft, idx) => (
                  <div key={draft.id} className="relative">
                    <DraftItem
                      draft={draft}
                      onLoad={handleLoadDraft}
                      onDelete={(id) =>
                        setDeleteConfirmationDialog({
                          action: () => handleDeleteDraft(id),
                        })
                      }
                      className={
                        idx === 5 ? "pointer-events-none mb-12 opacity-50" : ""
                      }
                    />
                    {idx === 5 && (
                      <div className="-top-8 pointer-events-none absolute flex h-[230%] w-full flex-col items-center justify-end gap-2 bg-gradient-to-b from-background/0 via-background/70 to-background pb-4">
                        <p>
                          and {drafts.length - 5} more draft
                          {drafts.length - 5 > 1 ? "s" : ""} not shown.
                        </p>
                        <Button
                          variant="outline"
                          className="pointer-events-auto"
                          asChild
                        >
                          <Link href="/drafts">View More</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Paste History Section */}
      {recentPastes.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="size-5" />
                <CardTitle>Recent Pastes</CardTitle>
                <Badge variant="secondary">{pastes.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentPastes.map((paste, idx) => (
                  <div key={paste.id} className="relative">
                    <PasteItem
                      key={paste.id}
                      paste={paste}
                      onView={handleViewPaste}
                      onDelete={(id) =>
                        setDeleteConfirmationDialog({
                          action: () => handleDeletePaste(id),
                        })
                      }
                      className={
                        idx === 5 ? "pointer-events-none mb-12 opacity-50" : ""
                      }
                    />
                    {idx === 5 && (
                      <div className="-top-16 pointer-events-none absolute flex h-[230%] w-full flex-col items-center justify-end gap-2 bg-gradient-to-b from-background/0 via-background/70 to-background pb-4">
                        <p>
                          and {pastes.length - 5} more paste
                          {pastes.length - 5 > 1 ? "s" : ""} not shown.
                        </p>
                        <Button
                          variant="outline"
                          className="pointer-events-auto"
                          asChild
                        >
                          <Link href="/pastes">View More</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
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
              item.
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
