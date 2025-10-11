"use client";
import { Clock, Code2, ExternalLink, FileText, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStoreState } from "easy-peasy";
import { CreateCodeEditor } from "@/components/create-code-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { store, type StoreType } from "@/lib/store";
import { languages } from "@/config/code";

export default function Landing() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const {
    drafts,
    deleteDraft,
    getDraftById,
    refresh: refreshDrafts,
  } = useDrafts();
  const { pastes, deletePaste } = usePasteHistory();
  const router = useRouter();
  const storeActions = store.getActions();
  const isEditingCode = useStoreState(
    (state: StoreType) => state.isEditingCode,
  );

  // state for confirmation dialogs
  const [showLoadDraftDialog, setShowLoadDraftDialog] = useState(false);
  const [showViewPasteDialog, setShowViewPasteDialog] = useState(false);
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState<{
    type: "draft" | "paste";
    action: () => void;
  } | null>(null);
  const [pendingDraftId, setPendingDraftId] = useState<string | null>(null);
  const [pendingPasteUrl, setPendingPasteUrl] = useState<string | null>(null);

  // listen for draft saved events to refresh the drafts list
  useEffect(() => {
    const handleDraftSaved = () => {
      refreshDrafts();
    };

    window.addEventListener("draftSaved", handleDraftSaved);
    return () => {
      window.removeEventListener("draftSaved", handleDraftSaved);
    };
  }, [refreshDrafts]);

  // load a draft into the editor
  const handleLoadDraft = (draftId: string) => {
    if (isEditingCode && code.trim().length > 0) {
      // show confirmation dialog if there are unsaved changes
      setPendingDraftId(draftId);
      setShowLoadDraftDialog(true);
    } else {
      // load directly if no unsaved changes
      loadDraft(draftId);
    }
  };

  const loadDraft = (draftId: string) => {
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
    if (isEditingCode && code.trim().length > 0) {
      // show confirmation dialog if there are unsaved changes
      setPendingPasteUrl(url);
      setShowViewPasteDialog(true);
    } else {
      // navigate directly if no unsaved changes
      router.push(url);
    }
  };

  // format timestamp to relative time
  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
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
      {drafts.length > 0 && (
        <Card className="mt-6">
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
              {drafts.slice(0, 5).map((draft) => (
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
                          {languages.find((l) => l[1] === language)?.[2]}
                        </span>
                        {languages.find((l) => l[1] === language)?.[0] ||
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
                          type: "paste",
                          action: () => deleteDraft(draft.id),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {drafts.length > 5 && (
                <p className="pt-2 text-center text-muted-foreground text-sm">
                  And {drafts.length - 5} more draft
                  {drafts.length - 5 > 1 ? "s" : ""}...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paste History Section */}
      {pastes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="size-5" />
                  Recent Pastes
                  <Badge variant="secondary">{pastes.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Your recently submitted pastes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pastes.slice(0, 5).map((paste) => (
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
                          {languages.find((l) => l[1] === language)?.[2]}
                        </span>
                        {languages.find((l) => l[1] === language)?.[0] ||
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
                          type: "paste",
                          action: () => deletePaste(paste.id),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {pastes.length > 5 && (
                <p className="pt-2 text-center text-muted-foreground text-sm">
                  And {pastes.length - 5} more paste
                  {pastes.length - 5 > 1 ? "s" : ""}...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
              Are you sure you want to permanently delete this{" "}
              {deleteConfirmationDialog?.type === "draft" ? "Draft" : ""}
              {deleteConfirmationDialog?.type === "paste" ? "Paste" : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmationDialog?.type === "draft" && (
                <>
                  This action cannot be undone. The draft will be permanently
                  removed from your device.
                </>
              )}
              {deleteConfirmationDialog?.type === "paste" && (
                <>
                  This action cannot be undone. The paste will be permanently
                  removed from your local history.
                  <br />
                  <br />
                  <strong>Note:</strong> The paste will still be accessible to
                  others and can be viewed online.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingPasteUrl(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteConfirmationDialog?.action();
                setShowViewPasteDialog(false);
                if (pendingPasteUrl) {
                  storeActions.setIsEditingCode(false);
                  router.push(pendingPasteUrl);
                  setPendingPasteUrl(null);
                }
              }}
            >
              Continue Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
