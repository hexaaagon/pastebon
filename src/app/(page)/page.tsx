"use client";
import { type editor as MonacoEditor } from "monaco-editor";
import { format as prettierFormat } from "prettier/standalone";
import prettierPluginTypescript from "prettier/plugins/typescript";
import prettierPluginEstree from "prettier/plugins/estree";

import { useTheme } from "next-themes";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Landing() {
  const [code, setCode] = useState("");
  const [formatLoading, setFormatLoading] = useState<boolean>(false);
  const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor>();
  const { resolvedTheme } = useTheme();

  function formatCode(force = false): any {
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
    let startTime = Date.now();

    prettierFormat(code, {
      parser: "typescript",
      plugins: [prettierPluginEstree, prettierPluginTypescript],
    })
      .then((str) => {
        setCode(str);

        let endTime = Date.now();

        setFormatLoading(false);
        toast.success(`Formatted Successfully (${endTime - startTime}ms)`);
      })
      .catch((e) => {
        let endTime = Date.now();

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
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;

      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        formatCode(true);
      } else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        formatCode();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return <main className="max-h-screen overflow-hidden p-6 px-8"></main>;
}

// <CodeEditor
//   className="h-[calc(100vh-4rem-1px)] font-mono"
//   language="javascript"
//   theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
//   loading={<Skeleton className="h-[calc(100vh-4rem-1px)] w-screen" />}
//   value={code}
//   onChange={(str) => setCode(str || "")}
//   onMount={(editor, monaco) => {
//     setEditor(editor);
//   }}
//   options={{
//     fontFamily: "geistMono",
//   }}
// />
