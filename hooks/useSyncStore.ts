import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import React from "react";
import { browser } from "wxt/browser";
import { WritableDraft } from "immer";

export type Preset = "links" | "snow" | "bubbles";

type StoreState = {
  alpha: number;
  blur: number;
  lang: string;
  preset: Preset;
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

export const alpha = 15;
export const blur = 4;
export const lang = "en";
export const preset = "snow";

export const useSyncStore = create<Store>()(
  persist(
    immer((set) => ({
      set,
      alpha,
      blur,
      lang,
      preset,
    })),
    {
      name: "useSyncStore",
      storage: createJSONStorage(() => syncStorage),
      version: 3,
    }
  )
);

export const useSyncStoreHasHydrated = () =>
  React.useSyncExternalStore(
    (onStateChange) => useSyncStore.persist.onFinishHydration(onStateChange),
    () => useSyncStore.persist.hasHydrated(),
    () => false
  );
