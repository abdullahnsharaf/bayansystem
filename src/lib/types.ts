export type ApplicationStatus = "review_needed" | "approved" | "rejected" | "processing" | "draft";

export type ShariahCheckVerdict = "NOT_DETECTED" | "DETECTED";
export type ShariahVerdict = "COMPLIANT" | "NON_COMPLIANT";
export type Recommendation = "APPROVE" | "REVIEW" | "REJECT";

export interface ShapFactor {
  feature: string;
  value: string;
  shap: number;
  direction: "reduces" | "increases";
}

export interface AlternativeProduct {
  name: string;
  recommended: boolean;
  monthlyPayment: number;
  profitRate: number;
  description: string;
}

export interface ApplicationRecord {
  id: string;
  applicant: {
    name: string;
    mykad?: string;
    age?: number;
    state?: string;
    occupation: string;
    monthsActive?: number;
    avatarColor?: string;
    avatarInitials: string;
  };
  financing: {
    type: string;
    amount: number;
    tenure: number;
    purpose?: string;
  };
  submittedAt: string;
  status: ApplicationStatus;
  creditEngine?: {
    score: number;
    maxScore?: number;
    defaultProbability: number;
    decisionZone: string;
    confidence: number;
    topFactors: ShapFactor[];
  };
  shariahEngine?: {
    verdict: ShariahVerdict;
    confidence: number;
    checks: {
      riba: ShariahCheckVerdict;
      gharar: ShariahCheckVerdict;
      maysir: ShariahCheckVerdict;
    };
    reason?: string;
    fatwaReferences: string[];
    alternativeProducts?: AlternativeProduct[];
  };
  fusion?: {
    recommendation: Recommendation;
    narrative_bm?: string;
    narrative_en?: string;
  };
}

export interface AuthUser {
  name: string;
  initials: string;
  role: string;
  bankName: string;
}
