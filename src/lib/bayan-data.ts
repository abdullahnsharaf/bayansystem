import type { ApplicationRecord } from "@/lib/types";

export const malaysianStates = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Kuala Lumpur",
  "Labuan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Penang",
  "Perak",
  "Perlis",
  "Putrajaya",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
];

export const financingTypes = [
  { value: "Murabahah", label: "Murabahah", description: "Cost-plus sale" },
  { value: "Tawarruq", label: "Tawarruq", description: "Commodity-based cash" },
  { value: "Ijarah", label: "Ijarah", description: "Islamic leasing" },
  { value: "Personal", label: "Personal", description: "General-purpose" },
];

export const employmentTypes = [
  "Grab driver",
  "Foodpanda rider",
  "Shopee seller",
  "Freelancer (specify)",
  "Part-time worker",
  "Other gig platform",
];

export const applications: ApplicationRecord[] = [
  {
    id: "APP-2026-0892",
    applicant: {
      name: "Aisha Binti Rahman",
      mykad: "920514-08-5462",
      age: 33,
      state: "Selangor",
      occupation: "Foodpanda rider",
      monthsActive: 8,
      avatarColor: "bg-bayan-coral/10",
      avatarInitials: "AR",
    },
    financing: {
      type: "Murabahah",
      amount: 8000,
      tenure: 24,
      purpose: "Working capital for warung at PJ",
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
        { feature: "Existing loans", value: "2", shap: 0.15, direction: "increases" },
      ],
    },
    shariahEngine: {
      verdict: "COMPLIANT",
      confidence: 0.94,
      checks: {
        riba: "NOT_DETECTED",
        gharar: "NOT_DETECTED",
        maysir: "NOT_DETECTED",
      },
      fatwaReferences: [
        "JAKIM e-Fatwa Resolution 142/2019: Murabahah financing for consumer goods",
        "BNM SAC Resolution 78/2021: Permissibility of automated risk assessment in Islamic financing",
        "Dar Al-Ifta Egypt Ruling 5821: Acceptable profit margins in Murabahah contracts",
      ],
    },
    fusion: {
      recommendation: "APPROVE",
      narrative_bm:
        "Pemohon Aisha Binti Rahman memohon pembiayaan Murabahah sebanyak RM 8,000 untuk tempoh 24 bulan. Sistem BAYAN telah menilai permohonan ini menggunakan dua enjin kognitif secara selari. Enjin Risiko Kredit memberikan skor 783/1000 (Zon Semakan Manual) dengan kebarangkalian gagal bayar 21%. Faktor utama yang menyumbang kepada penilaian ini adalah pendapatan gig bulanan pemohon (RM 3,400), rekod bayaran utiliti yang konsisten (94% tepat masa), dan nisbah hutang kepada pendapatan yang sihat (0.28). Walau bagaimanapun, tempoh aktiviti gig yang singkat (8 bulan) dan dua pinjaman sedia ada meningkatkan sedikit risiko. Enjin Pematuhan Shariah mengesahkan struktur kontrak Murabahah ini sebagai PATUH SYARIAH dengan keyakinan 94%. Tiada unsur riba, gharar, atau maysir dikesan. Penilaian ini berdasarkan e-Fatwa JAKIM (Resolusi 142/2019) dan Resolusi SAC BNM (78/2021). Cadangan: Permohonan disyorkan untuk diluluskan, tertakluk kepada semakan akhir oleh pegawai bank.",
      narrative_en:
        "Applicant Aisha Binti Rahman is requesting Murabahah financing of RM 8,000 over 24 months. BAYAN evaluated this application using two cognitive engines in parallel. The Credit Risk Engine returned a score of 783/1000 (Manual Review Zone) with a 21% default probability. Key contributing factors include the applicant's monthly gig earnings (RM 3,400), consistent utility payment history (94% on-time), and healthy debt-to-income ratio (0.28). However, the short gig tenure (8 months) and two existing loans add moderate risk. The Shariah Engine confirms this Murabahah contract structure as SHARIAH-COMPLIANT with 94% confidence. No elements of riba, gharar, or maysir were detected. Recommendation: Approve, subject to final officer review.",
    },
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
      avatarInitials: "DT",
    },
    financing: {
      type: "Tawarruq",
      amount: 15000,
      tenure: 36,
      purpose: "Vehicle maintenance and tyre replacement",
    },
    submittedAt: "24 min ago",
    status: "approved",
    creditEngine: {
      score: 871,
      maxScore: 1000,
      defaultProbability: 0.09,
      decisionZone: "AUTO_APPROVE",
      confidence: 0.91,
      topFactors: [
        { feature: "Gig monthly earnings", value: "RM 4,800", shap: -0.58, direction: "reduces" },
        { feature: "Gig tenure", value: "28 months", shap: -0.36, direction: "reduces" },
        { feature: "Utility on-time ratio", value: "98%", shap: -0.29, direction: "reduces" },
        { feature: "Prior defaults", value: "0", shap: -0.21, direction: "reduces" },
        { feature: "Requested amount", value: "RM 15,000", shap: 0.08, direction: "increases" },
      ],
    },
    shariahEngine: {
      verdict: "COMPLIANT",
      confidence: 0.96,
      checks: { riba: "NOT_DETECTED", gharar: "NOT_DETECTED", maysir: "NOT_DETECTED" },
      fatwaReferences: [
        "BNM SAC Resolution 91/2020: Tawarruq financing for vehicle expenses",
        "JAKIM e-Fatwa Resolution 167/2021: Permissibility of commodity Murabahah",
      ],
    },
    fusion: {
      recommendation: "APPROVE",
      narrative_bm:
        "Permohonan Daniel Tan Wei Ming menunjukkan profil pembayaran yang stabil dengan pendapatan gig konsisten dan tiada rekod gagal bayar terdahulu. Struktur Tawarruq yang dicadangkan disahkan patuh Syariah. Cadangan: Lulus dengan semakan pegawai sebagai pengesahan akhir.",
      narrative_en:
        "Daniel Tan Wei Ming presents a stable repayment profile with consistent gig income and no prior defaults. The proposed Tawarruq structure is confirmed Shariah-compliant. Recommendation: Approve, subject to final officer confirmation.",
    },
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
      avatarInitials: "SY",
    },
    financing: {
      type: "Ijarah",
      amount: 22000,
      tenure: 48,
      purpose: "Speculative trading of cryptocurrency derivatives",
    },
    submittedAt: "1 hour ago",
    status: "rejected",
    creditEngine: {
      score: 612,
      maxScore: 1000,
      defaultProbability: 0.72,
      decisionZone: "AUTO_REJECT",
      confidence: 0.83,
      topFactors: [
        { feature: "Prior defaults", value: "2", shap: 0.61, direction: "increases" },
        { feature: "Debt-to-income ratio", value: "0.71", shap: 0.44, direction: "increases" },
        { feature: "Existing loans", value: "4", shap: 0.32, direction: "increases" },
        { feature: "Gig monthly earnings", value: "RM 1,800", shap: 0.27, direction: "increases" },
        { feature: "Utility late count", value: "6 in 12 months", shap: 0.19, direction: "increases" },
      ],
    },
    shariahEngine: {
      verdict: "NON_COMPLIANT",
      confidence: 0.97,
      checks: { riba: "DETECTED", gharar: "DETECTED", maysir: "DETECTED" },
      reason:
        "The stated purpose involves cryptocurrency derivative trading, which contains excessive uncertainty (gharar) and speculation (maysir) elements prohibited under Shariah principles.",
      fatwaReferences: [
        "BNM SAC Resolution 102/2023: Position on cryptocurrency speculation",
        "JAKIM e-Fatwa Resolution 198/2022: Prohibition of derivatives trading",
      ],
      alternativeProducts: [
        {
          name: "Tawarruq financing for verified asset purchase",
          recommended: true,
          monthlyPayment: 540,
          profitRate: 6.8,
          description:
            "Cash-equivalent structure that requires documented use for permissible purposes.",
        },
        {
          name: "Ijarah financing for productive equipment",
          recommended: false,
          monthlyPayment: 580,
          profitRate: 7.2,
          description:
            "Lease structure if the customer identifies a productive asset to acquire.",
        },
      ],
    },
    fusion: {
      recommendation: "REJECT",
      narrative_bm:
        "Permohonan Siti Nurhaliza Yusof menunjukkan risiko kredit tinggi dan tujuan pembiayaan yang tidak mematuhi prinsip Syariah. Aktiviti perdagangan derivatif kripto mengandungi unsur gharar dan maysir yang jelas. Cadangan: Tolak struktur semasa dan pertimbangkan produk gantian yang patuh Syariah.",
      narrative_en:
        "Siti Nurhaliza Yusof presents elevated credit risk and a financing purpose that breaches Shariah principles. Cryptocurrency derivatives trading contains clear elements of gharar and maysir. Recommendation: Reject the current structure and consider compliant alternative products.",
    },
  },
  {
    id: "APP-2026-0889",
    applicant: {
      name: "Muhammad Faiz Hassan",
      occupation: "Grab driver",
      avatarInitials: "MF",
    },
    financing: { type: "Murabahah", amount: 5000, tenure: 18 },
    submittedAt: "1 hour ago",
    status: "approved",
  },
  {
    id: "APP-2026-0888",
    applicant: {
      name: "Lim Mei Ling",
      occupation: "Freelancer",
      avatarInitials: "LM",
    },
    financing: { type: "Personal", amount: 3000, tenure: 12 },
    submittedAt: "2 hours ago",
    status: "review_needed",
  },
  {
    id: "APP-2026-0887",
    applicant: {
      name: "Ahmad Iskandar Putra",
      occupation: "Foodpanda rider",
      avatarInitials: "AP",
    },
    financing: { type: "Murabahah", amount: 12000, tenure: 36 },
    submittedAt: "3 hours ago",
    status: "approved",
  },
];

