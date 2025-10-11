/**
 * Code Storage System
 * Manages local browser storage for code drafts and submitted pastes
 */

/**
 * Base interface for stored code items
 */
interface BaseCodeItem {
  id: string;
  code: string;
  language: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Draft item - Code that hasn't been submitted yet
 */
export interface CodeDraft extends BaseCodeItem {
  type: "draft";
  title?: string;
  description?: string;
  autoSaved: boolean;
}

/**
 * Submitted paste item - Code that has been sent to the server
 */
export interface SubmittedPaste extends BaseCodeItem {
  type: "paste";
  pasteId: string;
  adminPassword: string;
  url: string;
  expiresAt?: number;
  maxViews?: number;
}

/**
 * Union type for all stored code items
 */
export type StoredCodeItem = CodeDraft | SubmittedPaste;

/**
 * Storage keys for localStorage
 */
const STORAGE_KEYS = {
  DRAFTS: "pastebon_drafts",
  PASTES: "pastebon_submitted_pastes",
  AUTO_SAVE: "pastebon_auto_save",
} as const;

/**
 * Base class for code storage management
 */
abstract class BaseCodeStorage<T extends StoredCodeItem> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  /**
   * Check if localStorage is available
   */
  protected isStorageAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all items from storage
   */
  protected getAll(): T[] {
    if (!this.isStorageAvailable()) return [];

    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from ${this.storageKey}:`, error);
      return [];
    }
  }

  /**
   * Save all items to storage
   */
  protected saveAll(items: T[]): boolean {
    if (!this.isStorageAvailable()) return false;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return true;
    } catch (error) {
      console.error(`Error writing to ${this.storageKey}:`, error);
      return false;
    }
  }

  /**
   * Get item by ID
   */
  getById(id: string): T | null {
    const items = this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  /**
   * Delete item by ID
   */
  deleteById(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    return this.saveAll(filtered);
  }

  /**
   * Clear all items
   */
  clear(): boolean {
    return this.saveAll([]);
  }

  /**
   * Get count of items
   */
  count(): number {
    return this.getAll().length;
  }
}

/**
 * Draft storage manager
 * Handles code that hasn't been submitted yet
 */
export class DraftStorage extends BaseCodeStorage<CodeDraft> {
  constructor() {
    super(STORAGE_KEYS.DRAFTS);
  }

  /**
   * Create a new draft
   */
  create(params: {
    code: string;
    language: string;
    title?: string;
    description?: string;
    autoSaved?: boolean;
  }): CodeDraft | null {
    if (!this.isStorageAvailable()) return null;

    const now = Date.now();
    const draft: CodeDraft = {
      type: "draft",
      id: this.generateId(),
      code: params.code,
      language: params.language,
      title: params.title,
      description: params.description,
      autoSaved: params.autoSaved ?? false,
      createdAt: now,
      updatedAt: now,
    };

    const drafts = this.getAll();
    drafts.push(draft);

    if (this.saveAll(drafts)) {
      return draft;
    }
    return null;
  }

  /**
   * Update an existing draft
   */
  update(
    id: string,
    updates: Partial<
      Pick<
        CodeDraft,
        "code" | "language" | "title" | "description" | "autoSaved"
      >
    >,
  ): CodeDraft | null {
    const drafts = this.getAll();
    const index = drafts.findIndex((d) => d.id === id);

    if (index === -1) return null;

    drafts[index] = {
      ...drafts[index],
      ...updates,
      updatedAt: Date.now(),
    };

    if (this.saveAll(drafts)) {
      return drafts[index];
    }

    return null;
  }

  /**
   * Get all drafts sorted by most recently updated
   */
  getAllSorted(): CodeDraft[] {
    return this.getAll().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Auto-save current code
   */
  autoSave(code: string, language: string): CodeDraft | null {
    // Check if there's an existing auto-save
    const drafts = this.getAll();
    const autoSaveDraft = drafts.find((d) => d.autoSaved);

    if (autoSaveDraft) {
      return this.update(autoSaveDraft.id, { code, language, autoSaved: true });
    }

    return this.create({ code, language, autoSaved: true });
  }

  /**
   * Get the auto-saved draft
   */
  getAutoSave(): CodeDraft | null {
    return this.getAll().find((d) => d.autoSaved) || null;
  }

  /**
   * Import drafts from external data
   */
  importDrafts(drafts: CodeDraft[]): boolean {
    return this.saveAll(drafts);
  }

  /**
   * Generate unique draft ID
   */
  private generateId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Submitted paste storage manager
 * Handles code that has been submitted to the server
 */
export class PasteStorage extends BaseCodeStorage<SubmittedPaste> {
  constructor() {
    super(STORAGE_KEYS.PASTES);
  }

  /**
   * Save a submitted paste
   */
  create(params: {
    pasteId: string;
    code: string;
    language: string;
    adminPassword: string;
    expiresAt?: number;
    maxViews?: number;
  }): SubmittedPaste | null {
    if (!this.isStorageAvailable()) return null;

    const now = Date.now();
    const paste: SubmittedPaste = {
      type: "paste",
      id: this.generateId(),
      pasteId: params.pasteId,
      code: params.code,
      language: params.language,
      adminPassword: params.adminPassword,
      url: `/paste/${params.pasteId}`,
      expiresAt: params.expiresAt,
      maxViews: params.maxViews,
      createdAt: now,
      updatedAt: now,
    };

    const pastes = this.getAll();
    pastes.push(paste);

    if (this.saveAll(pastes)) {
      return paste;
    }
    return null;
  }

  /**
   * Get paste by pasteId (the server-side ID)
   */
  getByPasteId(pasteId: string): SubmittedPaste | null {
    const pastes = this.getAll();
    return pastes.find((p) => p.pasteId === pasteId) || null;
  }

  /**
   * Get all pastes sorted by most recent
   */
  getAllSorted(): SubmittedPaste[] {
    return this.getAll().sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Get active (non-expired) pastes
   */
  getActive(): SubmittedPaste[] {
    const now = Date.now();
    return this.getAll().filter((p) => {
      if (!p.expiresAt) return true;
      return p.expiresAt > now;
    });
  }

  /**
   * Clean up expired pastes
   */
  cleanExpired(): number {
    const now = Date.now();
    const pastes = this.getAll();
    const active = pastes.filter((p) => {
      if (!p.expiresAt) return true;
      return p.expiresAt > now;
    });

    const removed = pastes.length - active.length;
    if (removed > 0) {
      this.saveAll(active);
    }
    return removed;
  }

  /**
   * Import pastes from external data
   */
  importPastes(pastes: SubmittedPaste[]): boolean {
    return this.saveAll(pastes);
  }

  /**
   * Generate unique paste storage ID
   */
  private generateId(): string {
    return `paste_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Main storage manager class
 * Provides unified access to both draft and paste storage
 */
export class CodeStorageManager {
  public drafts: DraftStorage;
  public pastes: PasteStorage;

  constructor() {
    this.drafts = new DraftStorage();
    this.pastes = new PasteStorage();
  }

  /**
   * Get storage statistics
   */
  getStats() {
    return {
      drafts: this.drafts.count(),
      pastes: this.pastes.count(),
      activePastes: this.pastes.getActive().length,
    };
  }

  /**
   * Clear all stored data
   */
  clearAll(): boolean {
    const draftsCleared = this.drafts.clear();
    const pastesCleared = this.pastes.clear();
    return draftsCleared && pastesCleared;
  }

  /**
   * Export all data as JSON
   */
  exportData() {
    return {
      drafts: this.drafts.getAllSorted(),
      pastes: this.pastes.getAllSorted(),
      exportedAt: Date.now(),
    };
  }

  /**
   * Import data from JSON
   */
  importData(data: {
    drafts?: CodeDraft[];
    pastes?: SubmittedPaste[];
  }): boolean {
    let success = true;

    if (data.drafts) {
      success = success && this.drafts.importDrafts(data.drafts);
    }

    if (data.pastes) {
      success = success && this.pastes.importPastes(data.pastes);
    }

    return success;
  }
}

/**
 * Singleton instance for easy access throughout the app
 */
export const codeStorage = new CodeStorageManager();
