import "./components.js";
import { initSiteInteractions, initTheme } from "./interactions.js";

if (typeof document !== "undefined") {
  initTheme();
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => initSiteInteractions(), { once: true });
  } else {
    initSiteInteractions();
  }
}

