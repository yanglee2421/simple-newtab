import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "webextension-polyfill",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    matches: ["*://*/*"],
  },
});
