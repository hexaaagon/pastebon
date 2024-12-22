"use client";
import { languages } from "@/config/code";
import MonacoCodeEditor from "@monaco-editor/react";
import { type editor as MonacoEditor } from "monaco-editor";
import { format as prettierFormat } from "prettier/standalone";
import prettierPluginTypescript from "prettier/plugins/typescript";
import prettierPluginEstree from "prettier/plugins/estree";

import { useTheme } from "next-themes";
import {
  type Dispatch,
  type SetStateAction,
  type HTMLProps,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CodeEditor({
  code,
  setCode,
  ...props
}: {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
} & HTMLProps<HTMLDivElement>) {
  const [formatLoading, setFormatLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("plaintext");
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

    window.onbeforeunload = () => (code === "" ? null : true);

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.onbeforeunload = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="space-y-4">
      <div className="max-h-screen overflow-hidden rounded-xl">
        <MonacoCodeEditor
          className="h-[calc(70vh)] max-w-full font-mono"
          language={language}
          theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
          loading={<Skeleton className="h-[calc(70vh)] w-full" />}
          value={code}
          onChange={(str) => setCode(str || "")}
          onMount={(editor, monaco) => {
            setEditor(editor);

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
          }}
        />
      </div>
      <div className="flex justify-between">
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
        </div>
      </div>
    </div>
  );
}
