import { clinic } from "./site-config.js";
import { primaryRoutes, treatmentRoutes } from "./components.js";

export const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage can be blocked in privacy modes. The interface still works in memory.
    }
  },
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableElements(container) {
  return [...container.querySelectorAll(focusableSelector)].filter(
    (element) => !element.hidden && element.getAttribute("aria-hidden") !== "true",
  );
}

function trapFocus(event, container) {
  if (event.key !== "Tab") return;
  const elements = focusableElements(container);
  if (!elements.length) {
    event.preventDefault();
    container.focus();
    return;
  }

  const first = elements[0];
  const last = elements.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function normalizePath(pathname) {
  const path = pathname.replace(/index\.html$/i, "").replace(/\/+/g, "/");
  return path === "/" ? path : `${path.replace(/\/$/, "")}/`;
}

function activeSection(pathname) {
  if (treatmentRoutes.some(([route]) => pathname === route)) return "/treatments/";
  if (pathname.startsWith("/blog/")) return "/blog/";
  return primaryRoutes.find(([route]) => route === pathname)?.[0] ?? null;
}

function setExpanded(button, expanded, openLabel, closeLabel) {
  button.setAttribute("aria-expanded", String(expanded));
  if (openLabel && closeLabel) {
    button.setAttribute("aria-label", expanded ? closeLabel : openLabel);
  }
}

export function initTheme(root = document) {
  const saved = storage.get("arunima-theme");
  const theme = saved === "dark" || saved === "light" ? saved : "light";
  document.documentElement.dataset.theme = theme;
  updateThemeButtons(root);
}

function updateThemeButtons(root = document) {
  const dark = document.documentElement.dataset.theme === "dark";
  root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
    button.setAttribute("title", `Switch to ${dark ? "light" : "dark"} theme`);
    const icon = button.querySelector("[data-theme-icon]");
    if (icon) icon.textContent = dark ? "☀" : "☾";
  });
}

export function toggleTheme(root = document) {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  storage.set("arunima-theme", next);
  updateThemeButtons(root);
  return next;
}

export function initAccordions(root = document) {
  root.querySelectorAll("[data-accordion-trigger]").forEach((trigger) => {
    if (trigger.dataset.accordionReady === "true") return;
    trigger.dataset.accordionReady = "true";
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;
    panel.hidden = trigger.getAttribute("aria-expanded") !== "true";
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });
}

export function populateClinicFields(root = document) {
  root.querySelectorAll("[data-clinic-field]").forEach((element) => {
    const key = element.dataset.clinicField;
    if (Object.hasOwn(clinic, key)) element.textContent = clinic[key];
  });
}

export function initActiveRoutes(root = document, pathname = window.location.pathname) {
  const currentPath = normalizePath(pathname);
  const section = activeSection(currentPath);
  root.querySelectorAll("[data-route]").forEach((link) => {
    const route = normalizePath(link.dataset.route);
    const isCurrent = route === currentPath || (route === section && route !== "/");
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

export function initNavigation(root = document) {
  const menu = root.querySelector("[data-nav-menu]");
  const menuButton = root.querySelector("[data-menu-toggle]");
  const closeMenu = (restoreFocus = false) => {
    if (!menu || !menuButton) return;
    menu.dataset.open = "false";
    setExpanded(menuButton, false);
    if (restoreFocus) menuButton.focus();
  };

  if (menu && menuButton && menuButton.dataset.ready !== "true") {
    menuButton.dataset.ready = "true";
    menuButton.addEventListener("click", () => {
      const open = menu.dataset.open !== "true";
      menu.dataset.open = String(open);
      setExpanded(menuButton, open);
      if (open) menu.querySelector("a")?.focus();
    });
    menu.addEventListener("focusout", (event) => {
      if (!menu.contains(event.relatedTarget)) closeMenu();
    });
  }

  const drawer = root.querySelector("[data-mobile-drawer]");
  const drawerPanel = drawer?.querySelector(".mobile-drawer__panel");
  const drawerButton = root.querySelector("[data-mobile-toggle]");
  const drawerClose = drawer?.querySelector("[data-mobile-close]");
  let drawerReturnFocus = drawerButton;

  const setDrawerOpen = (open, restoreFocus = false) => {
    if (!drawer || !drawerButton || !drawerPanel) return;
    drawer.dataset.open = String(open);
    drawer.setAttribute("aria-hidden", String(!open));
    setExpanded(drawerButton, open, "Open navigation", "Close navigation");
    document.body.classList.toggle("is-locked", open);
    if (open) {
      drawerReturnFocus = document.activeElement;
      drawerPanel.focus();
    } else if (restoreFocus) {
      drawerReturnFocus?.focus();
    }
  };

  if (drawer && drawerButton && drawerButton.dataset.ready !== "true") {
    drawerButton.dataset.ready = "true";
    drawerButton.addEventListener("click", () => {
      setDrawerOpen(drawer.dataset.open !== "true", true);
    });
    drawerClose?.addEventListener("click", () => setDrawerOpen(false, true));
    drawer.addEventListener("click", (event) => {
      if (event.target === drawer) setDrawerOpen(false, true);
    });
    drawer.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDrawerOpen(false, true);
      } else {
        trapFocus(event, drawerPanel);
      }
    });
    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setDrawerOpen(false));
    });
  }

  if (root.documentElement?.dataset.navigationReady !== "true") {
    root.documentElement.dataset.navigationReady = "true";
    root.addEventListener("click", (event) => {
      if (menu && !menu.contains(event.target)) closeMenu();
    });
    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu?.dataset.open === "true") {
        event.preventDefault();
        closeMenu(true);
      }
    });
  }
}

