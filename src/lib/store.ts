import { createStore, action, Action } from "easy-peasy";

export const store = createStore<StoreModel>({
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
});

export interface StoreModel extends StoreType, StoreActions {}

export interface StoreType {
  sidebarOpened: boolean;
  isEditingCode: boolean;
}

export interface StoreActions {
  setSidebarOpen: Action<StoreModel, StoreType["sidebarOpened"]>;
  setIsEditingCode: Action<StoreModel, StoreType["isEditingCode"]>;
}
