"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Download, Hammer, Loader2, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ExportDataSchema } from "@/shared/validations/data-import";
import { downloadExportedData } from "@/lib/actions/data-export";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const [importMode, setImportMode] = useState<"merge" | "replace" | null>(
    null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);

  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [lastWarningImportOpen, setLastWarningImportOpen] =
    useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function importData() {
    if (!file || !importMode) return;

    const { importData } = await import("@/lib/actions/data-export");

    const result = importData(file, importMode);

    toast.promise(result, {
      loading: "Importing data...",
      success: (res) => {
        if (res.success) {
          setImportDialogOpen(false);
          setFile(null);
          setImportMode(null);
          return `Successfully imported ${res.draftsImported} drafts and ${res.pastesImported} pastes.`;
        } else {
          return `Failed to import data: ${res.error}`;
        }
      },
      error: (err) => `Error importing data: ${err.message}`,
    });
  }

  if (!mounted)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Loader2 className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>Loading settings page...</EmptyTitle>
          <EmptyDescription>
            Please wait while the settings page loads.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  return (
    <main className="relative space-y-4 px-8 py-6 lg:gap-10 lg:px-0 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0 max-w-2xl space-y-8">
        <header>
          <p className="font-semibold text-3xl">Settings</p>
        </header>
        <section className="space-x-1 space-y-3 *:w-full md:*:w-auto">
          <div>
            <p className="font-medium text-lg">Appearance</p>
            <p className="text-muted-foreground text-sm">
              Customize the appearance for this website.
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="h-fit w-fit"
            onClick={() => setTheme("light")}
          >
            <div
              className={`flex flex-col ${theme === "light" && "bg-secondary/80"}`}
            >
              <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] animate-pulse rounded-lg bg-[#ecedef]" />
                    <div className="h-2 w-[100px] animate-pulse rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] animate-pulse rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] animate-pulse rounded-lg bg-[#ecedef]" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                Light
              </span>
            </div>
          </Button>
          <Button
            asChild
            variant={"ghost"}
            onClick={() => setTheme("dark")}
            className="h-fit w-fit"
          >
            <div
              className={`flex flex-col ${theme === "dark" && "bg-secondary/60"}`}
            >
              <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-2 rounded-sm bg-neutral-950 p-2">
                  <div className="space-y-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                    <div className="h-2 w-[80px] animate-pulse rounded-lg bg-neutral-400" />
                    <div className="h-2 w-[100px] animate-pulse rounded-lg bg-neutral-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-neutral-400" />
                    <div className="h-2 w-[100px] animate-pulse rounded-lg bg-neutral-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-neutral-400" />
                    <div className="h-2 w-[100px] animate-pulse rounded-lg bg-neutral-400" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                Dark
              </span>
            </div>
          </Button>
          <Button
            asChild
            variant={"ghost"}
            onClick={() => setTheme("system")}
            className="h-fit w-fit"
          >
            <div
              className={`flex flex-col ${theme === "system" && "bg-secondary/60"}`}
            >
              <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-2 rounded-sm bg-neutral-300 p-2">
                  <div className="space-y-2 rounded-md bg-neutral-600 p-2 shadow-sm">
                    <div className="h-2 w-[80px] animate-pulse rounded-lg bg-neutral-400" />
                    <div className="h-2 w-[100px] animate-pulse rounded-lg bg-neutral-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-neutral-600 p-2 shadow-sm">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-neutral-400" />
                    <div className="h-2 w-[100px] animate-pulse rounded-lg bg-neutral-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-neutral-600 p-2 shadow-sm">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-neutral-400" />
                    <div className="h-2 w-[100px] animate-pulse rounded-lg bg-neutral-400" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                System
              </span>
            </div>
          </Button>
        </section>
        <section className="space-x-2 space-y-3 *:w-full md:*:w-auto">
          <div>
            <p className="font-medium text-lg">Export Data</p>
            <p className="text-muted-foreground text-sm">
              Import and Export your Local Storage data.
            </p>
          </div>
          <Button size="lg" onClick={() => setImportDialogOpen(true)}>
            <Upload /> Import Data
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => downloadExportedData()}
          >
            <Download />
            Export Data
          </Button>
        </section>
      </div>
      <Dialog
        open={importDialogOpen}
        onOpenChange={(open) => {
          setImportDialogOpen(open);
          if (!open) {
            setFile(null);
            setImportMode(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data Menu</DialogTitle>
            <DialogDescription>
              Import the Drafts and Paste History data from a previous export.
              You can choose to either replace all existing data or merge with
              it.
            </DialogDescription>
          </DialogHeader>
          <Select
            onValueChange={(value) =>
              setImportMode(value as "merge" | "replace")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Import Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="merge" className="flex gap-1">
                <div className="flex w-full items-center gap-2">
                  <Sparkles size={20} /> Merge
                </div>
              </SelectItem>
              <SelectItem value="replace">
                <div className="flex w-full items-center gap-2">
                  <Hammer size={20} /> Replace
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {importMode && (
            <div className="group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted border-dashed bg-background transition hover:border-accent">
              {!file && (
                <input
                  id="file-upload"
                  type="file"
                  accept=".json,application/json"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  tabIndex={-1}
                  onChange={async (e) => {
                    if ((e.target.files?.length || 0) > 1) {
                      toast.error("Please select only one file.");
                      return;
                    }

                    const selectedFile = e.target.files?.[0];
                    if (!selectedFile) return;

                    if (
                      selectedFile.type !== "application/json" &&
                      !selectedFile.name.toLowerCase().endsWith(".json")
                    ) {
                      toast.error("Only .json files are permitted.");
                      return;
                    }

                    const fileJson = await selectedFile
                      .text()
                      .then((text) => JSON.parse(text));

                    console.log(fileJson);

                    try {
                      ExportDataSchema.parse(fileJson);
                    } catch (_e) {
                      console.warn(_e);
                      return toast.error(
                        "The file is not valid Pastebon export data.",
                        {
                          description: "Check log console for details.",
                        },
                      );
                    }

                    setFile(selectedFile);
                  }}
                />
              )}
              <span className="pointer-events-none text-muted-foreground">
                {file ? (
                  <p>
                    Selected file:{" "}
                    <strong className="font-medium underline">
                      {file.name}
                    </strong>
                  </p>
                ) : (
                  <p>Drag or Click this to upload file</p>
                )}
              </span>
            </div>
          )}
          {importMode === "replace" && (
            <p className="text-muted-foreground text-xs">
              <strong className="font-medium">Warning:</strong> Replacing data
              will <strong className="font-medium">delete</strong> all your
              existing Drafts and Paste History and cannot be undone.
            </p>
          )}
          <DialogFooter className="flex items-center justify-end space-x-2">
            <Button
              variant="destructive"
              onClick={() => setFile(null)}
              disabled={!file}
            >
              Reset File
            </Button>
            <Button
              onClick={() => setLastWarningImportOpen(true)}
              disabled={!file}
            >
              {importMode === "merge" && "Merge"}
              {importMode === "replace" && "Replace"} Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={lastWarningImportOpen}
        onOpenChange={setLastWarningImportOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely lutely mukely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. We highly recommend you to export
              your data before proceeding.
            </DialogDescription>
            <DialogFooter className="flex items-center justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setLastWarningImportOpen(false);
                  setImportDialogOpen(false);
                  setFile(null);
                  setImportMode(null);
                }}
              >
                Nevermind, Cancel it
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setLastWarningImportOpen(false);
                  importData();
                }}
              >
                Yes, {importMode === "replace" && "Replace"}
                {importMode === "merge" && "Merge"} Data
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
