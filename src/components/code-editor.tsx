"use client";
import { languages, parser } from "@/config/code";
import MonacoCodeEditor, { type EditorProps } from "@monaco-editor/react";
import { type editor as MonacoEditor } from "monaco-editor";
import { format as prettierFormat } from "prettier/standalone";
import prettierPluginTypescript from "prettier/plugins/typescript";
import prettierPluginEstree from "prettier/plugins/estree";

import { useTheme } from "next-themes";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

import { SendHorizonal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postCodeAction } from "@/lib/actions/code";

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
    window.onbeforeunload = () => (code === "" ? null : true);

    return () => {
      window.onbeforeunload = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="max-h-screen overflow-hidden rounded-xl">
        <MonacoCodeEditor
          className="h-[calc(70vh)] max-w-full font-mono"
          language={language}
          theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
          loading={<Skeleton className="h-[calc(70vh)] w-full" />}
          value={code}
          onChange={(str) => setCode && setCode(str || "")}
          onMount={(editor, monaco) => {
            setEditor(editor);

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
            ...options,
          }}
          {...props}
        />
      </div>
      {navChildren}
    </div>
  );
}
