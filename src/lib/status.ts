import type { ApplicationStatus, Recommendation } from "@/lib/types";

export function getStatusLabel(status: ApplicationStatus) {
  switch (status) {
    case "review_needed":
      return "Review needed";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "processing":
      return "Processing";
    case "draft":
      return "Draft";
    default:
      return status;
  }
}

export function getRecommendationLabel(recommendation: Recommendation) {
  switch (recommendation) {
    case "APPROVE":
      return "Recommendation: approve";
    case "REVIEW":
      return "Recommendation: review manually";
    case "REJECT":
      return "Recommendation: reject";
    default:
      return recommendation;
  }
}
