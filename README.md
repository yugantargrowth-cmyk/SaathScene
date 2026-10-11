# SaathScene Ahmedabad — Official Website

> **Positioning:** Ahmedabad-first, non-sexual social companionship service for adults 18+.  
> **Brand Palette:** Deep Teal `#0F3D35` | Teal `#14B8A6` | Sand `#F4EDE7` | Slate `#6B7280` | Charcoal `#111827` | White `#FFFFFF`.

---

## 1. Quick Start & Local Run

You can run this project locally using either **Vite** or the built-in zero-dependency **Node server**.

### Option A: Standard Dev Server (Vite)
```bash
npm run dev
```
Opens at `http://localhost:3000` with hot module replacement (HMR).

### Option B: Lightweight Node Static Server (No external build needed)
```bash
npm start
```
Starts `serve.js` listening on `http://localhost:3000`.

### Production Build:
```bash
npm run build
```
Generates the optimized static distribution inside `dist/`.

---

## 2. Project Architecture & File Structure

```text
├── index.html                   # Mobile-first homepage with Hero, Garba, Cafes, Steps, Safety, Forms & FAQ
├── privacy.html                 # Privacy notice starter statement
├── terms.html                   # Terms of service, safety boundaries & code of conduct
├── 404.html                     # Route fallback page
├── package.json                 # Project configuration (Vite, build & serve scripts)
├── serve.js                     # Zero-dependency Node.js HTTP server
├── vite.config.js               # Multi-page build configuration
├── src/
│   ├── app.js                   # Interactive logic: Mobile nav, form validation, honest feedback & WhatsApp links
│   ├── config.js                # Central configuration (WhatsApp number, forms, social handles)
│   └── styles.css               # Official brand design system (Plus Jakarta Sans, deep teal, sand)
└── public/
    ├── brand/                   # Exact official SaathScene vector & raster logos (copied from Brand Kit)
    └── images/                  # Master lifestyle photo library (Garba, Cafes, Heritage walks, Food streets)
```

---

## 3. Configuration & Integrations (`src/config.js`)

Edit `src/config.js` to plug in live operational accounts before launch:

| Variable | Description | Default Prototype Value |
|---|---|---|
| `WHATSAPP_NUMBER` | WhatsApp number for direct client chat (no `+`) | `'919876543210'` |
| `CUSTOMER_GOOGLE_FORM_URL` | Live Google Form URL for customer intake | Placeholder URL |
| `COMPANION_GOOGLE_FORM_URL` | Live Google Form URL for companion 18+ intake | Placeholder URL |
| `INSTAGRAM_HANDLE` | Official Instagram handle | `'@saathscene.ahmedabad'` |
| `CONTACT_EMAIL` | Official contact email | `'hello@saathscene.in'` |

---

## 4. How the Prototype Forms Work (Honest Feedback)

1. **Customer Enquiry Form:**
   - Validates that the user is **18+** and collects only minimal public outing preferences.
   - Saves the submission safely to browser `localStorage` (key: `saathscene_customer_enquiries`).
   - Displays an honest feedback screen stating that the submission is logged locally for the pilot.
   - Provides a one-click button to **send the structured enquiry directly via WhatsApp** with prefilled details.

2. **Companion Application Form (18+):**
   - Requires explicit adult 18+ verification and acceptance of the strict **non-sexual conduct code**.
   - Collects preferred public activities, availability, and introduction.
   - Saves locally (`saathscene_companion_applications`) and offers a direct WhatsApp intro link.

---

## 5. Launch Blockers & Missing Integrations (Pre-Launch Checklist)

Before making this site public or driving paid traffic:
1. **WhatsApp & Phone Ownership:** Update `src/config.js` with the real owner's WhatsApp number.
2. **Intake Backend / Google Forms:** Create the two live Google Forms linked to Google Sheets for intake tracking, or connect a backend webhook.
3. **Legal & Terms Review:** Review `terms.html` and `privacy.html` with appropriate counsel for Gujarat/India regulations.
4. **Domain & SSL:** Deploy `dist/` to your chosen host (e.g. Cloudflare Pages, Vercel, Netlify) and attach `saathscene.in` or preferred domain.
5. **No Deployment Without Approval:** Repository creation and public publishing remain on hold awaiting owner instruction.
