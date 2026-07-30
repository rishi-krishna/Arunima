import { clinic } from "./site-config.js";

const BaseElement = typeof HTMLElement === "undefined" ? class {} : HTMLElement;

export const primaryRoutes = Object.freeze([
  ["/", "Home"],
  ["/about/", "About"],
  ["/treatments/", "Treatments"],
  ["/research/", "Research"],
  ["/pricing/", "Pricing"],
  ["/blog/", "Blog"],
  ["/patient-stories/", "Patient Stories"],
  ["/contact/", "Contact"],
]);

export const treatmentRoutes = Object.freeze([
  ["/skin-treatment/", "Skin"],
  ["/pcod-treatment/", "PCOD / Fibroids"],
  ["/adenoid-treatment/", "Adenoids"],
  ["/allergy-treatment/", "Allergies"],
  ["/hair-loss-treatment/", "Hair Loss"],
  ["/thyroid-treatment/", "Thyroid"],
]);

const locationRoutes = Object.freeze([
  ["/locations/kphb/", "KPHB"],
  ["/locations/kukatpally/", "Kukatpally"],
  ["/locations/miyapur/", "Miyapur"],
  ["/locations/madhapur/", "Madhapur"],
  ["/locations/kondapur/", "Kondapur"],
  ["/locations/gachibowli/", "Gachibowli"],
  ["/locations/moosapet/", "Moosapet"],
]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function links(routes, className = "") {
  return routes
    .map(
      ([href, label]) =>
        `<a class="${className}" href="${href}" data-route="${href}">${escapeHtml(label)}</a>`,
    )
    .join("");
}

class SiteHeader extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const desktopLinks = primaryRoutes
      .map(([href, label]) => {
        if (href !== "/treatments/") {
          return `<a class="site-nav__link" href="${href}" data-route="${href}">${label}</a>`;
        }

        return `
          <div class="nav-menu" data-nav-menu>
            <button class="nav-menu__trigger" type="button" aria-expanded="false"
              aria-controls="treatments-menu" data-menu-toggle data-route="${href}">
              Treatments <span aria-hidden="true">⌄</span>
            </button>
            <div class="nav-menu__panel" id="treatments-menu" aria-label="Treatments">
              <a href="/treatments/" data-route="/treatments/">All Treatments</a>
              ${links(treatmentRoutes)}
            </div>
          </div>`;
      })
      .join("");

    this.innerHTML = `
      <header class="site-nav">
        <div class="container site-nav__inner">
          <a class="site-brand" href="/" aria-label="${escapeHtml(clinic.clinicName)} home">
            <img src="/assets/images/logo-mark.svg" alt="" width="38" height="38">
            <span>${escapeHtml(clinic.practitioner)}</span>
          </a>
          <nav class="site-nav__links" aria-label="Primary navigation">
            ${desktopLinks}
          </nav>
          <button class="theme-toggle" type="button" data-theme-toggle
            aria-label="Switch to dark theme" title="Switch theme">
            <span aria-hidden="true" data-theme-icon>☾</span>
          </button>
          <a class="site-nav__account site-nav__link" href="/my-journey/">My Journey</a>
          <a class="button button--primary site-nav__account" href="/book-appointment/">
            Book Appointment
          </a>
          <button class="mobile-toggle" type="button" data-mobile-toggle
            aria-expanded="false" aria-controls="mobile-navigation"
            aria-label="Open navigation">
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </header>
      <div class="mobile-drawer" id="mobile-navigation" data-mobile-drawer
        data-open="false" aria-hidden="true">
        <nav class="mobile-drawer__panel" aria-label="Mobile navigation" tabindex="-1">
          <button class="theme-toggle" type="button" data-mobile-close aria-label="Close navigation">
            <span aria-hidden="true">✕</span>
          </button>
          <div class="site-footer__links">
            ${links(primaryRoutes, "site-nav__link")}
            <p><strong>Treatments</strong></p>
            ${links(treatmentRoutes, "site-nav__link")}
            <a class="site-nav__link" href="/my-journey/">My Journey</a>
            <a class="button button--primary" href="/book-appointment/">Book Appointment</a>
          </div>
        </nav>
      </div>`;
  }
}

