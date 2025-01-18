"use client";
import MonacoCodeEditor, {
  Monaco,
  type EditorProps,
} from "@monaco-editor/react";
import { type editor as MonacoEditor } from "monaco-editor";
import OneDarkPro from "@/lib/theme/onedarkpro.json";

import { useTheme } from "next-themes";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

import { Skeleton } from "@/components/ui/skeleton";

export function CodeEditor({
  code,
  setCode,
  language,
  onMount,
  options,
  navChildren,
  ...props
}: {
  code: string;
  setCode?: Dispatch<SetStateAction<string>>;
  navChildren?: React.ReactNode;
} & EditorProps) {
  const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor>();
  const [monaco, setMonaco] = useState<Monaco>();

  const { resolvedTheme } = useTheme();

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

  useEffect(() => {
    if (!monaco) return;
  }, [monaco, resolvedTheme]);

  return (
    <div className="space-y-4">
      <div className="max-h-screen overflow-hidden rounded-xl">
        <MonacoCodeEditor
          className="h-[calc(60vh)] max-w-full font-mono"
          language={language}
          theme={resolvedTheme === "dark" ? "OneDarkPro" : "light"}
          loading={<Skeleton className="h-[calc(60vh)] w-full" />}
          value={code}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("OneDarkPro", {
              base: "vs-dark",
              inherit: true,
              rules: [],
              ...OneDarkPro,
            });
          }}
          onChange={(str) => setCode && setCode(str || "")}
          onMount={(editor, monaco) => {
            setEditor(editor);
            setMonaco(monaco);

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onMount && onMount(editor, monaco);

            // Disable syntax errors
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
              {
                noSemanticValidation: true,
                noSyntaxValidation: true,
              },
            );
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
              {
                noSemanticValidation: true,
                noSyntaxValidation: true,
              },
            );
          }}
          options={{
            fontFamily: "geistMono",
            minimap: {
              enabled: false,
            },
            tabSize: 2,
            ...options,
          }}
          {...props}
        />
      </div>
      {navChildren}
    </div>
  );
}