export function initOverlays(root = document) {
  root.querySelectorAll("[data-overlay]").forEach((overlay) => {
    if (overlay.dataset.ready === "true") return;
    overlay.dataset.ready = "true";
    const panel = overlay.querySelector('[role="dialog"]');
    const trigger = root.querySelector(`[data-overlay-trigger="${overlay.id}"]`);
    let returnFocus = trigger;

    const setOpen = (open, restoreFocus = false) => {
      overlay.dataset.open = String(open);
      overlay.setAttribute("aria-hidden", String(!open));
      trigger?.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
      if (open) {
        returnFocus = document.activeElement;
        panel?.focus();
      } else if (restoreFocus) {
        returnFocus?.focus();
      }
    };

    trigger?.addEventListener("click", () => setOpen(true));
    overlay.querySelectorAll("[data-overlay-close]").forEach((button) => {
      button.addEventListener("click", () => setOpen(false, true));
    });
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) setOpen(false, true);
    });
    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false, true);
      } else if (panel) {
        trapFocus(event, panel);
      }
    });
  });
}

export function initCookieNotice(root = document) {
  const notice = root.querySelector("[data-cookie-notice]");
  if (!notice || notice.dataset.ready === "true") return;
  notice.dataset.ready = "true";
  const saved = storage.get("arunima-cookie-choice");
  notice.hidden = saved === "accepted" || saved === "declined";
  notice.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      storage.set("arunima-cookie-choice", button.dataset.cookieChoice);
      notice.hidden = true;
    });
  });
}

export function initAssistant(root = document) {
  const button = root.querySelector("[data-assistant-toggle]");
  const body = root.querySelector("[data-assistant-body]");
  if (!button || !body || button.dataset.ready === "true") return;
  button.dataset.ready = "true";
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    body.hidden = !open;
    const icon = button.querySelector("[data-assistant-icon]");
    if (icon) icon.textContent = open ? "−" : "＋";
    if (open) body.querySelector("a")?.focus();
  });
  button.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      button.click();
      button.focus();
    }
  });
  body.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      button.click();
      button.focus();
    }
  });
}

export function initNewsletter(root = document) {
  root.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    if (form.dataset.ready === "true") return;
    form.dataset.ready = "true";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector("[data-newsletter-status]");
      if (!form.reportValidity()) return;
      if (status) status.textContent = "Thanks — this demo did not transmit your email.";
      form.reset();
    });
  });
}

export function initSiteInteractions(root = document) {
  populateClinicFields(root);
  initActiveRoutes(root);
  initNavigation(root);
  initOverlays(root);
  initCookieNotice(root);
  initAssistant(root);
  initAccordions(root);
  initNewsletter(root);
  root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    if (button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", () => toggleTheme(root));
  });
  updateThemeButtons(root);
}
