import { clinic } from "./site-config.js?v=20260821d";

const BaseElement = typeof HTMLElement === "undefined" ? class {} : HTMLElement;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

class SiteHeader extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    this.innerHTML = `
      <header class="site-nav">
        <div class="container site-nav__inner">
          <a class="site-brand" href="#main-content" aria-label="${escapeHtml(clinic.clinicName)} home">
            <img src="assets/images/nirmaya-logo-mark-transparent.png" alt="" width="54" height="36">
            <span>${escapeHtml(clinic.practitioner)}</span>
          </a>
          <div class="site-nav__actions">
            <button class="theme-toggle" type="button" data-theme-toggle
              aria-label="Switch to dark theme" title="Switch theme">
              <span aria-hidden="true" data-theme-icon>☾</span>
            </button>
            <a class="site-nav__whatsapp" href="${clinic.whatsappHref}" target="_blank"
              rel="noopener noreferrer" aria-label="Chat with Dr. Arunima Musthyala on WhatsApp">
              WhatsApp
            </a>
            <a class="button button--primary site-nav__account" href="#consultation-booking">
              Book Consultation
            </a>
          </div>
        </div>
      </header>`;
  }
}

class SiteFooter extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";
    const year = new Date().getFullYear();

    this.innerHTML = `
      <footer class="site-footer">
        <div class="container site-footer__minimal">
          <p><strong>${escapeHtml(clinic.clinicName)}</strong></p>
          <p>This website does not provide emergency care. For a medical emergency,
            contact local emergency services or go to the nearest hospital.</p>
          <p>© ${year} ${escapeHtml(clinic.clinicName)}. All rights reserved.</p>
        </div>
      </footer>`;
  }
}

class WhatsAppAction extends BaseElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <a class="whatsapp-action" href="${clinic.whatsappHref}" target="_blank"
        rel="noopener noreferrer" aria-label="Chat with Dr. Arunima Musthyala on WhatsApp">
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
  ["whatsapp-action", WhatsAppAction],
];

if (typeof customElements !== "undefined") {
  for (const [name, Component] of componentDefinitions) {
    if (!customElements.get(name)) customElements.define(name, Component);
  }
}
