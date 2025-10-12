"use client";

import { codeStorage } from "@/lib/storage/code-storage";
import type { ExportDataSchema } from "../../shared/validations/data-import";
import type z from "zod";

export type ExportData = z.output<typeof ExportDataSchema>;

/**
 * Export all drafts and paste history to a JSON file
 */
export function exportData(): Blob {
  const data = codeStorage.exportData();

  const exportData: ExportData = {
    version: "1.0.0",
    exportDate: Date.now(),
    drafts: data.drafts,
    pastes: data.pastes,
  };

  const json = JSON.stringify(exportData, null, 2);
  return new Blob([json], { type: "application/json" });
}

/**
 * Download exported data as a JSON file
 */
export function downloadExportedData(filename?: string): void {
  const blob = exportData();
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().split("T")[0];
  const finalFilename = filename || `pastebon-export-${timestamp}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON file
 */
export async function importData(
  file: File,
  mode: "merge" | "replace" = "merge",
): Promise<{
  success: boolean;
  draftsImported: number;
  pastesImported: number;
  error?: string;
}> {
  try {
    const text = await file.text();
    const data: ExportData = JSON.parse(text);

    // validate the data structure
    if (
      !data.version ||
      !Array.isArray(data.drafts) ||
      !Array.isArray(data.pastes)
    ) {
      return {
        success: false,
        draftsImported: 0,
        pastesImported: 0,
        error:
          "Invalid data format. Please ensure you're importing a valid Pastebon export file.",
      };
    }

    // get existing data counts for comparison
    const existingDraftsCount = codeStorage.drafts.count();
    const existingPastesCount = codeStorage.pastes.count();

    // if replace mode, clear existing data
    if (mode === "replace") {
      codeStorage.clearAll();
    }

    // if merge mode, filter out duplicates
    let draftsToImport = data.drafts;
    let pastesToImport = data.pastes;

    if (mode === "merge") {
      const existingDrafts = codeStorage.drafts.getAllSorted();
      const existingPastes = codeStorage.pastes.getAllSorted();

      const existingDraftIds = new Set(existingDrafts.map((d) => d.id));
      const existingPasteIds = new Set(existingPastes.map((p) => p.id));

      draftsToImport = data.drafts.filter((d) => !existingDraftIds.has(d.id));
      pastesToImport = data.pastes.filter((p) => !existingPasteIds.has(p.id));
    }

    // import the data
    const success = codeStorage.importData({
      drafts: mode === "replace" ? data.drafts : draftsToImport,
      pastes: mode === "replace" ? data.pastes : pastesToImport,
    });

    if (!success) {
      return {
        success: false,
        draftsImported: 0,
        pastesImported: 0,
        error: "Failed to save imported data to storage.",
      };
    }

    // calculate how many items were actually imported
    const newDraftsCount = codeStorage.drafts.count();
    const newPastesCount = codeStorage.pastes.count();

    const draftsImported =
      mode === "replace"
        ? data.drafts.length
        : newDraftsCount - existingDraftsCount;
    const pastesImported =
      mode === "replace"
        ? data.pastes.length
        : newPastesCount - existingPastesCount;

    // dispatch events to notify other components
    if (draftsImported > 0) {
      window.dispatchEvent(new Event("draftSaved"));
    }
    if (pastesImported > 0) {
      window.dispatchEvent(new Event("pasteSaved"));
    }

    return {
      success: true,
      draftsImported,
      pastesImported,
    };
  } catch (error) {
    return {
      success: false,
      draftsImported: 0,
      pastesImported: 0,
      error:
        error instanceof Error
          ? error.message
          : "Failed to import data. Please ensure the file is valid.",
    };
  }
}

/**
 * Get statistics about current stored data
 */
export function getDataStatistics(): {
  draftsCount: number;
  pastesCount: number;
  activePastesCount: number;
  totalSize: number;
} {
  const stats = codeStorage.getStats();
  const data = codeStorage.exportData();

  // estimate size in bytes
  const totalSize = JSON.stringify(data).length;

  return {
    draftsCount: stats.drafts,
    pastesCount: stats.pastes,
    activePastesCount: stats.activePastes,
    totalSize,
  };
}

/**
 * Clear all locally stored data
 */
export function clearData(type: "all" | "drafts" | "pastes" = "all"): {
  draftsDeleted: number;
  pastesDeleted: number;
} {
  let draftsDeleted = 0;
  let pastesDeleted = 0;

  if (type === "all" || type === "drafts") {
    draftsDeleted = codeStorage.drafts.count();
    codeStorage.drafts.clear();
    if (draftsDeleted > 0) {
      window.dispatchEvent(new Event("draftSaved"));
    }
  }

  if (type === "all" || type === "pastes") {
    pastesDeleted = codeStorage.pastes.count();
    codeStorage.pastes.clear();
    if (pastesDeleted > 0) {
      window.dispatchEvent(new Event("pasteSaved"));
    }
  }

  return {
    draftsDeleted,
    pastesDeleted,
  };
}
