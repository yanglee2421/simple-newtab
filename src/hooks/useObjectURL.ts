import React from "react";

export class ObjectURLStore {
  #subscribeCountMap = new WeakMap<Blob, number>();
  #objectURLMap = new WeakMap<Blob, string>();
  #listeners = new Set<() => void>();

  subscribe(blob: Blob, callbackFn: () => void) {
    this.#listeners.add(callbackFn);

    // Subscribe count + 1
    const previousSubscribeCount = this.#subscribeCountMap.get(blob) || 0;
    const subscribeCount = previousSubscribeCount + 1;

    this.#subscribeCountMap.set(blob, subscribeCount);

    // Cache objectURL if objectURL is not exits
    if (this.#objectURLMap.has(blob)) {
      return;
    }

    const objectURL = URL.createObjectURL(blob);

    this.#objectURLMap.set(blob, objectURL);
  }
  unsubscribe(blob: Blob, callbackFn: () => void) {
    this.#listeners.delete(callbackFn);

    // Subscribe count - 1
    const previousSubscribeCount = this.#subscribeCountMap.get(blob) || 0;
    const subscribeCount = previousSubscribeCount - 1;

    this.#subscribeCountMap.set(blob, subscribeCount);

    /**
     * The subscription to this blob still exists;
     * the cached objectURL will not be deleted.
     */
    if (subscribeCount > 0) {
      return;
    }

    this.#subscribeCountMap.delete(blob);

    /**
     * If no subscription exists for this blob,
     * delete the cached objectURL and call URL.revokeObjectURL.
     */
    if (!this.#objectURLMap.has(blob)) {
      return;
    }

    const objectURL = this.#objectURLMap.get(blob);
    if (!objectURL) return;

    URL.revokeObjectURL(objectURL);
    this.#objectURLMap.delete(blob);
  }
  getSnapshot(blob: Blob) {
    return this.#objectURLMap.get(blob) || "";
  }
  update() {
    this.#listeners.forEach((listener) => {
      listener();
    });
  }
}

const objectURLStore = new ObjectURLStore();
export const ObjectURLContext = React.createContext(objectURLStore);

export const useObjectURL = (blob?: Blob) => {
  const store = React.use(ObjectURLContext);

  return React.useSyncExternalStore(
    (onStoreChange) => {
      if (!blob) return Boolean;

      store.subscribe(blob, onStoreChange);

      return () => {
        store.unsubscribe(blob, onStoreChange);
      };
    },
    () => {
      if (!blob) return null;

      return store.getSnapshot(blob);
    },
  );
};
