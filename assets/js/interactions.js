import { clinic } from "./site-config.js?v=20260821e";

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

export function normalizeInternalUrls(root = document) {
  root.querySelectorAll('a[href^="/"], [src^="/"]').forEach((element) => {
    const attribute = element.hasAttribute("href") ? "href" : "src";
    const value = element.getAttribute(attribute);
    element.setAttribute(attribute, value === "/" ? "." : value.slice(1));
  });
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

export function initMotion(root = document) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealGroups = [
    ...root.querySelectorAll(
      "main > section:not(.hero) .section-heading, .process-card, .bio-layout > *, .experience-summary, .review-toolbar, " +
        ".review-carousel, .faq-layout > *, .article-card, .instagram-heading",
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

export function initSiteInteractions(root = document) {
  normalizeInternalUrls(root);
  populateClinicFields(root);
  initAccordions(root);
  initReviewCarousel(root);
  initMotion(root);
  root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    if (button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", () => toggleTheme(root));
  });
  updateThemeButtons(root);
}
