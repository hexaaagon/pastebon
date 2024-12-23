"use client";
import { languages } from "@/config/code";
import { type editor as MonacoEditor } from "monaco-editor";
import { CodeEditor } from "./code-editor";
import { EditorProps } from "@monaco-editor/react";

import { useEffect, useState } from "react";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ViewCodeEditor({
  code,
  ...props
}: {
  code: string;
} & EditorProps) {
  const [language, setLanguage] = useState<string>();
  const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor>();

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

  return (
    <CodeEditor
      code={code}
      language={language || props.language}
      options={{
        readOnly: true,
        readOnlyMessage: {
          value:
            'Cannot edit this read-only paste.\n\nClick the "Edit" button below for editing this paste.',
        },
      }}
      onMount={(editor, monaco) => {
        setEditor(editor);
      }}
      navChildren={
        <div className="flex justify-between">
          {typeof editor === "undefined" ? (
            <Skeleton className="h-8 w-44" />
          ) : (
            <Select
              value={language || props.language}
              onValueChange={setLanguage}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => {
                  const langIcon = lang[2];

                  return (
                    <SelectItem key={lang[1]} value={lang[1]}>
                      <span className="flex items-center gap-2 truncate text-sm">
                        <span className="scale-75">{langIcon}</span> {lang[0]}
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
              </>
            ) : (
              <>
                <Button
                  onClick={async () => {}}
                  className="flex items-center gap-1"
                >
                  <Pencil size={16} className="size-2 sm:size-4" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>
      }
    />
  );
}
