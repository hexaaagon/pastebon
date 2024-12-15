"use client";
import { ToggleTheme } from "@/components/ToggleTheme";
import { Button } from "@/components/ui/button";

import CodeEditor from "@monaco-editor/react";
import { type editor as MonacoEditor } from "monaco-editor";
import { format as prettierFormat } from "prettier/standalone";
import prettierPluginTypescript from "prettier/plugins/typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";

import { useTheme } from "next-themes";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Landing() {
  const [code, setCode] = useState("");
  const [formatLoading, setFormatLoading] = useState<boolean>(false);
  const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor>();
  const { resolvedTheme } = useTheme();

  function formatCode(force = false): any {
    if (code.split("").length > 1000000 && !force)
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
  }, [code]);

  return (
    <main className="max-h-screen overflow-hidden">
      <nav className="flex h-12 w-screen items-center justify-between border-b p-8 px-6 transition-[padding] sm:px-8 md:px-12">
        <span>
          <Image
            src="/static/images/logo-text-light.png"
            alt="Pastebon Logo"
            width={120}
            height={30}
            priority
            className="hidden h-auto w-auto dark:block"
          />
          <Image
            src="/static/images/logo-text-dark.png"
            alt="Pastebon Logo"
            width={120}
            height={30}
            priority
            className="block h-auto w-auto dark:hidden"
          />
        </span>
        <div className="flex items-center gap-1">
          {typeof editor === "undefined" ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <Button
              onClick={() => formatCode()}
              className="flex items-center gap-1"
              disabled={formatLoading}
            >
              <Sparkles size={16} className="size-2 sm:size-4" />
              Format
            </Button>
          )}
          <ToggleTheme size={16} className="size-2 sm:size-4" />
        </div>
      </nav>
      <CodeEditor
        className="h-[calc(100vh-4rem-1px)] font-mono"
        language="javascript"
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        loading={<Skeleton className="h-[calc(100vh-4rem-1px)] w-screen" />}
        value={code}
        onChange={(str) => setCode(str || "")}
        onMount={(editor, monaco) => {
          setEditor(editor);
        }}
        options={{
          fontFamily: "geistMono",
        }}
      />
    </main>
  );
}
