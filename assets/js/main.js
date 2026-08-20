import "./components.js?v=20260820d";
import { initForms } from "./forms.js?v=20260820d";
import { initSiteInteractions, initTheme } from "./interactions.js?v=20260820d";

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
