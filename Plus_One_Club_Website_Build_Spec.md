# Plus One Club Ahmedabad — Website Build Specification

**Purpose:** Technical brief for the first public website.  
**Business source of truth:** `Plus_One_Club_Business_Reference.md`  
**Brand asset:** Use the supplied official logo image.  
**Status:** MVP / seven-day validation test  
**Budget:** ₹0 starting budget; use free tools only where their current terms permit the intended business use.

## 1. Primary goal

Build a trustworthy, polished, mobile-first website that turns visitors into:
- Customer enquiries for a non-sexual plus-one/companion for public events and outings.
- Applications from adults interested in becoming companions.

The website supports a seven-day demand test. Do not overbuild a marketplace, member portal, payment system, matching algorithm, or admin dashboard in V1.

## 2. Business and safety boundaries

- Service is for adults aged **18+** in Ahmedabad, India.
- Clearly describe the service as **non-sexual companionship** for public events and outings.
- Appropriate use cases include Garba, public events, cafés, and social outings.
- Do not imply sexual services, guaranteed romance, or guaranteed matches.
- Never fabricate reviews, testimonials, user counts, companion profiles, identity checks, credentials, availability, scarcity, success rates, or business credentials.
- A booking is **not confirmed** until both parties agree on the activity, date/time, public venue, duration, price/compensation, and cancellation terms.
- Make consent, boundaries, respectful conduct, and the right to decline explicit.
- Encourage first meetings in public places and discourage sharing sensitive personal information through initial forms.
- Collect only information needed to respond. Do not ask for government ID numbers, full home addresses, passwords, payment-card details, or unnecessary sensitive information.
- Never publish applicant contact details or private application information.
- Privacy and terms pages are starter documents, not claims of guaranteed legal compliance. Flag that the owner should review them before launch.

## 3. Brand and design

Use the official logo supplied in the project folder. Do not replace or redraw it unless a derived favicon is needed.

Brand direction:
- Midnight navy base.
- Electric purple and neon-lime accents.
- Modern, social, playful, premium, and trustworthy.
- Strong typography, deliberate spacing, clear hierarchy, tasteful motion, and restrained 3D-inspired details.
- Avoid generic dating-app visuals, escort-service cues, suggestive imagery, fake social proof, clutter, and excessive animation.
- Maintain readable contrast and comfortable tap targets.
- Use appropriate licensed imagery only; otherwise use CSS shapes, gradients, and abstract visuals.

## 4. Required pages and sections

### Home page
- Header with logo and clear navigation.
- Hero explaining the service in plain language.
- Primary CTA: **Find Your Plus-One**.
- Secondary CTA: **Join as a Companion**.
- Brief “How it works” steps.
- Use cases: public events, Garba, cafés, social outings, and other appropriate public activities.
- Safety, consent, and boundaries section.
- FAQ covering 18+, service scope, booking confirmation, costs/terms, cancellations, privacy, and how to join.
- Final CTA and footer with Instagram/contact links only when actual URLs/details are available.

### Customer enquiry page or section
- Explain that submitting a request is an enquiry, not a confirmed booking.
- Link to or embed the Customer Enquiry Google Form.
- Do not promise response times unless the owner has chosen and can meet them.

### Companion application page or section
- Explain the service, expectations, safety boundaries, and that an application is not acceptance or guaranteed paid work.
- Link to or embed the Companion Application Google Form.
- State that only adults aged 18+ may apply.

### Privacy page
- Explain what information the forms collect, why it is collected, who can access it, how to request correction/deletion, and a contact route.
- Use a placeholder for the owner's chosen contact email if none is supplied.
- Do not claim data is encrypted, deleted on a schedule, or compliant with a specific law unless implemented and verified.

### Terms and safety page
- Explain non-sexual service scope, mutual consent, public-meeting guidance, no guarantee of a match, booking confirmation conditions, cancellation terms, respectful conduct, and how to raise a concern.
- Use configurable placeholders where the owner must decide actual policies.
- Do not invent pricing or cancellation/refund rules.

### 404 page
- Friendly route-not-found message and a link back home, if supported by the framework.

## 5. Forms and Google Sheets integration

For the first MVP, prefer **Google Forms linked to Google Sheets** rather than a custom backend.

Create two forms:
1. **Plus One Club — Customer Enquiry**
2. **Plus One Club — Companion Application**

Google Forms should be the source of truth for intake. Each form should write responses to its own linked Google Sheet. Never put Google API secrets, service-account credentials, or private tokens in frontend code.

