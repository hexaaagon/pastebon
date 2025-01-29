import { createStore, action, persist, type Action } from "easy-peasy";

export const store = createStore<StoreModel>(
  persist(
    {
      sidebarOpened: false,
      setSidebarOpen: action(
        (state: StoreType, sidebar: StoreType["sidebarOpened"]) => {
          state.sidebarOpened = sidebar;
        },
      ),

      isEditingCode: false,
      setIsEditingCode: action(
        (state: StoreType, editing: StoreType["isEditingCode"]) => {
          state.isEditingCode = editing;
        },
      ),

      drafts: [],
      addDraft: action((state: StoreType, draft: StoreType["drafts"][0]) => {
        state.drafts.push(draft);
      }),
      editDraft: action((state: StoreType, draft: StoreType["drafts"][0]) => {
        const index = state.drafts.findIndex((d) => d.id === draft.id);
        state.drafts[index] = draft;
      }),
      removeDraft: action((state: StoreType, draft: StoreType["drafts"][0]) => {
        state.drafts = state.drafts.filter((d) => d !== draft);
      }),
    },
    {
      deny: ["sidebarOpened", "isEditingCode"],
    },
  ),
);

export interface StoreModel extends StoreType, StoreActions {}

export interface StoreType {
  sidebarOpened: boolean;
  isEditingCode: boolean;
  drafts: Draft[];
}

export interface StoreActions {
  setSidebarOpen: Action<StoreModel, StoreType["sidebarOpened"]>;
  setIsEditingCode: Action<StoreModel, StoreType["isEditingCode"]>;
  addDraft: Action<StoreModel, StoreType["drafts"][0]>;
  editDraft: Action<StoreModel, StoreType["drafts"][0]>;
  removeDraft: Action<StoreModel, StoreType["drafts"][0]>;
}

export interface Draft {
  id: string;
  lastUpdated: string;

  title: string;
  code: string;
  language: string;
}
