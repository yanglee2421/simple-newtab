import { App } from "@/app/content/App";
import createCache from "@emotion/cache";
import React from "react";
import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";

const idToEl = (id: string) => {
  let el = document.getElementById(id);

  if (!el) {
    el = document.createElement("div");
    el.id = id;
    document.body.appendChild(el);
  }

  return el;
};

export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    const el = idToEl("wxtroot");
    const shadowRoot = el.attachShadow({ mode: "open" });
    const tempalte = document.createElement("div");
    const container = document.createElement("div");

    document.body.appendChild(el);
    shadowRoot.appendChild(tempalte);
    shadowRoot.appendChild(container);

    const cache = createCache({
      key: "wxtcss",
      container: shadowRoot,
      insertionPoint: tempalte,
    });

    createRoot(container).render(
      <React.StrictMode>
        <CacheProvider value={cache}>
          <App />
        </CacheProvider>
      </React.StrictMode>
    );
  },
});
