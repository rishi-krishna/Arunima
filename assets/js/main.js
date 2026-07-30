import "./components.js";
import { initForms } from "./forms.js";
import { initSiteInteractions, initTheme } from "./interactions.js";

if (typeof document !== "undefined") {
  initTheme();
  if (document.readyState === "loading") {
    window.addEventListener(
      "DOMContentLoaded",
      () => {
        initSiteInteractions();
        initForms();
      },
      { once: true },
    );
  } else {
    initSiteInteractions();
    initForms();
  }
}
