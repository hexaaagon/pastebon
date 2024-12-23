"use client";
import { languages, parser } from "@/config/code";
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
  useActionState,
} from "react";
import { toast } from "sonner";
import useSWR from "swr";

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
import { CodeEditor } from "./code-editor";

export function CreateCodeEditor({
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
    prettierFormat(
      code,
      parser()[language]
        ? parser()[language]
        : {
            parser: language,
          },
    )
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
    <CodeEditor
      code={code}
      setCode={setCode}
      language={language}
      onMount={(editor, monaco) => {
        setEditor(editor);
      }}
      navChildren={
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
              <>
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </>
            ) : (
              <>
                <Button
                  onClick={() => formatCode()}
                  className="flex items-center gap-1"
                  disabled={formatLoading}
                >
                  <Sparkles size={16} className="size-2 sm:size-4" />
                  Format
                </Button>
                <Button
                  onClick={async () => {
                    const formData = new FormData();
                    formData.append("code", code);
                    const action = await postCodeAction(formData);
                  }}
                  className="flex items-center gap-1"
                  disabled={formatLoading || code === ""}
                >
                  <SendHorizonal size={16} className="size-2 sm:size-4" />
                  Post
                </Button>
              </>
            )}
          </div>
        </div>
      }
    />
  );
}
