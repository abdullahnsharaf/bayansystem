## BAYAN rebuild plan

I will rebuild the app as a complete executive-ready BAYAN demo, using your brief as the behavioral source of truth and the attached mockups to guide layout, spacing, and visual polish. I will also include both extra working screens shown in the references: Shariah Council and Help & support.

### What I’ll build

1. **Replace the placeholder app with the BAYAN foundation**
   - Set `/` to redirect to `/login`
   - Rework the app into the BAYAN screen structure:
     - `/login`
     - `/dashboard`
     - `/assessment/new`
     - `/assessment/processing`
     - `/assessment/:id/result`
     - `/assessment/:id/alternative`
     - `/history`
     - `/reports`
     - `/settings`
     - plus real basic screens for **Shariah Council** and **Help & support**
   - Add a persistent authenticated layout with fixed sidebar, top bar, skip link, responsive mobile sheet menu, and route-aware page titles

2. **Implement the BAYAN design system and brand identity**
   - Apply the exact BAYAN palette as semantic tokens in `src/styles.css`
   - Load the specified fonts in the document head and wire font tokens for display, UI, Arabic, and mono text
   - Build the BAYAN wordmark/logo treatment for login and sidebar
   - Match the required visual language: flat 2D, cream background, white cards, restrained borders, no gradients, subtle hover/focus states, sentence case UI
   - Update browser title/metadata to `BAYAN — Cognitive credit assessment`

3. **Set up mock state and reusable app primitives**
   - Create Zustand stores for:
     - `authStore`
     - `applicationsStore` using your 6 exact applicants
     - `assessmentStore` for selected/current application flow
   - Add shared UI helpers/components for status badges, metric cards, search bar, sidebar nav, breadcrumbs, applicant header, confirmation dialogs, and toasts
   - Ensure every button and menu is wired to a real interaction with mock state changes

4. **Build the core assessment journey end-to-end**
   - **Login**: mock credential entry, password visibility toggle, remember device checkbox, mock sign-in redirect to dashboard
   - **Dashboard**: stats row, filter tabs, table of all 6 applications, clickable review/view actions that load the correct applicant into the assessment flow
   - **New assessment**: full multi-card form, financing type cards, sliders, consent toggles, field validation, draft/save behavior, create-processing-application flow
   - **Processing**: animated multi-step assessment timeline with parallel credit/shariah stages, skip acceleration on click, auto-transition to result
   - **Result**: recommendation banner, animated credit gauge, SHAP bars, Shariah verdict card, fatwa references, BM/EN narrative toggle, approval/rejection flows with confirmation modals and toasts
   - **Alternative products**: full non-compliant case for Siti Nurhaliza, reasoning modal, compliant substitution selection, simulated re-run, return to updated result

5. **Build the supporting screens from the brief and references**
   - **History**: filterable table with statuses and outcomes
   - **Reports & audits**: polished basic reporting screen with meaningful mock metrics/charts/tables
   - **Settings**: basic officer/bank settings page with working mock toggles/actions
   - **Shariah Council**: guidelines/rulings/oversight screen based on the provided reference
   - **Help & support**: FAQ/resources/support/status screen based on the provided reference

6. **Polish, motion, and accessibility**
   - Add framer-motion page fades, hover/press motion, processing transitions, SHAP/gauge mount animations, and toast behavior
   - Ensure labels/aria attributes, keyboard support, visible focus rings, `lang="ms"` and `lang="ar"`, icon+color pairing for statuses, and responsive behavior below 1024px
   - Make sure there are no dead ends, no placeholder sections, and no console/runtime issues in the main flows

### Technical notes

- You asked to **migrate the stack**, so I will reshape the current app structure substantially to match the requested BAYAN experience rather than lightly skin the existing placeholder.
- I’ll preserve compatibility with the current project environment where needed, but the delivered experience will follow your requested routing, state model, screen set, and visual system.
- I’ll use the existing UI primitives already present in the project where helpful, then add only the missing pieces needed for BAYAN.

### Validation checklist

Before finishing, I’ll verify:
- login redirects correctly
- dashboard row actions load the correct applicant
- new assessment creates a processing case and lands on results
- non-compliant Shariah case reaches alternatives and can be converted
- approve/reject flows update mock state and return to dashboard
- page titles/top-bar labels stay in sync
- mobile navigation works under 1024px
- branding, fonts, Bahasa Malaysia narrative, and animations render cleanly