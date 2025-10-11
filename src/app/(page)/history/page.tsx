"use client";
import { useEffect, useState } from "react";
import { useDrafts } from "@/lib/storage/hooks";

export default function DraftsPage() {
  const { drafts } = useDrafts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  // Data structure for you to use in your custom UI
  const pageData = {
    drafts: drafts.map((draft) => ({
      id: draft.id,
      title: draft.title || "Untitled Draft",
      description: draft.description,
      code: draft.code,
      language: draft.language,
      autoSaved: draft.autoSaved,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
      codeLength: draft.code.length,
      // Actions available
      actions: {
        load: `loadDraft('${draft.id}')`,
        delete: `deleteDraft('${draft.id}')`,
      },
    })),
    stats: {
      totalDrafts: drafts.length,
      autoSavedDrafts: drafts.filter((d) => d.autoSaved).length,
      manualDrafts: drafts.filter((d) => !d.autoSaved).length,
    },
    // Helper functions you can reference
    helpers: {
      formatTimeAgo: `(timestamp) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return "just now";
        if (seconds < 3600) return \`\${Math.floor(seconds / 60)}m ago\`;
        if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h ago\`;
        return \`\${Math.floor(seconds / 86400)}d ago\`;
      }`,
      loadDraft: `(draftId) => {
        const draft = getDraftById(draftId);
        if (draft) {
          // Navigate to home with draft loaded
          router.push(\`/?draftId=\${draftId}\`);
        }
      }`,
    },
    availableActions: {
      deleteDraft: "deleteDraft(draftId) - Delete a draft",
      getDraftById: "getDraftById(draftId) - Get draft details",
      loadIntoEditor: "router.push('/') then load draft",
    },
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="mb-6 font-bold text-3xl">Drafts</h1>

      {/* 
        TODO: Replace this section with your custom UI
        The data structure below shows all available data for drafts
      */}
      <div className="space-y-6">
        <section>
          <h2 className="mb-4 font-semibold text-2xl">
            Available Data Structure
          </h2>
          <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
            {JSON.stringify(pageData, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl">Quick Reference</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Draft Properties:</strong> id, title, description, code,
              language, autoSaved, createdAt, updatedAt, codeLength
            </p>
            <p>
              <strong>Available Actions:</strong>
            </p>
            <ul className="ml-4 list-disc">
              <li>
                <code>deleteDraft(draftId)</code> - Delete a draft
              </li>
              <li>
                <code>getDraftById(draftId)</code> - Get draft details
              </li>
              <li>
                <code>router.push('/')</code> - Navigate to home to load draft
              </li>
            </ul>
            <p className="mt-4">
              <strong>Stats Available:</strong> totalDrafts, autoSavedDrafts,
              manualDrafts
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
