import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    matches: ["*://*/*"],
    permissions: ["storage", "tabs"],
    name: "Simple Newtab",
  },
});