class SiteFooter extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";
    const year = new Date().getFullYear();

    this.innerHTML = `
      <footer class="site-footer">
        <div class="container site-footer__main">
          <section aria-labelledby="footer-clinic">
            <h3 id="footer-clinic">${escapeHtml(clinic.clinicName)}</h3>
            <p>Personalized homeopathic care built around careful assessment, structured
              programs, and measurable follow-up.</p>
            <p><strong>${escapeHtml(clinic.practitioner)}</strong><br>
              ${escapeHtml(clinic.credentials)}<br>
              Registration ${escapeHtml(clinic.registration)}, ${escapeHtml(clinic.board)}</p>
            <p><a href="${clinic.phoneHref}">${escapeHtml(clinic.phoneDisplay)}</a><br>
              <a href="mailto:${escapeHtml(clinic.email)}">${escapeHtml(clinic.email)}</a></p>
          </section>
          <nav aria-labelledby="footer-quick-links">
            <h4 id="footer-quick-links">Quick links</h4>
            <div class="site-footer__links">
              ${links([
                ["/about/", "About"],
                ["/approach/", "Our Approach"],
                ["/why-choose-us/", "Why Choose Us"],
                ["/treatments/", "Treatments"],
                ["/pricing/", "Pricing"],
                ["/research/", "Research"],
                ["/contact/", "Contact"],
              ])}
            </div>
          </nav>
          <nav aria-labelledby="footer-locations">
            <h4 id="footer-locations">Service areas</h4>
            <div class="site-footer__links">
              <a href="/locations/">All locations</a>
              ${links(locationRoutes)}
            </div>
          </nav>
          <section aria-labelledby="footer-visit">
            <h4 id="footer-visit">Visit and stay informed</h4>
            <address>${escapeHtml(clinic.address)}</address>
            <p><strong>Hours</strong><br>Monday–Saturday: 10:00 AM–7:00 PM<br>
              Sunday: By appointment</p>
            <form data-newsletter-form novalidate>
              <label for="footer-email">Health notes by email</label>
              <input id="footer-email" name="email" type="email" autocomplete="email"
                placeholder="you@example.com" required>
              <button class="button button--primary" type="submit">Subscribe</button>
              <p class="form-status" data-newsletter-status aria-live="polite"></p>
            </form>
          </section>
        </div>
        <div class="container site-footer__legal">
          <p>This website does not provide emergency care. For a medical emergency, call
            local emergency services or go to the nearest hospital.</p>
          <p>
            <a href="/privacy-policy/">Privacy Policy</a> ·
            <a href="/terms-of-service/">Terms of Service</a> ·
            <a href="/teleconsultation-policy/">Teleconsultation Policy</a>
          </p>
          <p>© ${year} ${escapeHtml(clinic.clinicName)}. All rights reserved.</p>
        </div>
      </footer>`;
  }
}

class CookieNotice extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <section class="cookie-notice" data-cookie-notice hidden
        aria-label="Cookie preferences" aria-live="polite">
        <div>
          <strong>Your privacy choices</strong>
          <p>We use essential browser storage for theme and accessibility preferences.
            Optional preferences help remember your choices on this device.</p>
        </div>
        <div>
          <button class="button button--outline" type="button" data-cookie-choice="declined">
            Essential only
          </button>
          <button class="button button--primary" type="button" data-cookie-choice="accepted">
            Accept
          </button>
        </div>
      </section>`;
  }
}

class CallbackPanel extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <button class="button button--primary floating-action" type="button"
        data-overlay-trigger="callback-dialog" aria-haspopup="dialog" aria-expanded="false">
        Request a callback
      </button>
      <div class="overlay" id="callback-dialog" data-overlay data-open="false"
        aria-hidden="true">
        <section class="overlay__panel" role="dialog" aria-modal="true"
          aria-labelledby="callback-title" tabindex="-1">
          <button class="theme-toggle" type="button" data-overlay-close
            aria-label="Close callback panel">✕</button>
          <h2 id="callback-title">Request a callback</h2>
          <p>Call us directly or use the appointment page to share your preferred time.
            This demonstration does not transmit patient information.</p>
          <p><a class="button button--primary" href="${clinic.phoneHref}">
            Call ${escapeHtml(clinic.phoneDisplay)}
          </a></p>
          <p><a class="button button--outline" href="/book-appointment/">
            Choose a consultation time
          </a></p>
        </section>
      </div>`;
  }
}

class ClinicAssistant extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <aside class="assistant-card" aria-label="Clinic assistant">
        <button class="assistant-card__header" type="button" data-assistant-toggle
          aria-expanded="false" aria-controls="clinic-assistant-body"
          style="width:100%;display:flex;align-items:center;justify-content:space-between;border:0;cursor:pointer;text-align:left">
          <strong>Clinic assistant</strong>
          <span aria-hidden="true" data-assistant-icon>＋</span>
        </button>
        <div class="assistant-card__body" id="clinic-assistant-body" data-assistant-body hidden>
          <p>Hello. How can we help you find the right next step?</p>
          <div class="site-footer__links">
            <a href="/treatments/">Explore treatments</a>
            <a href="/pricing/">Review program pricing</a>
            <a href="/book-appointment/">Book an assessment</a>
            <a href="${clinic.whatsappHref}" target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          </div>
          <p><small>This assistant provides navigation only, not medical advice.</small></p>
        </div>
      </aside>`;
  }
}

const componentDefinitions = [
  ["site-header", SiteHeader],
  ["site-footer", SiteFooter],
  ["cookie-notice", CookieNotice],
  ["callback-panel", CallbackPanel],
  ["clinic-assistant", ClinicAssistant],
];

if (typeof customElements !== "undefined") {
  for (const [name, Component] of componentDefinitions) {
    if (!customElements.get(name)) customElements.define(name, Component);
  }
}
