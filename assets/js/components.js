import { clinic } from "./site-config.js?v=20260730f";

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
          <a class="site-nav__whatsapp" href="${clinic.whatsappHref}" target="_blank"
            rel="noopener noreferrer" aria-label="Chat with Dr. Arunima Mustyala on WhatsApp">
            WhatsApp
          </a>
          <a class="button button--primary site-nav__account" href="/book-appointment/">
            Book Consultation
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
            <a class="button button--whatsapp" href="${clinic.whatsappHref}" target="_blank"
              rel="noopener noreferrer" aria-label="Chat with Dr. Arunima Mustyala on WhatsApp">
              WhatsApp Dr. Arunima
            </a>
            <a class="button button--primary" href="/book-appointment/">Book Consultation</a>
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
            <p>Dr. Arunima's personal homeopathic practice, built around careful assessment,
              structured programs, and measurable follow-up.</p>
            <p><strong>${escapeHtml(clinic.practitioner)}</strong><br>
              ${escapeHtml(clinic.credentials)}<br>
              Registration ${escapeHtml(clinic.registration)}, ${escapeHtml(clinic.board)}</p>
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
            <h4 id="footer-visit">Hours and updates</h4>
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

class CallbackPanel extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <button class="button button--primary floating-action" type="button"
        data-overlay-trigger="callback-dialog" aria-haspopup="dialog" aria-expanded="false">
        Request consultation
      </button>
      <div class="overlay" id="callback-dialog" data-overlay data-open="false"
        aria-hidden="true">
        <section class="overlay__panel" role="dialog" aria-modal="true"
          aria-labelledby="callback-title" tabindex="-1">
          <button class="theme-toggle" type="button" data-overlay-close
            aria-label="Close callback panel">✕</button>
          <h2 id="callback-title">Request a consultation</h2>
          <p>Share your preferred consultation type and time. Your request will be prepared
            as a WhatsApp message for Dr. Arunima to review.</p>
          <p><a class="button button--outline" href="/book-appointment/">
            Book Consultation
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
      <aside class="assistant-card" aria-label="Dr. Arunima's consultation assistant">
        <button class="assistant-card__header" type="button" data-assistant-toggle
          aria-expanded="false" aria-controls="clinic-assistant-body"
          style="width:100%;display:flex;align-items:center;justify-content:space-between;border:0;cursor:pointer;text-align:left">
          <strong>Dr. Arunima's assistant</strong>
          <span aria-hidden="true" data-assistant-icon>＋</span>
        </button>
        <div class="assistant-card__body" id="clinic-assistant-body" data-assistant-body hidden>
          <p>Hello. Choose a care topic or request a consultation with Dr. Arunima.</p>
          <div class="site-footer__links">
            <a href="/treatments/">Explore treatments</a>
            <a href="/pricing/">Review program pricing</a>
            <a href="/book-appointment/">Book Consultation</a>
            <a href="${clinic.whatsappHref}" target="_blank" rel="noopener noreferrer">
              WhatsApp Dr. Arunima
            </a>
          </div>
          <p><small>This assistant provides navigation only, not medical advice.</small></p>
        </div>
      </aside>`;
  }
}

class WhatsAppAction extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <a class="whatsapp-action" href="${clinic.whatsappHref}" target="_blank"
        rel="noopener noreferrer" aria-label="Chat with Dr. Arunima Mustyala on WhatsApp">
        <svg aria-hidden="true" viewBox="0 0 32 32" width="25" height="25">
          <path fill="currentColor" d="M16.04 3A12.72 12.72 0 0 0 5.1 22.2L3 29l6.96-2.03A12.73 12.73 0 1 0 16.04 3Zm0 2.14a10.58 10.58 0 1 1-5.43 19.66l-.38-.23-4.13 1.2 1.24-4.02-.25-.4a10.58 10.58 0 0 1 8.95-16.21Zm-4.43 5.2c-.25 0-.65.1-.99.47-.34.38-1.3 1.27-1.3 3.1s1.33 3.6 1.52 3.85c.19.25 2.62 4 6.35 5.61.89.38 1.58.61 2.12.78.89.28 1.7.24 2.34.15.71-.1 2.19-.9 2.5-1.76.31-.87.31-1.61.22-1.76-.09-.16-.34-.25-.71-.44-.37-.18-2.19-1.08-2.53-1.2-.34-.13-.59-.19-.84.18-.25.38-.96 1.21-1.18 1.46-.22.25-.43.28-.8.09-.38-.19-1.58-.58-3-1.85a11.2 11.2 0 0 1-2.08-2.59c-.22-.37-.02-.57.16-.76.17-.17.38-.44.56-.66.19-.22.25-.37.38-.62.12-.25.06-.47-.03-.66-.1-.19-.84-2.02-1.15-2.77-.3-.73-.61-.63-.84-.64h-.71Z"/>
        </svg>
        <span>WhatsApp</span>
      </a>`;
  }
}

const componentDefinitions = [
  ["site-header", SiteHeader],
  ["site-footer", SiteFooter],
  ["callback-panel", CallbackPanel],
  ["clinic-assistant", ClinicAssistant],
  ["whatsapp-action", WhatsAppAction],
];

if (typeof customElements !== "undefined") {
  for (const [name, Component] of componentDefinitions) {
    if (!customElements.get(name)) customElements.define(name, Component);
  }
}