export const shariahGuidelines = [
  {
    title: "Murabahah financing guidelines",
    category: "Financing",
    reference: "SC-2024-01",
    issuedOn: "15 Jan 2024",
    updated: "10 Apr 2025",
    status: "Active",
    summary: "Principles and requirements for Murabahah-based financing.",
  },
  {
    title: "Ijarah & Ijarah Thumma Al-Bai' guidelines",
    category: "Leasing",
    reference: "SC-2024-02",
    issuedOn: "20 Feb 2024",
    updated: "12 Mar 2025",
    status: "Active",
    summary: "Guidelines for leasing and lease-to-own transactions.",
  },
  {
    title: "Musyarakah & Mudharabah guidelines",
    category: "Partnership",
    reference: "SC-2024-03",
    issuedOn: "10 Mar 2024",
    updated: "08 Feb 2025",
    status: "Active",
    summary: "Equity partnership and profit-sharing arrangements.",
  },
  {
    title: "Shariah compliant documentation standards",
    category: "Governance",
    reference: "SC-2024-04",
    issuedOn: "5 Apr 2024",
    updated: "05 Apr 2025",
    status: "Active",
    summary: "Documentation requirements for Islamic financing.",
  },
  {
    title: "Fees, charges & penalties guidelines",
    category: "Operational",
    reference: "SC-2024-05",
    issuedOn: "18 May 2024",
    updated: "18 May 2025",
    status: "Active",
    summary: "Rules on permissible fees, charges and late payment handling.",
  },
];

export const helpFaqs = [
  "How does BAYAN assess Shariah compliance?",
  "What data is required for an assessment?",
  "Who can review and approve an application?",
  "How are approval chances calculated?",
  "Can I export assessment results?",
  "Is my data secure?",
  "How can I request access for my team?",
];
