# BAYAN Credit Insights

==================================================================
BUILD BRIEF: BAYAN — Cognitive Credit Assessment Platform
==================================================================

I am building a B2B SaaS web application called BAYAN (بَيَان) — a 
cognitive computing platform for Malaysian Islamic banks. This is a 
university capstone project that I am presenting to Maybank, Bank 
Islam, and other Malaysian Islamic banking executives. The 
application must look and feel like a real production banking tool, 
not a student prototype.

Build a complete, polished, multi-screen React application using 
Vite + TypeScript + Tailwind CSS + shadcn/ui. Use mock data 
throughout — no backend required. Every interaction must work; no 
dead buttons.

=================================================================
[Watch the BAYAN Overview Video[]((https://drive.google.com/file/d/1rGpdMg0liamo7gTQINblEZfT6jaQuqSW/view?usp=sharing))

==================================================================
1. PRODUCT CONTEXT (READ THIS FIRST)
==================================================================

BAYAN is NOT a consumer app. It is used INSIDE Malaysian Islamic 
banks by loan officers to assess credit applications from B40 
households and gig economy workers (Grab drivers, Foodpanda riders, 
freelancers).

It runs two cognitive engines in parallel for every application:
  - CREDIT RISK ENGINE: XGBoost model with SHAP explainability, 
    trained on alternative income data
  - SHARIAH ENGINE: Large language model fine-tuned on Malaysian 
    JAKIM fatwa corpus and BNM Shariah Advisory Council resolutions, 
    detecting riba, gharar, maysir

The bank loan officer makes the final decision. BAYAN never 
auto-approves anything. This human-in-the-loop principle must be 
visible throughout the interface.

==================================================================
2. BRAND IDENTITY (USE EXACTLY THESE)
==================================================================

COLORS — implement as Tailwind theme extension:
  bayan-green-deep     #0F4F3E   primary buttons, sidebar, headers
  bayan-green-fresh    #5A8F35   success indicators
  bayan-gold-warm      #C9A961   accents, brand highlights
  bayan-cream          #FAF6EF   page background
  bayan-amber          #C28F25   credit risk engine accent
  bayan-coral          #A53D2E   shariah engine accent
  bayan-purple         #5D4E96   data pipeline accent
  bayan-blue           #2E5C8A   officer / approval accent
  
Standard semantic colors:
  success              #2E7D32   approved, low risk
  warning              #ED6C02   review needed, medium risk
  danger               #C62828   rejected, high risk

TYPOGRAPHY — load from Google Fonts:
  Display headings: "Cormorant Garamond" (serif, weight 500-600)
  Body and UI:      "Inter" (sans-serif, weight 400-500)
  Arabic text:      "Amiri" (Arabic serif)
  Monospace:        "JetBrains Mono" (for IDs and credit scores)

VISUAL STYLE:
  - Flat 2D design — no shadows except subtle focus rings
  - No gradients — solid fills only
  - Rounded corners — 8px medium, 12px large cards
  - Generous whitespace
  - 0.5px to 1px borders, never heavy
  - Subtle hover states (light tint background)
  - Sentence case throughout — never ALL CAPS, never Title Case
  - Cream page background (#FAF6EF), white cards

LOGO:
  Use "BAYAN" as a styled wordmark in deep green Cormorant Garamond. 
  Above it, render بَيَان in Amiri Arabic at warm gold. Below the 
  wordmark, add the tagline "Clear credit for the underserved" in 
  small italic warm gold.

==================================================================
3. APPLICATION STRUCTURE
==================================================================

ROUTING — use React Router DOM v6:

  /login                  Sign in screen
  /dashboard              Application queue (home after login)
  /assessment/new         New assessment form
  /assessment/processing  Live processing animation
  /assessment/:id/result  Results dashboard
  /assessment/:id/alternative  Smart product substitution
  /history                Application history (basic)
  /reports                Reports and audits (basic)
  /settings               Settings (basic)

DEFAULT REDIRECT: / should redirect to /login

AUTHENTICATION: mock only — accept any credentials and redirect to 
/dashboard. Use Zustand to store mock auth state.

STATE MANAGEMENT: Zustand for:
  - authStore (mock user, mock bank)
  - applicationsStore (the 6 sample applicants below)
  - assessmentStore (the currently selected application)

==================================================================
4. PERSISTENT LAYOUT (ALL ROUTES EXCEPT /login)
==================================================================

LEFT SIDEBAR (240px wide, fixed, deep green #0F4F3E):
  - BAYAN logo at top (white version), 120px wide
  - Below logo: small gold tagline "Cognitive credit for Islamic banks"
  - Navigation items (each with lucide-react icon):
      LayoutDashboard  Dashboard           /dashboard
      FilePlus         New assessment      /assessment/new
      History          Application history /history
      BarChart3        Reports & audits    /reports
      BookOpenText     Shariah Council     #
      Settings         Settings            /settings
  - Active item: lighter green background with gold left border
  - Hover state: slightly lighter green background
  - At bottom: bank logo placeholder + "Powered by BAYAN" in small 
    warm gold text

TOP BAR (height 64px, white background, 1px bottom border):
  - Page title on left (varies per route)
  - Search bar in centre (300px wide, placeholder "Search applicant 
    ID or name...")
  - Right side cluster:
    - Bell icon with red dot indicator (notifications)
    - Avatar circle with initials "AR" in deep green background
    - Name "Ahmad Razali" with small role "Senior Credit Officer" 
      below
    - Chevron down for dropdown menu (Profile, Sign out)

MAIN CONTENT AREA:
  - 240px left margin (for sidebar)
  - 64px top margin (for top bar)
  - Padding 32px
  - Background cream #FAF6EF

==================================================================
5. MOCK DATA (USE THESE EXACT APPLICANTS)
==================================================================

Create a Zustand store with these 6 applicants in 
applicationsStore.ts:

const applications = [
  {
    id: "APP-2026-0892",
    applicant: {
      name: "Aisha Binti Rahman",
      mykad: "920514-08-5462",
      age: 33,
      state: "Selangor",
      occupation: "Foodpanda rider",
      monthsActive: 8,
      avatarColor: "bg-coral-100",
      avatarInitials: "AR"
    },
    financing: {
      type: "Murabahah",
      amount: 8000,
      tenure: 24,
      purpose: "Working capital for warung at PJ"
    },
    submittedAt: "12 min ago",
    status: "review_needed",
    creditEngine: {
      score: 783,
      maxScore: 1000,
      defaultProbability: 0.21,
      decisionZone: "MANUAL_REVIEW",
      confidence: 0.87,
      topFactors: [
        { feature: "Gig monthly earnings", value: "RM 3,400", shap: -0.42, direction: "reduces" },
        { feature: "Utility on-time ratio", value: "94%", shap: -0.31, direction: "reduces" },
        { feature: "Debt-to-income ratio", value: "0.28", shap: -0.18, direction: "reduces" },
        { feature: "Months active as gig worker", value: "8 months", shap: 0.24, direction: "increases" },
        { feature: "Existing loans", value: "2", shap: 0.15, direction: "increases" }
      ]
    },
    shariahEngine: {
      verdict: "COMPLIANT",
      confidence: 0.94,
      checks: {
        riba: "NOT_DETECTED",
        gharar: "NOT_DETECTED",
        maysir: "NOT_DETECTED"
      },
      fatwaReferences: [
        "JAKIM e-Fatwa Resolution 142/2019: Murabahah financing for consumer goods",
        "BNM SAC Resolution 78/2021: Permissibility of automated risk assessment in Islamic financing",
        "Dar Al-Ifta Egypt Ruling 5821: Acceptable profit margins in Murabahah contracts"
      ]
    },
    fusion: {
      recommendation: "APPROVE",
      narrative_bm: "Pemohon Aisha Binti Rahman memohon pembiayaan Murabahah sebanyak RM 8,000 untuk tempoh 24 bulan. Sistem BAYAN telah menilai permohonan ini menggunakan dua enjin kognitif secara selari. Enjin Risiko Kredit memberikan skor 783/1000 (Zon Semakan Manual) dengan kebarangkalian gagal bayar 21%. Faktor utama yang menyumbang kepada penilaian ini adalah pendapatan gig bulanan pemohon (RM 3,400), rekod bayaran utiliti yang konsisten (94% tepat masa), dan nisbah hutang kepada pendapatan yang sihat (0.28). Walau bagaimanapun, tempoh aktiviti gig yang singkat (8 bulan) dan dua pinjaman sedia ada meningkatkan sedikit risiko. Enjin Pematuhan Shariah mengesahkan struktur kontrak Murabahah ini sebagai PATUH SYARIAH dengan keyakinan 94%. Tiada unsur riba, gharar, atau maysir dikesan. Penilaian ini berdasarkan e-Fatwa JAKIM (Resolusi 142/2019) dan Resolusi SAC BNM (78/2021). Cadangan: Permohonan disyorkan untuk diluluskan, tertakluk kepada semakan akhir oleh pegawai bank.",
      narrative_en: "Applicant Aisha Binti Rahman is requesting Murabahah financing of RM 8,000 over 24 months. BAYAN evaluated this application using two cognitive engines in parallel. The Credit Risk Engine returned a score of 783/1000 (Manual Review Zone) with a 21% default probability. Key contributing factors include the applicant's monthly gig earnings (RM 3,400), consistent utility payment history (94% on-time), and healthy debt-to-income ratio (0.28). However, the short gig tenure (8 months) and two existing loans add moderate risk. The Shariah Engine confirms this Murabahah contract structure as SHARIAH-COMPLIANT with 94% confidence. No elements of riba, gharar, or maysir were detected. Recommendation: Approve, subject to final officer review."
    }
  },
  
  {
    id: "APP-2026-0891",
    applicant: {
      name: "Daniel Tan Wei Ming",
      mykad: "881122-14-3398",
      age: 37,
      state: "Kuala Lumpur",
      occupation: "Grab driver",
      monthsActive: 28,
      avatarInitials: "DT"
    },
    financing: {
      type: "Tawarruq",
      amount: 15000,
      tenure: 36,
      purpose: "Vehicle maintenance and tyre replacement"
    },
    submittedAt: "24 min ago",
    status: "approved",
    creditEngine: {
      score: 871,
      defaultProbability: 0.09,
      decisionZone: "AUTO_APPROVE",
      confidence: 0.91,
      topFactors: [
        { feature: "Gig monthly earnings", value: "RM 4,800", shap: -0.58, direction: "reduces" },
        { feature: "Gig tenure", value: "28 months", shap: -0.36, direction: "reduces" },
        { feature: "Utility on-time ratio", value: "98%", shap: -0.29, direction: "reduces" },
        { feature: "Prior defaults", value: "0", shap: -0.21, direction: "reduces" },
        { feature: "Requested amount", value: "RM 15,000", shap: 0.08, direction: "increases" }
      ]
    },
    shariahEngine: {
      verdict: "COMPLIANT",
      confidence: 0.96,
      checks: { riba: "NOT_DETECTED", gharar: "NOT_DETECTED", maysir: "NOT_DETECTED" },
      fatwaReferences: [
        "BNM SAC Resolution 91/2020: Tawarruq financing for vehicle expenses",
        "JAKIM e-Fatwa Resolution 167/2021: Permissibility of commodity Murabahah"
      ]
    }
  },
  
  {
    id: "APP-2026-0890",
    applicant: {
      name: "Siti Nurhaliza Yusof",
      mykad: "751008-05-2256",
      age: 50,
      state: "Johor",
      occupation: "Shopee seller",
      monthsActive: 14,
      avatarInitials: "SY"
    },
    financing: {
      type: "Ijarah",
      amount: 22000,
      tenure: 48,
      purpose: "Speculative trading of cryptocurrency derivatives"
    },
    submittedAt: "1 hour ago",
    status: "rejected",
    creditEngine: {
      score: 612,
      defaultProbability: 0.72,
      decisionZone: "AUTO_REJECT",
      confidence: 0.83,
      topFactors: [
        { feature: "Prior defaults", value: "2", shap: 0.61, direction: "increases" },
        { feature: "Debt-to-income ratio", value: "0.71", shap: 0.44, direction: "increases" },
        { feature: "Existing loans", value: "4", shap: 0.32, direction: "increases" },
        { feature: "Gig monthly earnings", value: "RM 1,800", shap: 0.27, direction: "increases" },
        { feature: "Utility late count", value: "6 in 12 months", shap: 0.19, direction: "increases" }
      ]
    },
    shariahEngine: {
      verdict: "NON_COMPLIANT",
      confidence: 0.97,
      checks: { riba: "DETECTED", gharar: "DETECTED", maysir: "DETECTED" },
      reason: "The stated purpose involves cryptocurrency derivative trading, which contains excessive uncertainty (gharar) and speculation (maysir) elements prohibited under Shariah principles.",
      fatwaReferences: [
        "BNM SAC Resolution 102/2023: Position on cryptocurrency speculation",
        "JAKIM e-Fatwa Resolution 198/2022: Prohibition of derivatives trading"
      ],
      alternativeProducts: [
        {
          name: "Tawarruq financing for verified asset purchase",
          recommended: true,
          monthlyPayment: 540,
          profitRate: 6.8,
          description: "Cash-equivalent structure that requires documented use for permissible purposes."
        },
        {
          name: "Ijarah financing for productive equipment",
          recommended: false,
          monthlyPayment: 580,
          profitRate: 7.2,
          description: "Lease structure if the customer identifies a productive asset to acquire."
        }
      ]
    }
  },
  
  {
    id: "APP-2026-0889",
    applicant: {
      name: "Muhammad Faiz Hassan",
      occupation: "Grab driver",
      avatarInitials: "MF"
    },
    financing: { type: "Murabahah", amount: 5000, tenure: 18 },
    submittedAt: "1 hour ago",
    status: "approved"
  },
  
  {
    id: "APP-2026-0888",
    applicant: {
      name: "Lim Mei Ling",
      occupation: "Freelancer",
      avatarInitials: "LM"
    },
    financing: { type: "Personal", amount: 3000, tenure: 12 },
    submittedAt: "2 hours ago",
    status: "review_needed"
  },
  
  {
    id: "APP-2026-0887",
    applicant: {
      name: "Ahmad Iskandar Putra",
      occupation: "Foodpanda rider",
      avatarInitials: "AP"
    },
    financing: { type: "Murabahah", amount: 12000, tenure: 36 },
    submittedAt: "3 hours ago",
    status: "approved"
  }
];

==================================================================
6. SCREEN-BY-SCREEN BUILD INSTRUCTIONS
==================================================================

────────────────────────────────────────────────────────────────
SCREEN 1: LOGIN (/login)
────────────────────────────────────────────────────────────────

Layout: full-screen cream background, no sidebar, no top bar.

Top of page (centered):
  - BAYAN logo (large, 220px wide)
  - بَيَان in Amiri Arabic font, gold, 32px below the wordmark
  - Tagline "Cognitive credit for Malaysian Islamic banking" in small 
    italic warm gold

Login card (centered below logo):
  - White card, 440px wide, 48px padding, 12px radius
  - 1px light grey border
  - Heading: "Sign in to BAYAN" in Cormorant Garamond 28px
  - Subtext: "Use your bank employee credentials"
  - Input: "Bank employee ID" with User icon prefix
  - Input: "Password" with Lock icon prefix, eye toggle for show/hide
  - Checkbox: "Remember this device" with small text
  - Primary button (full width): "Sign in" — deep green, 48px tall, 
    white text
  - Divider: thin horizontal line with "or" in middle
  - Secondary button (full width, outline): "Sign in with bank SSO" 
    with shield icon
  - Small link below: "Forgot password? Contact your IT support"

Footer (below card, very small grey text):
  "Hosted on Microsoft Azure Malaysia West · BNM RMiT compliant · 
   PDPA 2010 protected · v1.0.0-beta"

BEHAVIOR:
  Clicking "Sign in" with any input → set mock auth state → redirect 
  to /dashboard

────────────────────────────────────────────────────────────────
SCREEN 2: APPLICATION QUEUE (/dashboard)
────────────────────────────────────────────────────────────────

Page title in top bar: "Application queue"

CONTENT FROM TOP TO BOTTOM:

Welcome header:
  - "Good morning, Ahmad" in Cormorant Garamond 24px
  - Subtext: "You have 12 applications pending review today." muted

Stats row — 4 metric cards, equal width, 12px gap:
  
  Card 1 — Today's applications
    - Icon: FileText (top left, 20px, deep green)
    - Label: "Today's applications" (12px muted)
    - Value: "18" (32px Cormorant Garamond)
    - Trend: "+3 vs yesterday" (small, success green)
  
  Card 2 — Auto-approved
    - Icon: CheckCircle (success green)
    - Label: "Auto-approved"
    - Value: "7"
    - Trend: "39% approval rate"
  
  Card 3 — Manual review
    - Icon: Eye (warning amber)
    - Label: "Manual review"
    - Value: "9"
    - Trend: "Awaiting officer decision"
  
  Card 4 — Auto-rejected
    - Icon: XCircle (danger red)
    - Label: "Auto-rejected"
    - Value: "2"
    - Trend: "Includes 1 Shariah rejection"
  
  Each card: light grey background (#F5F4F0), no border, 12px radius, 
  padding 20px.

Filter bar:
  Tab group: All (18) | Pending (12) | Reviewed (6) — pills, deep 
  green active
  Right side cluster:
    - Date range picker (small, "Today" selected)
    - Sort dropdown ("Newest first")
    - "Export CSV" button with Download icon

Applications table:
  
  Table header (sticky):
    Application ID | Applicant | Type | Amount | Submitted | BAYAN 
    status | Action
  
  Row design:
    - Hover: light grey background tint
    - Application ID: mono font, deep green, clickable
    - Applicant: avatar circle (initials) + name + occupation small 
      below
    - Type: pill badge with type-specific color
    - Amount: bold, RM prefix
    - Submitted: muted small
    - BAYAN status: solid pill badge (see status colors below)
    - Action: "Review" button (deep green outline) for pending, 
      "View" for processed
  
  Status pill colors:
    review_needed → warning amber bg, dark amber text, Eye icon
    approved      → success green bg, dark green text, CheckCircle 
                    icon
    rejected      → danger red bg, dark red text, XCircle icon
    processing    → blue bg, dark blue text, animated spinner
  
  Populate with all 6 mock applicants.

Bottom of table:
  Pagination: "Showing 1-6 of 18" left side, page controls right side

BEHAVIOR:
  Clicking "Review" or "View" on any row → navigate to 
  /assessment/{id}/result and load that applicant into 
  assessmentStore.
  
  Clicking the "New assessment" sidebar item → /assessment/new

────────────────────────────────────────────────────────────────
SCREEN 3: NEW ASSESSMENT FORM (/assessment/new)
────────────────────────────────────────────────────────────────

Page title in top bar: "New credit assessment"

Breadcrumb at top: Dashboard > New assessment

Page intro:
  - Heading: "Submit new application" Cormorant Garamond 28px
  - Subtext: "BAYAN will fetch consented financial data from the 
    connected sources and run a complete assessment in under 15 
    seconds."

Form layout — 3 cards stacked vertically with 24px gap. Each card has:
  - Card title with small icon (deep green)
  - Card body with form fields

CARD 1 — Applicant identification (User icon):
  2-column grid, 16px gap:
    Full name              (text input)
    MyKAD / NRIC number    (text input, mono font, placeholder 
                            "YYMMDD-PB-####")
    Mobile number          (text input, prefix +60)
    Email address          (text input)
    State                  (select: dropdown of Malaysian states)
    Age                    (number input)
  
  Below grid: button "Verify identity via MyDigital ID" (outline, 
  with Fingerprint icon)

CARD 2 — Financing request (Coins icon):
  
  Field 1 — Type of financing:
    Label: "Type of financing"
    4 large radio cards in a 2x2 grid:
      Murabahah  — "Cost-plus sale" — Tag icon
      Tawarruq   — "Commodity-based cash" — RefreshCw icon
      Ijarah     — "Islamic leasing" — Key icon
      Personal   — "General-purpose" — Wallet icon
    Selected card: deep green border 2px, light green tint background.
  
  Field 2 — Amount requested:
    Currency input with RM prefix, default RM 0
    Below: range slider, RM 1,000 to RM 50,000
  
  Field 3 — Tenure:
    Slider, 6 to 60 months, default 24
    Display selected value: "24 months"
  
  Field 4 — Purpose of financing:
    Textarea, 3 rows
    Placeholder: "Describe the customer's intended use of funds..."
  
  Field 5 — Employment type:
    Select dropdown:
      - Grab driver
      - Foodpanda rider
      - Shopee seller
      - Freelancer (specify)
      - Part-time worker
      - Other gig platform

CARD 3 — Data consent (Shield icon):
  
  Heading: "Customer-consented data sources"
  Subtext: "The customer has authorised BAYAN to access the following 
  data sources via Open Finance APIs. Toggle off any source the 
  customer has declined."
  
  4 data source toggle cards, vertical stack:
    [Toggle ON] Touch'n Go and Boost e-wallet
                  Last 6 months of transactions
                  Logo placeholder + Wallet icon
    
    [Toggle ON] Grab earnings
                  Last 12 months of gig income
                  Logo placeholder + Car icon
    
    [Toggle ON] Utility payment history
                  TNB, Indah Water, Telekom Malaysia — last 12 months
                  Logo placeholder + Plug icon
    
    [Toggle ON] CCRIS and CTOS credit bureau
                  Standard credit history
                  Logo placeholder + FileBarChart icon
  
  Below the toggles:
    Checkbox (required): "Customer has signed PDPA 2010 consent form"
    Subtext small grey: "All data is processed within Microsoft Azure 
    Malaysia West region. No data leaves Malaysia."

STICKY ACTION BAR at bottom of viewport:
  Left: "Cancel" (text button)
  Right cluster:
    "Save as draft" (outline button)
    "Run BAYAN assessment" (primary deep green, large, with 
    ArrowRight icon)

BEHAVIOR:
  Clicking "Run BAYAN assessment":
    - If required fields filled and PDPA checkbox ticked
    - Create a new application in store with status "processing"
    - Navigate to /assessment/processing
    - Otherwise: shake action bar and highlight missing fields

────────────────────────────────────────────────────────────────
SCREEN 4: LIVE PROCESSING (/assessment/processing)
────────────────────────────────────────────────────────────────

Layout: sidebar + top bar + centered processing panel.

Centered card, 600px wide, white, 32px padding, 12px radius:
  
  Heading: "Running BAYAN assessment"
  Subtext: "Please do not close this window. Estimated time: 8 to 12 
  seconds."
  
  Five processing steps in a vertical list with connectors:
    
    Step 1 — DATA INGESTION
      Icon container: purple circle with Database icon
      Title: "Data ingestion"
      Subtitle: "Fetching consented data from 4 sources..."
      Status: starts pending → in-progress → completed
      Completed shows: green check + time elapsed "1.2s"
    
    Step 2 — KAFKA PIPELINE
      Icon: purple circle with Layers icon
      Title: "Apache Kafka aggregation"
      Subtitle: "Normalising and logging events to immutable audit 
      trail..."
      "0.8s"
    
    Step 3 — CREDIT RISK ENGINE
      Icon: amber circle with TrendingUp icon
      Title: "Credit risk engine"
      Subtitle: "Running XGBoost with SHAP explainability..."
      "3.4s"
    
    Step 4 — SHARIAH ENGINE
      Icon: coral circle with BookOpenText icon
      Title: "Shariah compliance engine"
      Subtitle: "Verifying against JAKIM and SAC fatwa corpus..."
      "3.1s"
    
    Step 5 — DECISION FUSION + NLG
      Icon: teal circle with MessageSquareText icon
      Title: "Decision fusion and explanation"
      Subtitle: "Generating Bahasa Malaysia narrative..."
      "1.5s"
  
  Below the steps:
    Overall progress bar (deep green fill)
    Below bar: "Step 3 of 5 — Credit risk engine analysing..."
  
  Bottom of card:
    Small link: "Cancel assessment" (muted grey)

BEHAVIOR:
  - On mount: start animation sequence
  - Step 1: 0 to 1.2 seconds — show spinner then check
  - Step 2: 1.2 to 2.0 seconds — show spinner then check  
  - Steps 3 and 4 run in PARALLEL — visually show both spinners 
    active at the same time from 2.0 to 5.4 seconds
  - Step 5: 5.4 to 6.9 seconds
  - Progress bar advances smoothly throughout
  - At 7.0 seconds: auto-navigate to 
    /assessment/{newApplicationId}/result
  - Or accelerate to 4 seconds total if user clicks anywhere (skip 
    animation)

────────────────────────────────────────────────────────────────
SCREEN 5: RESULTS DASHBOARD 
(/assessment/:id/result) — THE MOST IMPORTANT SCREEN
────────────────────────────────────────────────────────────────

Page title in top bar: "Assessment result"

Top of page — Applicant header bar (white card, 24px padding):
  Left side:
    Avatar circle (48px, with initials)
    Vertical text stack:
      Name: "Aisha Binti Rahman" Cormorant Garamond 22px
      Subtitle: "APP-2026-0892 · 33 yo · Selangor · Foodpanda rider"
  
  Right side:
    Status pill: "REVIEW NEEDED" warning amber
    Action buttons (small):
      "Print PDF" outline
      "Back to queue" outline

Recommendation banner (full width, below applicant header):
  Background tint based on recommendation:
    APPROVE → success green tint with green left border
    REVIEW  → warning amber tint with amber left border
    REJECT  → danger red tint with red left border
  
  Content:
    Large badge: "RECOMMENDATION: REVIEW MANUALLY"
    Subtitle: "BAYAN confidence: 87% · Credit zone is borderline. 
    Officer review recommended."
    Right side: confidence meter (circular, 87%)

CONTENT GRID — 2 equal columns, 24px gap:

LEFT COLUMN — Credit Risk Engine card:
  Card with amber accent band at top:
    Icon: TrendingUp in amber
    Title: "Credit risk engine"
    Subtitle: "XGBoost + SHAP explainable AI"
  
  Body of card:
    
    BAYAN credit score section (centered):
      Half-circle gauge from 600 to 1000
      Filled portion: amber color, ending at 783
      Big number in center: "783" (Cormorant Garamond 56px, deep 
      green)
      Below number: "/1000" small muted
      Below score: "Default probability: 21%"
      Decision zone pill: "MANUAL REVIEW" amber
    
    Divider line
    
    SHAP top factors section:
      Heading small: "Top contributing factors (SHAP)"
      Subtext: "Negative bars reduce risk, positive bars increase 
      risk."
      
      5 horizontal bars, each row:
        - Feature name (left, 14px)
        - Value below name (12px muted, e.g. "RM 3,400")
        - Horizontal bar — centered at zero, extending left (green) 
          for negative SHAP and right (red) for positive SHAP
        - SHAP value at end of bar
      
      Use these exact 5 factors from the mock data for Aisha.
    
    Divider line
    
    Footer link: "View full SHAP analysis" with ExternalLink icon

RIGHT COLUMN — Shariah Engine card:
  Card with coral accent band at top:
    Icon: BookOpenText in coral
    Title: "Shariah compliance engine"
    Subtitle: "Fine-tuned LLM on fatwa corpus"
  
  Body of card:
    
    Verdict section (centered):
      Large pill badge: "SHARIAH COMPLIANT" success green large
      Below: "94% confident"
      Decorative Islamic geometric pattern in light coral 
      (subtle background)
    
    Divider line
    
    Contract structure check:
      Heading small: "Prohibited elements scan"
      3 rows, each with status icon + label:
        ✓ Riba (interest)                    NOT DETECTED  green
        ✓ Gharar (excessive uncertainty)     NOT DETECTED  green
        ✓ Maysir (gambling)                  NOT DETECTED  green
      
      For rejected case (Siti Nurhaliza):
        ✗ Riba              DETECTED        red
        ✗ Gharar            DETECTED        red
        ✗ Maysir            DETECTED        red
    
    Divider line
    
    Fatwa references consulted:
      Heading small: "Fatwa corpus references"
      Bullet list of 3 fatwa references (small text):
        Each item with BookOpenText icon
        Reference text from mock data
    
    Divider line
    
    Footer link: "View full Shariah analysis"

FULL-WIDTH NLG CARD (below the 2-column grid):
  Card with teal accent band:
    Icon: MessageSquareText in teal
    Title: "Bahasa Malaysia explanation"
    Subtitle: "Auto-generated officer narrative"
    Right side: toggle "BM / EN" (Bahasa Malaysia / English)
  
  Body:
    Render the narrative_bm text from mock data in Inter font, 16px, 
    line-height 1.7
    Toggle switches to narrative_en
    Use lang="ms" attribute for Bahasa Malaysia content

STICKY ACTION BAR at bottom of viewport:
  Left: "Request more info from customer" (text button, with 
  MessageCircle icon)
  Centre: "Reject application" (outline danger red)
  Right: "Approve and disburse" (primary deep green, large, with 
  CheckCircle icon)

BEHAVIOR:
  Clicking "Approve and disburse":
    Show confirmation modal: "Approve RM 8,000 Murabahah financing 
    for Aisha Binti Rahman?"
    Buttons: Cancel / Confirm approval
    On confirm: update application status to "approved", show success 
    toast, navigate back to /dashboard
  
  Clicking "Reject application":
    Show confirmation modal: "Reject this application?"
    Textarea for rejection reason
    On confirm: update status to "rejected", toast, back to dashboard
  
  If the application's shariahEngine.verdict is "NON_COMPLIANT":
    The recommendation banner shows in red
    Below it, a notice banner appears: "Smart Product Substitution 
    available — view alternatives" with a button that navigates to 
    /assessment/{id}/alternative

────────────────────────────────────────────────────────────────
SCREEN 6: ALTERNATIVE PRODUCT SUGGESTION 
(/assessment/:id/alternative)
────────────────────────────────────────────────────────────────

This screen renders when shariahEngine.verdict is "NON_COMPLIANT" 
and alternatives are available (the Siti Nurhaliza case).

Page title: "Alternative Shariah-compliant products"

Breadcrumb: Dashboard > Assessment APP-2026-0890 > Alternatives

Top alert card (coral red tint with red left border):
  Icon: AlertTriangle in coral red
  Heading: "Original financing structure is non-compliant"
  Body: "The Shariah engine has detected riba, gharar, and maysir 
  elements in the proposed Ijarah structure. The applicant's stated 
  purpose involves cryptocurrency derivatives trading, which contains 
  prohibited speculation under Shariah principles. BAYAN's Smart 
  Product Substitution Matrix has identified two compliant 
  alternatives."

Two alternative product cards side by side (24px gap):

CARD 1 — Recommended (Tawarruq):
  Border: 2px deep green
  Top: "RECOMMENDED" badge in warm gold
  Icon: RefreshCw (large, deep green)
  Title: "Tawarruq financing" Cormorant Garamond 24px
  
  Description:
  "A Shariah-compliant cash-equivalent structure where the bank 
  purchases commodities on the customer's behalf and sells them to 
  the customer with deferred payment. The customer can then sell the 
  commodities for cash, achieving the same liquidity outcome as a 
  conventional loan while remaining compliant with Islamic 
  jurisprudence."
  
  Specification table:
    Original Ijarah amount:    RM 22,000
    Tawarruq equivalent:       RM 22,000
    Profit rate (p.a.):        6.8%
    Monthly payment:           RM 540
    Tenure:                    48 months
    Total payback:             RM 25,920
    Shariah verdict:           COMPLIANT (green badge)
  
  Required conditions (small grey bullet list):
    - Customer must use funds for permissible purposes only
    - Bank disburses to verified merchant accounts where possible
    - Quarterly purpose audits during financing tenure
  
  Action: "Select Tawarruq" primary deep green button

CARD 2 — Alternative (Ijarah for productive asset):
  Border: 1px light grey
  Icon: Key (in deep green)
  Title: "Ijarah financing for productive equipment"
  
  Description:
  "An Islamic leasing structure where the bank purchases a productive 
  asset and leases it to the customer. Suitable only if the customer 
  identifies a specific permissible asset to acquire (such as 
  business equipment, vehicles, or trade tools)."
  
  Specification table:
    Asset value:               RM 22,000
    Lease tenure:               48 months
    Monthly lease:             RM 580
    Total:                     RM 27,840
    Shariah verdict:           COMPLIANT (subject to asset 
                               verification)
  
  Required conditions:
    - Customer must specify and verify the productive asset
    - Asset becomes customer's property after final lease payment
    - Asset must be Shariah-permissible
  
  Action: "Select Ijarah" outline button

Below both cards:
  Two text links centered:
    "Why was the original product rejected? View Shariah reasoning" 
    → opens modal with detailed reasoning
    "Reject application entirely instead" → opens confirmation 
    rejection modal

BEHAVIOR:
  Clicking "Select Tawarruq":
    Confirmation modal: "Proceed with Tawarruq financing instead?"
    On confirm: update application with new product type, re-run 
    Shariah check (simulated, returns COMPLIANT), navigate to 
    /assessment/{id}/result with updated data

==================================================================
7. ANIMATIONS AND MICROINTERACTIONS
==================================================================

USE THESE LIBRARIES:
  framer-motion for transitions
  react-spring optional
  
KEY ANIMATIONS:
  - Page transitions: 200ms fade
  - Card hover: subtle 1px border darkening
  - Button press: 0.97 scale on active
  - Status pill: pulse animation when status is "processing"
  - SHAP bars: animated width grow from 0 on mount (400ms ease-out)
  - Credit score gauge: animated sweep from 600 to actual score 
    (600ms)
  - Processing screen step transitions: 200ms slide + checkmark draw
  - Toast notifications: slide from top-right, 3 second auto-dismiss

==================================================================
8. ACCESSIBILITY
==================================================================

  - All form inputs have aria-labels
  - Color is never the only indicator (always pair with icon)
  - Focus rings on all interactive elements
  - Skip-to-content link at top of page
  - Bahasa Malaysia text has lang="ms"
  - Arabic text has lang="ar" dir="rtl"
  - Minimum 14px text, 12px only for captions
  - Color contrast 4.5:1 minimum

==================================================================
9. TECH SETUP
==================================================================

DEPENDENCIES (add to package.json):
  react@^18
  react-dom@^18
  react-router-dom@^6
  typescript@^5
  vite@^5
  tailwindcss@^3
  @tailwindcss/forms
  zustand
  framer-motion
  lucide-react
  recharts
  date-fns
  clsx
  
  shadcn/ui components (install via shadcn CLI):
    - button
    - card
    - input
    - label
    - select
    - checkbox
    - badge
    - dialog
    - dropdown-menu
    - avatar
    - tooltip
    - separator
    - sheet
    - toast

FONTS — load from Google Fonts in index.html:
  Cormorant Garamond 500, 600
  Inter 400, 500, 600
  Amiri 400, 700
  JetBrains Mono 400

TAILWIND CONFIG — extend theme with:
  colors: {
    'bayan-green': { deep: '#0F4F3E', fresh: '#5A8F35' },
    'bayan-gold': { warm: '#C9A961' },
    'bayan-cream': '#FAF6EF',
    'bayan-amber': '#C28F25',
    'bayan-coral': '#A53D2E',
    'bayan-purple': '#5D4E96',
    'bayan-blue-officer': '#2E5C8A'
  }
  fontFamily: {
    'display': ['Cormorant Garamond', 'serif'],
    'sans': ['Inter', 'sans-serif'],
    'arabic': ['Amiri', 'serif'],
    'mono': ['JetBrains Mono', 'monospace']
  }

==================================================================
10. WHAT NOT TO DO
==================================================================

  ✗ Do not invent screens not listed above
  ✗ Do not add consumer/customer-facing screens
  ✗ Do not show payment processing, PayNet, or money movement
  ✗ Do not add chat or messaging with customer
  ✗ Do not use stock photos of people in dashboards
  ✗ Do not use generic "lorem ipsum" — use the real mock data above
  ✗ Do not use purple/blue startup gradients
  ✗ Do not auto-approve anything without officer confirmation modal
  ✗ Do not skip the Bahasa Malaysia narrative text — render it 
     verbatim
  ✗ Do not use any color outside the brand palette specified
  ✗ Do not change "Bahasa Malaysia" to "Malay" — use the formal name
  ✗ Do not put dead/disabled buttons — every interaction must work
  ✗ Do not skip the alternative product screen — it demonstrates the 
     Smart Product Substitution innovation

==================================================================
11. DEFINITION OF DONE
==================================================================

The application is ready for Maybank executive review when:

  ✓ All 6 screens render correctly with no console errors
  ✓ Navigation between all screens works
  ✓ Login redirects to dashboard
  ✓ Clicking applicants in queue loads their data into result screen
  ✓ "New assessment" form leads to processing animation, which leads 
     to results
  ✓ Non-compliant Shariah case (Siti Nurhaliza) shows alternative 
     products screen
  ✓ Approve/reject confirmation modals work and update state
  ✓ Bahasa Malaysia narrative renders correctly with proper font
  ✓ SHAP bars and credit gauge animate on mount
  ✓ Mobile responsive (collapses sidebar to hamburger menu under 
     1024px)
  ✓ No "coming soon" placeholders — everything is real
  ✓ Page titles update correctly in top bar per route
  ✓ All Tabler/Lucide icons render correctly
  ✓ Branding (BAYAN logo + Arabic wordmark) appears on login and 
     sidebar

DEPLOYMENT:
  Deploy to a custom domain or bayan.lovable.app subdomain
  Make sure favicon is the BAYAN crescent logo
  Page title in browser tab: "BAYAN — Cognitive credit assessment"

==================================================================
END OF BRIEF — BUILD WITH PRECISION
==================================================================

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bayansystem.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/712c8e88-ae79-45ef-b0d3-4c7618229492).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
