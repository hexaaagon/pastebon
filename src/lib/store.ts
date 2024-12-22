import { createStore, action, Action } from "easy-peasy";

export const store = createStore(
  {
    sidebarOpened: false,
    setSidebarOpen: action(
      (state: StoreType, sidebar: StoreType["sidebarOpened"]) => {
        state.sidebarOpened = sidebar;
      },
    ),
  } as StoreType & StoreActions,
  {
    name: "PastebonStore",
  },
);

export interface StoreType {
  sidebarOpened?: boolean;
}

export interface StoreActions {
  setSidebarOpen: any;
}
