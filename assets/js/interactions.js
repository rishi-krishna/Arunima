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

function pathWithinSite(pathname) {
  const basePath = new URL(document.baseURI).pathname.replace(/\/?$/, "/");
  if (basePath !== "/" && pathname.startsWith(basePath)) {
    return `/${pathname.slice(basePath.length)}`;
  }
  return pathname;
}

export function normalizeInternalUrls(root = document) {
  root.querySelectorAll('a[href^="/"], [src^="/"]').forEach((element) => {
    const attribute = element.hasAttribute("href") ? "href" : "src";
    const value = element.getAttribute(attribute);
    element.setAttribute(attribute, value === "/" ? "." : value.slice(1));
  });
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
  const currentPath = normalizePath(pathWithinSite(pathname));
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

export function initMotion(root = document) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealGroups = [
    ...root.querySelectorAll(
      "main > section:not(.hero) .section-heading, .process-card, .protocol-tabs, " +
        ".protocol-stack, .bio-layout > *, .experience-summary, .review-toolbar, " +
        ".review-carousel, .review-callouts, .faq-layout > *, .article-card, " +
        ".instagram-heading, .instagram-carousel, .contact-cta__inner",
    ),
  ];

  revealGroups.forEach((element, index) => {
    if (element.hasAttribute("data-reveal")) return;
    element.setAttribute("data-reveal", "");
    element.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealGroups.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    revealGroups.forEach((element) => observer.observe(element));
  }

  const hero = root.querySelector(".hero");
  if (hero && !reduceMotion && hero.dataset.parallaxReady !== "true") {
    hero.dataset.parallaxReady = "true";
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 14;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
      hero.style.setProperty("--hero-shift-x", `${x}px`);
      hero.style.setProperty("--hero-shift-y", `${y}px`);
    });
    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--hero-shift-x", "0px");
      hero.style.setProperty("--hero-shift-y", "0px");
    });
  }

  const nav = root.querySelector(".site-nav");
  if (nav && document.documentElement.dataset.navMotionReady !== "true") {
    document.documentElement.dataset.navMotionReady = "true";
    const updateNav = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
  }
}

export function initProtocolTabs(root = document) {
  const tabs = [...root.querySelectorAll("[data-protocol-tab]")];
  const panels = [...root.querySelectorAll("[data-protocol-panel]")];
  if (!tabs.length || tabs.some((tab) => tab.dataset.ready === "true")) return;

  const activate = (tab, focus = false) => {
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      if (selected && focus) candidate.focus();
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.dataset.protocolTab;
    });
  };

  tabs.forEach((tab, index) => {
    tab.dataset.ready = "true";
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      activate(tabs[nextIndex], true);
    });
  });
  activate(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
}

export function initReviewCarousel(root = document) {
  const track = root.querySelector("[data-review-track]");
  const previous = root.querySelector("[data-review-prev]");
  const next = root.querySelector("[data-review-next]");
  const status = root.querySelector("[data-review-status]");
  const filters = [...root.querySelectorAll("[data-review-filter]")];
  if (!track || !previous || !next || track.dataset.ready === "true") return;
  track.dataset.ready = "true";
  let index = 0;
  let filter = "all";

  const visibleCards = () =>
    [...track.querySelectorAll("[data-review-card]")].filter(
      (card) => filter === "all" || card.dataset.category === filter,
    );

  const update = () => {
    const cards = visibleCards();
    const visibleCount = window.innerWidth <= 640 ? 1 : window.innerWidth <= 860 ? 2 : 3;
    const maximum = Math.max(0, cards.length - visibleCount);
    index = Math.min(index, maximum);
    const width = cards[0]?.getBoundingClientRect().width || 0;
    track.style.transform = `translateX(-${index * (width + 24)}px)`;
    previous.disabled = index === 0;
    next.disabled = index === maximum;
    if (status) status.textContent = `${Math.min(index + 1, cards.length)} / ${cards.length}`;
  };

  previous.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    update();
  });
  next.addEventListener("click", () => {
    index += 1;
    update();
  });
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.reviewFilter;
      index = 0;
      filters.forEach((candidate) =>
        candidate.setAttribute("aria-pressed", String(candidate === button)),
      );
      track.querySelectorAll("[data-review-card]").forEach((card) => {
        card.dataset.filtered = String(filter !== "all" && card.dataset.category !== filter);
      });
      update();
    });
  });
  window.addEventListener("resize", update);
  update();
}

export function initInstagramCarousel(root = document) {
  const track = root.querySelector("[data-instagram-track]");
  const previous = root.querySelector("[data-instagram-prev]");
  const next = root.querySelector("[data-instagram-next]");
  if (!track || !previous || !next || track.dataset.ready === "true") return;
  track.dataset.ready = "true";
  let index = 0;

  const update = () => {
    const cards = [...track.children];
    const visibleCount = window.innerWidth <= 640 ? 1 : window.innerWidth <= 860 ? 2 : 3;
    const maximum = Math.max(0, cards.length - visibleCount);
    index = Math.min(index, maximum);
    const width = cards[0]?.getBoundingClientRect().width || 0;
    track.style.transform = `translateX(-${index * (width + 18)}px)`;
    previous.disabled = index === 0;
    next.disabled = index === maximum;
  };

  previous.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    update();
  });
  next.addEventListener("click", () => {
    index += 1;
    update();
  });
  window.addEventListener("resize", update);
  update();
}

export function initSiteInteractions(root = document) {
  normalizeInternalUrls(root);
  populateClinicFields(root);
  initActiveRoutes(root);
  initNavigation(root);
  initOverlays(root);
  initCookieNotice(root);
  initAssistant(root);
  initAccordions(root);
  initNewsletter(root);
  initProtocolTabs(root);
  initReviewCarousel(root);
  initInstagramCarousel(root);
  initMotion(root);
  root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    if (button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", () => toggleTheme(root));
  });
  updateThemeButtons(root);
}
