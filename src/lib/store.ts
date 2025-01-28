import { createStore, action, Action } from "easy-peasy";

export const store = createStore(
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
  } as StoreType & StoreActions,
  {
    name: "PastebonStore",
  },
);

export interface StoreType {
  sidebarOpened?: boolean;
  isEditingCode?: boolean;
}

export interface StoreActions {
  setSidebarOpen: any;
  setIsEditingCode: any;
}
