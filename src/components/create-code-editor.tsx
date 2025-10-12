"use client";
import { SiJavascript, SiPython } from "@icons-pack/react-simple-icons";
import { Check, File, SendHorizonal, Sparkles } from "lucide-react";
import type { editor as MonacoEditor } from "monaco-editor";
import { useRouter } from "next/navigation";
import { format as prettierFormat } from "prettier/standalone";
import {
  type Dispatch,
  type HTMLProps,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { DoneDialog } from "@/components/done-dialog";
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
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SplitButton } from "@/components/ui/split-button";
import { Textarea } from "@/components/ui/textarea";
import { languages, parser } from "@/config/code";
import { postCodeAction } from "@/lib/actions/code";
import { codeStorage } from "@/lib/storage";
import { useAutoSave } from "@/lib/storage/hooks";
import { store } from "@/lib/store";
import { CodeEditor } from "./code-editor";

const DONT_SHOW_DRAFT_CONFIRM_KEY = "pastebon_dont_show_draft_confirm";

export function CreateCodeEditor({
  code,
  setCode,
  language: initialLanguage,
  setLanguage: setParentLanguage,
  currentDraftId,
  onDraftSaved,
  onDraftUpdated,
}: {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  language?: string;
  setLanguage?: Dispatch<SetStateAction<string>>;
  currentDraftId?: string | null;
  onDraftSaved?: () => void;
  onDraftUpdated?: () => void;
} & HTMLProps<HTMLDivElement>) {
  const [formatLoading, setFormatLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>(
    initialLanguage || "plaintext",
  );
  const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor>();
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [pendingAutoSave, setPendingAutoSave] = useState<{
    code: string;
    language: string;
  } | null>(null);

  // draft metadata states
  const [draftTitle, setDraftTitle] = useState<string>("");
  const [draftDescription, setDraftDescription] = useState<string>("");
  const [_isEditingDraft, setIsEditingDraft] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Use refs to avoid stale closure issues in event handlers
  const draftTitleRef = useRef<string>("");
  const draftDescriptionRef = useRef<string>("");

  // Keep refs in sync with state
  useEffect(() => {
    draftTitleRef.current = draftTitle;
  }, [draftTitle]);

  useEffect(() => {
    draftDescriptionRef.current = draftDescription;
  }, [draftDescription]);

  // local draft id tracking - separate from currentDraftId prop
  // this tracks the draft created during this session for updates
  // using ref to avoid closure issues in event handlers
  const localDraftIdRef = useRef<string | null>(null);

  const supportedLanguages = Object.keys(parser());

  const storeActions = store.getActions();

  const router = useRouter();

  // Track the last saved state to detect unsaved changes
  const lastSavedStateRef = useRef({ code: "", title: "", description: "" });

  // sync language with parent component
  useEffect(() => {
    if (setParentLanguage) {
      setParentLanguage(language);
    }
  }, [language, setParentLanguage]);

  // load draft metadata when editing a draft
  // only load once when currentDraftId changes from null to a value
  const hasLoadedDraftRef = useRef<string | null>(null);

  useEffect(() => {
    // Only load if:
    // 1. currentDraftId exists
    // 2. We haven't already loaded this draft
    // 3. There's no local draft (meaning we're loading from the list, not continuing an edit)
    if (
      currentDraftId &&
      hasLoadedDraftRef.current !== currentDraftId &&
      !localDraftIdRef.current
    ) {
      const draft = codeStorage.drafts.getById(currentDraftId);

      if (draft) {
        setDraftTitle(draft.title || "");
        setDraftDescription(draft.description || "");
        setIsEditingDraft(true);
        hasLoadedDraftRef.current = currentDraftId;
        // Clear localDraftId when loading a draft from the list
        localDraftIdRef.current = null;

        // Update last saved state
        lastSavedStateRef.current = {
          code: draft.code,
          title: draft.title || "",
          description: draft.description || "",
        };
        setHasUnsavedChanges(false);
      }
    }
    // note: we don't clear anything when currentDraftId becomes null
  }, [currentDraftId]);

  // Detect unsaved changes
  useEffect(() => {
    const hasChanges =
      code !== lastSavedStateRef.current.code ||
      draftTitle !== lastSavedStateRef.current.title ||
      draftDescription !== lastSavedStateRef.current.description;

    setHasUnsavedChanges(hasChanges);
  }, [code, draftTitle, draftDescription]);

  // enable auto-save
  const { getAutoSave } = useAutoSave(code, language, {
    enabled: true,
    intervalMs: 30000, // auto-save every 30 seconds
    minLength: 10,
    onAutoSaveStart: () => {
      toast.loading("Auto-saving your work...", {
        id: "auto-save",
        description: "Please don't close the browser",
      });
    },
    onAutoSaveComplete: () => {
      toast.success("Auto-saved successfully", {
        id: "auto-save",
        description: "Your work is safe",
        duration: 2000,
      });
    },
  }); // restore auto-save on mount

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run once on mount
  useEffect(() => {
    const autoSave = getAutoSave();
    if (autoSave && autoSave.code.trim().length > 0) {
      setPendingAutoSave({
        code: autoSave.code,
        language: autoSave.language,
      });
      setShowRestoreDialog(true);
    }
  }, []);

  function formatCode(force = false) {
    if (code.length > 1000000 && !force)
      return toast.warning("Are you sure?", {
        duration: 10000,
        description: "The code you've put is too long. (>1.000.000 chars)",
        action: {
          label: "Format anyway",
          onClick: () => formatCode(true),
        },
      });
    setFormatLoading(true);

    if (!supportedLanguages.includes(language)) {
      setFormatLoading(false);

      return toast.error("The language you pick is not supported.", {
        description: "Tips: Try changing the language on the Bottom Left.",
      });
    }

    const startTime = Date.now();
    prettierFormat(code, parser()[language].options)
      .then((str) => {
        setCode(str);
        const endTime = Date.now();
        setFormatLoading(false);
        toast.success(`Formatted Successfully (${endTime - startTime}ms)`);
      })
      .catch((e) => {
        const endTime = Date.now();
        setFormatLoading(false);
        toast.error("Error on Formatting", {
          description: `${
            e.cause?.loc?.line
              ? `There's an error in your code. (${e.cause.loc.line}:${e.cause.loc.column})`
              : `Format failed. ('${e.cause?.code || e}')`
          } (${endTime - startTime}ms)`,
          action: e.cause?.loc?.line
            ? {
                label: "Jump to Line",
                onClick: () => {
                  editor?.revealLine(e.cause.loc.line);
                },
              }
            : undefined,
        });
      });
  }

  useEffect(() => {
    if (!editor) return;

    function resizeEditor() {
      // @ts-expect-error
      editor.layout({});
    }

    window.addEventListener("resize", resizeEditor);
    return () => {
      window.removeEventListener("resize", resizeEditor);
    };
  }, [editor]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's not mandatory
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      // Ctrl+D for formatting code
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        formatCode();
      }
      // Ctrl+Shift+D for force formatting (large files)
      else if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        formatCode(true);
      }
      // Ctrl+S for saving draft
      else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveDraftAndNotify();
      }
    }

    if (code !== "") {
      storeActions.setIsEditingCode(true);
    } else {
      storeActions.setIsEditingCode(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    window.onbeforeunload = () => (code === "" ? null : true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.onbeforeunload = null;
    };
  }, [code, language]);

  const submitCode = async (lang: "dynamic" | string) => {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("language", lang === "dynamic" ? language : lang);

    // add title and description if provided
    if (draftTitle && draftTitle.trim().length > 0) {
      formData.append("title", draftTitle.trim());
    } else {
      formData.append(
        "title",
        `${languages.find((l) => l[1] === language)?.[0] || "Text"} Paste - ${new Date().toLocaleDateString()}`,
      );
    }
    if (draftDescription && draftDescription.trim().length > 0) {
      formData.append("description", draftDescription.trim());
    }

    toast.promise(postCodeAction(formData), {
      loading: "Submitting your Paste Code...",
      error: async (err) => {
        return `${err}`;
      },
      success: async (data) => {
        storeActions.setIsEditingCode(false);

        // save the submitted paste locally
        codeStorage.pastes.create({
          pasteId: data.id,
          code,
          language: lang === "dynamic" ? language : lang,
          title:
            draftTitle && draftTitle.trim().length > 0
              ? draftTitle.trim()
              : undefined,
          adminPassword: data.password,
        });

        // notify the page to refresh the pastes list
        window.dispatchEvent(new CustomEvent("pasteSaved"));

        // clear all drafts that match the submitted code
        const allDrafts = codeStorage.drafts.getAllSorted();
        const matchingDrafts = allDrafts.filter(
          (draft) =>
            draft.code === code &&
            draft.language === (lang === "dynamic" ? language : lang),
        );

        matchingDrafts.forEach((draft) => {
          codeStorage.drafts.deleteById(draft.id);
        });

        // if no exact match, at least clear the auto-save
        if (matchingDrafts.length === 0) {
          const autoSave = codeStorage.drafts.getAutoSave();
          if (autoSave) {
            codeStorage.drafts.deleteById(autoSave.id);
          }
        }

        // clear local draft tracking after submission
        localDraftIdRef.current = null;
        setDraftTitle("");
        setDraftDescription("");

        // notify the page to refresh the drafts list
        window.dispatchEvent(new CustomEvent("draftSaved"));

        router.push(`/paste/${data.id}`);

        return (
          <div className="space-y-2">
            <span className="flex items-center gap-2 font-medium text-sm">
              <Check size={18} /> Done!
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs" size="sm">
                  View Paste info
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DoneDialog id={data.id} password={data.password} />
              </DialogContent>
            </Dialog>
          </div>
        );
      },
      duration: 15000,
    });
  };

  const handleSaveDraftClick = () => {
    if (code.trim().length === 0) {
      toast.error("Cannot save empty draft");
      return;
    }

    // check if user has chosen to not show dialog again
    const dontShow = localStorage.getItem(DONT_SHOW_DRAFT_CONFIRM_KEY);
    if (dontShow === "true") {
      saveDraftAndNotify();
    } else {
      setShowDraftDialog(true);
    }
  };

  // save as draft manually with toast notification
  const saveDraftAndNotify = () => {
    // Use refs to get the latest values and avoid stale closure
    const currentTitle = draftTitleRef.current;
    const currentDescription = draftDescriptionRef.current;

    const wasEmpty = !currentTitle.trim();

    const finalTitle =
      currentTitle.trim() ||
      `${languages.find((l) => l[1] === language)?.[0] || "Text"} Paste - ${new Date().toLocaleDateString()}`;

    // determine which draft id to use:
    // 1. localDraftId - if we created a draft this session
    // 2. currentDraftId - if we're editing an existing draft from the list
    const draftIdToUpdate = localDraftIdRef.current || currentDraftId;

    if (draftIdToUpdate) {
      // update existing draft
      const updated = codeStorage.drafts.update(draftIdToUpdate, {
        code,
        language,
        title: finalTitle,
        description: currentDescription.trim(),
        autoSaved: false,
      });

      if (updated) {
        // Update local state with saved values to prevent reset
        if (wasEmpty) {
          setDraftTitle(finalTitle);
        }
        setDraftDescription(currentDescription.trim());

        // Update last saved state
        lastSavedStateRef.current = {
          code,
          title: wasEmpty ? finalTitle : currentTitle,
          description: currentDescription.trim(),
        };
        setHasUnsavedChanges(false);

        toast.success("Draft updated successfully!", {
          description: `Updated: ${updated.title}`,
        });

        onDraftUpdated?.();
        // Dispatch custom event for page.tsx to refresh drafts list
        window.dispatchEvent(new CustomEvent("draftSaved"));
      } else {
        toast.error("Failed to update draft", {
          description: "Check if localStorage is available",
        });
      }
    } else {
      // create new draft
      const draft = codeStorage.drafts.create({
        code,
        language,
        title: finalTitle,
        description: currentDescription.trim(),
        autoSaved: false,
      });

      if (draft) {
        // set localDraftId so next save updates this draft
        localDraftIdRef.current = draft.id;

        // update local state with saved values
        if (wasEmpty) {
          setDraftTitle(finalTitle);
        }
        setDraftDescription(currentDescription.trim());

        // Update last saved state
        lastSavedStateRef.current = {
          code,
          title: finalTitle,
          description: currentDescription.trim(),
        };
        setHasUnsavedChanges(false);

        toast.success("Draft saved successfully!", {
          description: `Saved as ${draft.title}`,
        });
        onDraftSaved?.();
        // Dispatch custom event for page.tsx to refresh drafts list
        window.dispatchEvent(new CustomEvent("draftSaved"));
      } else {
        toast.error("Failed to save draft", {
          description: "Check if localStorage is available",
        });
      }
    }
  };

  // Handle confirm in dialog
  const handleConfirmSave = () => {
    if (dontShowAgain) {
      localStorage.setItem(DONT_SHOW_DRAFT_CONFIRM_KEY, "true");
      toast.info("You won't see this confirmation again", {
        description: "You can clear this in browser settings",
      });
    }
    setShowDraftDialog(false);
    saveDraftAndNotify();
  };

  // Handle cancel in dialog
  const handleCancelSave = () => {
    if (dontShowAgain) {
      localStorage.setItem(DONT_SHOW_DRAFT_CONFIRM_KEY, "true");
      toast.info("Confirmation dismissed permanently", {
        description: "You can clear this in browser settings",
      });
    } else {
      toast.info("Draft not saved");
    }
    setShowDraftDialog(false);
    setDontShowAgain(false);
  };

  // Handle restore auto-save
  const handleRestoreAutoSave = () => {
    if (pendingAutoSave) {
      setCode(pendingAutoSave.code);
      setLanguage(pendingAutoSave.language);
      toast.success("Restored unsaved work", {
        description: "Your previous session has been recovered",
      });
    }
    setShowRestoreDialog(false);
    setPendingAutoSave(null);
  };

  // Handle discard auto-save
  const handleDiscardAutoSave = () => {
    setShowRestoreDialog(false);
    setPendingAutoSave(null);
    toast.info("Previous session discarded");
  };

  return (
    <>
      <CardHeader className="-space-y-2 pb-3">
        {/* Draft Metadata Section */}
        <CardTitle className="relative">
          <Input
            id="draft-title"
            placeholder="Untitled Paste"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            className="border-none px-0 font-semibold text-2xl focus-visible:ring-0 md:text-2xl"
          />
          {hasUnsavedChanges && (
            <span
              className="absolute top-0 right-0 text-2xl text-destructive"
              title="Unsaved changes"
            >
              *
            </span>
          )}
        </CardTitle>

        <CardDescription>
          <Textarea
            id="draft-description"
            placeholder="Add a description (optional)..."
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            className="min-h-[60px] resize-none border-none px-0 text-sm focus-visible:ring-0"
            rows={2}
          />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CodeEditor
          code={code}
          setCode={setCode}
          language={language}
          onMount={(editor, _monaco) => {
            setEditor(editor);
          }}
          navChildren={
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-0">
              {typeof editor === "undefined" ? (
                <Skeleton className="h-8 w-44" />
              ) : (
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => {
                      const langIcon = lang[2];

                      return (
                        <SelectItem key={lang[1]} value={lang[1]}>
                          <span className="flex items-center gap-2 truncate text-sm">
                            <span className="scale-75">{langIcon}</span>{" "}
                            {lang[0]}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
              <div className="flex gap-2">
                {typeof editor === "undefined" ? (
                  <>
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
                  </>
                ) : (
                  <>
                    {supportedLanguages.includes(language) && (
                      <Button
                        onClick={() => formatCode()}
                        className="flex items-center gap-2"
                        disabled={formatLoading}
                      >
                        <Sparkles size={16} className="size-2 sm:size-4" />
                        Format
                      </Button>
                    )}
                    <SplitButton
                      buttonChildren={
                        <>
                          <SendHorizonal
                            size={16}
                            className="size-2 sm:size-4"
                          />
                          Create Paste
                        </>
                      }
                      dropdownChildren={
                        <>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Create as ...
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-48">
                              <DropdownMenuItem
                                onClick={() => submitCode("dynamic")}
                              >
                                <File />
                                Plain Text
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => submitCode("javascript")}
                              >
                                <SiJavascript />
                                JavaScript
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => submitCode("python")}
                              >
                                <SiPython />
                                Python
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            onClick={handleSaveDraftClick}
                            disabled={code.trim().length === 0}
                          >
                            Save as Draft
                          </DropdownMenuItem>
                        </>
                      }
                      className={{
                        button: "flex items-center gap-2",
                      }}
                      disabled={formatLoading || code === ""}
                      options={{
                        DropdownMenuContent: {
                          side: "top",
                        },
                        Button: {
                          onClick: () => submitCode("dynamic"),
                        },
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          }
        />
      </CardContent>

      {/* Draft Save Confirmation Dialog */}
      <AlertDialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save as Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              This will save your code as a draft in your browser's local
              storage. You can access it later from the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Checkbox
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={(checked) =>
                setDontShowAgain(checked as boolean)
              }
            />
            <Label
              htmlFor="dont-show-again"
              className="cursor-pointer font-normal text-sm"
            >
              Don't show this confirmation again
            </Label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSave}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>
              Save Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Auto-Save Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Previous Session?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved work from a previous session. Would you like to
              restore it?
              {pendingAutoSave && (
                <span className="mt-2 block text-xs">
                  {pendingAutoSave.code.length} characters •{" "}
                  {pendingAutoSave.language}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardAutoSave}>
              Discard
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreAutoSave}>
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
