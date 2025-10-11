"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CreateCodeEditor } from "@/components/create-code-editor";
import { Card } from "@/components/ui/card";
import { DraftsList } from "@/components/drafts-list";
import { PastesList } from "@/components/pastes-list";
import { useDrafts } from "@/lib/storage/hooks";
import { store } from "@/lib/store";

export default function Landing() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const { getDraftById, refresh: refreshDrafts } = useDrafts();
  const storeActions = store.getActions();

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

  // Custom handler for loading drafts in the landing page
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
      <div className="mt-6">
        <DraftsList limit={5} showEmpty={false} onLoadDraft={handleLoadDraft} />
      </div>

      {/* Paste History Section */}
      <div className="mt-6">
        <PastesList limit={5} showEmpty={false} />
      </div>
    </main>
  );
}
