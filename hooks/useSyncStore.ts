import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import React from "react";
import { browser } from "wxt/browser";
import { WritableDraft } from "immer";

type StoreState = {
  alpha: number;
  blur: number;
  lang: string;
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

const syncStorage = {
  async getItem(key: string) {
    const val = await browser.storage.sync.get(key);
    return String(val[key]);
  },
  setItem(key: string, value: string) {
    return browser.storage.sync.set({ [key]: value });
  },
  removeItem(key: string) {
    return browser.storage.sync.remove(key);
  },
};

export const useSyncStore = create<Store>()(
  persist(
    immer((set) => ({
      set,
      alpha: 0,
      blur: 100,
      lang: "en",
    })),
    {
      name: "useSyncStore",
      storage: createJSONStorage(() => syncStorage),
      version: 2,
    }
  )
);

export const useSyncStoreHasHydrated = () =>
  React.useSyncExternalStore(
    (onStateChange) => useSyncStore.persist.onFinishHydration(onStateChange),
    () => useSyncStore.persist.hasHydrated(),
    () => false
  );
