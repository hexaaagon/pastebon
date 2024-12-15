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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function Landing() {
  const [code, setCode] = useState("");
  const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor>();
  const { resolvedTheme } = useTheme();

  function formatCode() {
    prettierFormat(code, {
      parser: "typescript",
      plugins: [prettierPluginEstree, prettierPluginTypescript],
    })
      .then((str) => {
        setCode(str);
        toast.success("Formatted Successfully");
      })
      .catch((e) => {
        toast.error("Error on Formatting", {
          description:
            e.cause?.code === "BABEL_PARSER_SYNTAX_ERROR"
              ? `There's an error in your code. (${e.cause.loc.line}:${e.cause.loc.column})`
              : `Format failed. (${e.cause?.code || e})`,
          action:
            e.cause?.code === "BABEL_PARSER_SYNTAX_ERROR"
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
    function handleKeyDown(e: any) {
      if (e.ctrlKey && e.key === "s") {
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
    <main className="max-h-screen">
      <nav className="flex h-12 w-screen items-center justify-between border-b p-8 transition-[padding] md:px-12">
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
          <Button onClick={formatCode} className="flex items-center gap-1">
            <Sparkles />
            Format
          </Button>
          <ToggleTheme />
        </div>
      </nav>
      <CodeEditor
        className="h-[calc(100vh-4rem-1px)] font-mono"
        language="javascript"
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        loading={<>Lagi loading tod sabar</>}
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
