/**
 * Code Storage System - Main Entry Point
 *
 * This module provides a complete browser-based storage solution
 * for managing code drafts and submitted pastes.
 */

// export core storage system
export {
  codeStorage,
  CodeStorageManager,
  DraftStorage,
  PasteStorage,
} from "./code-storage";

// export types
export type { CodeDraft, SubmittedPaste, StoredCodeItem } from "./code-storage";

// export React hooks
export {
  useDrafts,
  useAutoSave,
  usePasteHistory,
  useStorageStats,
  useStorageBackup,
} from "./hooks";
