import { create } from "zustand";

interface AssessmentStore {
  selectedApplicationId: string | null;
  processingApplicationId: string | null;
  language: "bm" | "en";
  selectApplication: (id: string | null) => void;
  setProcessingApplication: (id: string | null) => void;
  setLanguage: (language: "bm" | "en") => void;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  selectedApplicationId: null,
  processingApplicationId: null,
  language: "bm",
  selectApplication: (selectedApplicationId) => set({ selectedApplicationId }),
  setProcessingApplication: (processingApplicationId) => set({ processingApplicationId }),
  setLanguage: (language) => set({ language }),
}));
