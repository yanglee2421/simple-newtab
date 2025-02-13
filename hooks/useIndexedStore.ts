import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import React from "react";
import { WritableDraft } from "immer";
import localforage from "localforage";

type StoreState = {
  backgroundImage: string;
};

type StoreActions = {
  set(
    nextStateOrUpdater:
      | StoreState
      | Partial<StoreState>
      | ((state: WritableDraft<StoreState>) => void)
  ): void;
};

type Store = StoreState & StoreActions;

export const useIndexedStore = create<Store>()(
  persist(
    immer((set) => ({
      set,
      backgroundImage: "",
    })),
    {
      name: "useIndexedStore",
      storage: createJSONStorage(() => localforage),
      version: 2,
    }
  )
);

export const useIndexedStoreHasHydrated = () =>
  React.useSyncExternalStore(
    (onStateChange) => useIndexedStore.persist.onFinishHydration(onStateChange),
    () => useSyncStore.persist.hasHydrated(),
    () => false
  );
