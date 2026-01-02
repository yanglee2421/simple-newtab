import React from "react";
import { create } from "zustand";
import { browser } from "wxt/browser";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";

export type Preset = "links" | "snow" | "bubbles" | "";
export type BackgroundType = "image" | "color" | "gallery";

type Store = {
  alpha: number;
  blur: number;
  lang: string;
  preset: Preset;
  imageId: number;
  backgroundType: BackgroundType;
};

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

const makeInitialValues = (): Store => {
  return {
    alpha: 15,
    blur: 4,
    lang: "en",
    preset: "snow" as Preset,
    imageId: 1,
    backgroundType: "image",
  };
};

export const useSyncStore = create<Store>()(
  persist(immer(makeInitialValues), {
    name: "useSyncStore",
    storage: createJSONStorage(() => syncStorage),
    version: 3,
  }),
);

export const useSyncStoreHasHydrated = () => {
  return React.useSyncExternalStore(
    (onStateChange) => useSyncStore.persist.onFinishHydration(onStateChange),
    () => useSyncStore.persist.hasHydrated(),
    () => false,
  );
};

export const useSubscribeSyncStoreChange = () => {
  React.useEffect(() => {
    const handleSyncStoreChange = () => {
      useSyncStore.persist.rehydrate();
    };

    browser.storage.sync.onChanged.addListener(handleSyncStoreChange);

    return () => {
      browser.storage.sync.onChanged.removeListener(handleSyncStoreChange);
    };
  }, []);
};
