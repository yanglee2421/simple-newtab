import { render } from "./render";

export default defineContentScript({
  matches: ["*://*/*"],
  main: render,
});
