import React from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";

export type Preset = "links" | "snow" | "bubbles" | "";
export type BackgroundType = "color" | "gallery";
export type Mode = "system" | "light" | "dark";

type Store = {
  mode: Mode;
  lang: string;

  preset: Preset;

  alpha: number;
  blur: number;
  backgroundType: BackgroundType;
  wallpaperId: number;
  gallery: number[];
  backgroundColor: string;
};

const storeInitializer = (): Store => {
  return {
    alpha: 15,
    blur: 4,
    lang: "en",
    preset: "snow" as Preset,
    backgroundType: "gallery",
    wallpaperId: 0,
    gallery: [],
    mode: "system",
    backgroundColor: "oklch(58.5% 0.233 277.117)",
  };
};

export const useSyncStore = create<Store>()(
  persist(immer(storeInitializer), {
    name: "useSyncStore",
    storage: createJSONStorage(() => localStorage),
    version: 9,
  }),
);

export const useSubscribeSyncStoreChange = () => {
  React.useEffect(() => {
    const controller = new AbortController();
    let animateId = 0;

    window.addEventListener(
      "storage",
      (e) => {
        const storageKey = useSyncStore.persist.getOptions().name;

        if (e.key === storageKey) {
          cancelAnimationFrame(animateId);
          animateId = requestAnimationFrame(() => {
            React.startTransition(() => {
              useSyncStore.persist.rehydrate();
            });
          });
        }
      },
      controller,
    );

    return () => {
      controller.abort();
      cancelAnimationFrame(animateId);
    };
  }, []);
};
