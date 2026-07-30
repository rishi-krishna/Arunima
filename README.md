# Arunima Mustyala Clinic

A static, multi-page clinic website for Arunima Mustyala. The project uses semantic HTML, shared CSS, small ES modules, and Web Components; it has no framework, package installation, database, or build step.

The repository currently contains 40 HTML documents, including the homepage, branded 404 page, practitioner and evidence pages, treatment and pricing pages, booking/contact/journey demonstrations, seven articles, eight location pages, and three policy pages.

## Run locally

From the project root:

```powershell
python -m http.server 4173
```

Open [http://localhost:4173/](http://localhost:4173/).

Root-absolute asset and route links are used throughout the site, so serve the project root rather than opening individual HTML files directly.

## Verify

Run the automated tests and static-site verifier:

```powershell
node --test tests/*.test.mjs
node scripts/verify-site.mjs
```

Before committing, also check whitespace and repository state:

```powershell
git diff --check
git status --short
```

The verifier checks required metadata and shared elements, local links and assets, duplicate IDs, heading structure, legacy remote references, and the complete route set.

## Project structure

```text
arunima/
├── index.html                  # Homepage
├── 404.html                    # Branded not-found page
├── about/, approach/           # Practitioner and care approach
├── treatments/                 # Treatment index
├── *-treatment/                # Six treatment detail routes
├── pricing/                    # Program tiers and fees
├── research/, case-studies/    # Evidence and clinical narratives
├── patient-reviews/            # Review summaries
├── patient-stories/            # Patient journey narratives
├── blog/                       # Article index and seven articles
├── locations/                  # Service-area index and seven locations
├── book-appointment/           # Demonstration booking flow
├── contact/                    # Contact details and demo form
├── my-journey/                 # Demonstration patient-account UI
├── privacy-policy/
├── terms-of-service/
├── teleconsultation-policy/
├── assets/
│   ├── css/styles.css          # Shared visual system
│   ├── images/                 # Local placeholder artwork
│   └── js/                     # Configuration, components, interactions, forms
├── scripts/verify-site.mjs
└── tests/
```

Each public route is a real `index.html` document. Shared navigation, footer, cookie notice, callback panel, and clinic assistant are rendered by the custom elements in `assets/js/components.js`.

## Update clinic details

The clinic identity and commonly repeated details are centralized in:

```text
assets/js/site-config.js
```

Edit that file to update the practitioner name, clinic name, credentials, registration, board, experience, patient/review figures, phone links, WhatsApp link, email, address, or assessment price. Shared components and page elements marked with `data-clinic-field` use these values.

Some location and policy copy intentionally prints contact details directly so the documents remain readable without JavaScript. After changing contact or registration details, search for the old value and update any retained document copy:

```powershell
rg "90665 62562|drnehasclinic@gmail.com|PR-3641/H/2025|Ganesh Plaza"
```

Then run the full verification commands.

## Forms and patient information

All booking, contact, newsletter, sign-in, registration, callback, and journey interfaces are presentation-only demonstrations. They do not transmit, store, or create patient records.

Do not enter real patient or sensitive health information while the site remains a static demonstration. A production launch requires a secure backend, appropriate consent and privacy controls, access restrictions, retention rules, and an approved healthcare-data workflow.

## Replace placeholder images

The artwork in `assets/images/` is local placeholder media:

- `hero-placeholder.svg`
- `portrait-placeholder.svg`
- `article-placeholder.svg`
- `logo-mark.svg`

Replace placeholders with approved, licensed clinic assets while preserving the existing filenames to avoid HTML changes. If filenames change, update every reference and rerun `node scripts/verify-site.mjs`.

For production images, use appropriately sized WebP, AVIF, or optimized SVG files; retain meaningful alternative text for informative images and empty alternative text for decorative media.

## Deployment notes

Deploy the project as a static site with the repository root as the public directory. The host should:

- Serve directory routes from their `index.html` files.
- Use `404.html` as the not-found document.
- Serve files over HTTPS.
- Preserve UTF-8 encoding.
- Configure appropriate security, caching, and content policies before production use.

Forms will remain non-functional until they are deliberately connected to a reviewed backend.
