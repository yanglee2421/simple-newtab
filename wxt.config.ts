import { defineConfig } from "wxt";

const ReactCompilerConfig = {
  target: "19", // '17' | '18' | '19'
};

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    matches: ["*://*/*"],
    permissions: ["storage", "tabs"],
    name: "Simple Newtab",
    content_security_policy: {
      extension_pages:
        "script-src 'self' http://localhost:8097/; object-src 'self'",
    },
  },
  react: {
    vite: {
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    },
  },
  srcDir: "src",
});
