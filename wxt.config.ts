import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "webextension-polyfill",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    matches: ["*://*/*"],
    permissions: ["storage", "tabs"],
    description:
      "This is a simple extension that demonstrates how to use the Web Extension Tools (WXT) library.",
    name: "Simple Newtab",
  },
});
