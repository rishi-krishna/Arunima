import "./components.js";
import { initForms } from "./forms.js";
import { initSiteInteractions, initTheme } from "./interactions.js";

function ensureSharedActions() {
  if (!document.querySelector("whatsapp-action")) {
    document.body.append(document.createElement("whatsapp-action"));
  }
}

if (typeof document !== "undefined") {
  initTheme();
  if (document.readyState === "loading") {
    window.addEventListener(
      "DOMContentLoaded",
      () => {
        ensureSharedActions();
        initSiteInteractions();
        initForms();
      },
      { once: true },
    );
  } else {
    ensureSharedActions();
    initSiteInteractions();
    initForms();
  }
}
