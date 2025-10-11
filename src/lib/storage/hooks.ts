"use client";

import { useCallback, useEffect, useState } from "react";
import {
  codeStorage,
  type CodeDraft,
  type SubmittedPaste,
} from "./code-storage";

/**
 * Hook for managing drafts with real-time updates
 */
export function useDrafts() {
  const [drafts, setDrafts] = useState<CodeDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // load drafts on mount
  useEffect(() => {
    const loadDrafts = () => {
      const allDrafts = codeStorage.drafts.getAllSorted();
      setDrafts(allDrafts);
      setIsLoading(false);
    };

    loadDrafts();
  }, []);

  const refresh = useCallback(() => {
    const allDrafts = codeStorage.drafts.getAllSorted();
    setDrafts(allDrafts);
  }, []);

  const createDraft = useCallback(
    (params: {
      code: string;
      language: string;
      title?: string;
      description?: string;
      autoSaved?: boolean;
    }) => {
      const draft = codeStorage.drafts.create(params);
      if (draft) {
        refresh();
      }
      return draft;
    },
    [refresh],
  );

  const updateDraft = useCallback(
    (
      id: string,
      updates: Partial<
        Pick<
          CodeDraft,
          "code" | "language" | "title" | "description" | "autoSaved"
        >
      >,
    ) => {
      const updated = codeStorage.drafts.update(id, updates);
      if (updated) {
        refresh();
      }
      return updated;
    },
    [refresh],
  );

  const deleteDraft = useCallback(
    (id: string) => {
      const success = codeStorage.drafts.deleteById(id);
      if (success) {
        refresh();
      }
      return success;
    },
    [refresh],
  );

  const getDraftById = useCallback((id: string) => {
    return codeStorage.drafts.getById(id);
  }, []);

  return {
    drafts,
    isLoading,
    createDraft,
    updateDraft,
    deleteDraft,
    getDraftById,
    refresh,
  };
}

/**
 * Hook for auto-save functionality
 */
export function useAutoSave(
  code: string,
  language: string,
  options: {
    enabled?: boolean;
    intervalMs?: number;
    minLength?: number;
    onAutoSaveStart?: () => void;
    onAutoSaveComplete?: () => void;
  } = {},
) {
  const {
    enabled = true,
    intervalMs = 30000,
    minLength = 1,
    onAutoSaveStart,
    onAutoSaveComplete,
  } = options;
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!enabled || code.trim().length < minLength) {
      return;
    }

    const save = () => {
      setIsSaving(true);
      onAutoSaveStart?.();
      const draft = codeStorage.drafts.autoSave(code, language);
      if (draft) {
        setLastSaved(Date.now());
      }
      setIsSaving(false);
      onAutoSaveComplete?.();
    };

    const interval = setInterval(save, intervalMs);

    return () => clearInterval(interval);
  }, [
    code,
    language,
    enabled,
    intervalMs,
    minLength,
    onAutoSaveStart,
    onAutoSaveComplete,
  ]);

  const saveNow = useCallback(() => {
    setIsSaving(true);
    const draft = codeStorage.drafts.autoSave(code, language);
    if (draft) {
      setLastSaved(Date.now());
    }
    setIsSaving(false);
    return draft;
  }, [code, language]);

  const getAutoSave = useCallback(() => {
    return codeStorage.drafts.getAutoSave();
  }, []);

  const clearAutoSave = useCallback(() => {
    const autoSave = codeStorage.drafts.getAutoSave();
    if (autoSave) {
      return codeStorage.drafts.deleteById(autoSave.id);
    }
    return false;
  }, []);

  return {
    lastSaved,
    isSaving,
    saveNow,
    getAutoSave,
    clearAutoSave,
  };
}

/**
 * Hook for managing paste history
 */
export function usePasteHistory() {
  const [pastes, setPastes] = useState<SubmittedPaste[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPastes = () => {
      const allPastes = codeStorage.pastes.getAllSorted();
      setPastes(allPastes);
      setIsLoading(false);
    };

    loadPastes();
  }, []);

  const refresh = useCallback(() => {
    const allPastes = codeStorage.pastes.getAllSorted();
    setPastes(allPastes);
  }, []);

  const savePaste = useCallback(
    (params: {
      pasteId: string;
      code: string;
      language: string;
      adminPassword: string;
      expiresAt?: number;
      maxViews?: number;
    }) => {
      const paste = codeStorage.pastes.create(params);
      if (paste) {
        refresh();
      }
      return paste;
    },
    [refresh],
  );

  const deletePaste = useCallback(
    (id: string) => {
      const success = codeStorage.pastes.deleteById(id);
      if (success) {
        refresh();
      }
      return success;
    },
    [refresh],
  );

  const getPasteById = useCallback((pasteId: string) => {
    return codeStorage.pastes.getByPasteId(pasteId);
  }, []);

  const getActivePastes = useCallback(() => {
    return codeStorage.pastes.getActive();
  }, []);

  const cleanExpired = useCallback(() => {
    const removed = codeStorage.pastes.cleanExpired();
    if (removed > 0) {
      refresh();
    }
    return removed;
  }, [refresh]);

  return {
    pastes,
    isLoading,
    savePaste,
    deletePaste,
    getPasteById,
    getActivePastes,
    cleanExpired,
    refresh,
  };
}

/**
 * Hook for storage statistics
 */
export function useStorageStats() {
  const [stats, setStats] = useState({
    drafts: 0,
    pastes: 0,
    activePastes: 0,
  });

  const refresh = useCallback(() => {
    const newStats = codeStorage.getStats();
    setStats(newStats);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    stats,
    refresh,
  };
}

/**
 * Hook for data import/export
 */
export function useStorageBackup() {
  const exportData = useCallback(() => {
    return codeStorage.exportData();
  }, []);

  const importData = useCallback(
    (data: { drafts?: CodeDraft[]; pastes?: SubmittedPaste[] }) => {
      return codeStorage.importData(data);
    },
    [],
  );

  const clearAll = useCallback(() => {
    return codeStorage.clearAll();
  }, []);

  const downloadBackup = useCallback(() => {
    const data = exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pastebon-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportData]);

  return {
    exportData,
    importData,
    clearAll,
    downloadBackup,
  };
}