Keep these values in one clearly labelled configuration file:
- `CUSTOMER_FORM_URL`
- `COMPANION_FORM_URL`
- `INSTAGRAM_URL`
- `CONTACT_EMAIL` (optional)

If URLs are not yet available, use obvious placeholders and document how to replace them. Do not leave buttons pointing to `#`, empty URLs, or invented destinations.

For V1, opening a Google Form in a new tab is acceptable and easiest to maintain. Embedding is optional only if it works well on mobile and remains accessible. Do not implement a fake custom form that silently loses submissions.

### Suggested customer form fields
Use the separate form-building checklist for exact field wording. Collect the minimum needed: preferred name, contact method, confirmation of age 18+, activity, preferred date/time, approximate duration, area/public venue preference, optional budget or price-discussion preference, optional practical notes, and consent to be contacted about this request.

Do not ask for an exact home address or sensitive ID.

### Suggested companion application fields
Use the separate form-building checklist for exact field wording. Collect the minimum needed: preferred name, confirmation of age 18+, city/area, contact method, interests/activity comfort, general availability, optional compensation preference, optional short introduction, safety/boundary acknowledgement, and consent to be contacted about the application.

Do not publicly display applicant data.

## 6. Enquiry operations

Design the intake flow around manual, honest follow-up:
1. Customer submits an enquiry.
2. Owner reviews the request and checks for a suitable companion.
3. Owner discusses details with both parties separately as appropriate.
4. Both parties agree on the activity, date/time, public venue, duration, price/compensation, and cancellation terms.
5. Only then mark it confirmed in the tracker and send clear confirmation.
6. If no suitable match exists, say so honestly.

Suggested operational statuses:
- New
- Contacted
- Needs clarification
- Matching
- Awaiting mutual agreement
- Confirmed
- Completed
- Cancelled
- Closed / no match

Restrict Sheet access to the owner and trusted people who need it. Avoid storing more personal data than necessary.

## 7. Technical requirements

- Choose the simplest maintainable framework supported by the local environment. If starting fresh, use a lightweight stack suitable for static hosting.
- Responsive from small mobile screens upward.
- Semantic HTML and accessible forms/navigation.
- Keyboard navigation, visible focus states, accessible labels, sensible heading order, reduced-motion support, and strong contrast.
- SEO title/description, Open Graph metadata, canonical URL placeholder if needed, and a favicon derived from the supplied logo if feasible.
- Optimize images and avoid unnecessary dependencies.
- Add loading/error states only where actual dynamic behavior exists.
- No exposed secrets or credentials.
- No dead buttons or fake functionality.
- Avoid collecting personal data through analytics unless explicitly configured and disclosed.
- Include a README with setup, local run, build/test commands, form URL configuration, and deployment instructions.

## 8. Repository and deployment

Do not create a GitHub repository or deploy until the owner approves the local build.

Before deployment:
1. Run the production build and available lint/type checks.
2. Inspect mobile and desktop layouts.
3. Test every navigation link and CTA.
4. Submit a test response to each Google Form and verify it appears in the linked Sheet.
5. Verify that the site links to the correct live forms.
6. Ensure no private keys, applicant data, or internal notes are included in the repository.
7. Check the hosting provider's current terms for commercial/business use.
8. Provide exact repository and deployment steps.

## 9. Acceptance checklist

- [ ] Official supplied logo used correctly.
- [ ] Non-sexual 18+ service explained clearly.
- [ ] Customer and companion journeys are distinct.
- [ ] Customer CTA opens the real customer form.
- [ ] Companion CTA opens the real companion form.
- [ ] Both forms save responses into their own Google Sheets.
- [ ] No fabricated claims, testimonials, profiles, prices, or guarantees.
- [ ] Booking confirmation conditions explained clearly.
- [ ] Privacy and terms pages contain no unsupported compliance claims.
- [ ] Mobile and desktop layouts tested.
- [ ] All links, buttons, and navigation tested.
- [ ] Production build passes.
- [ ] README explains configuration and deployment.
- [ ] No repository or deployment created without owner approval.

## 10. Instructions to the AI builder

Inspect the business reference and logo before coding. Build the smallest complete, credible MVP that satisfies this specification. Make reasonable design and technical choices autonomously, but do not invent business facts or policies. Use placeholders for missing URLs/contact details, document them clearly, and continue building around them. Prioritize trust, conversion clarity, safety, mobile usability, and reliable enquiry capture over flashy effects or unnecessary features. When finished, report what works, what needs owner input, how to run it locally, and the next steps for repository creation and deployment.
