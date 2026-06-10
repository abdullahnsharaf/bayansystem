import { create } from "zustand";

import { applications as initialApplications } from "@/lib/bayan-data";
import type { ApplicationRecord, ApplicationStatus } from "@/lib/types";

interface ApplicationsStore {
  applications: ApplicationRecord[];
  addApplication: (application: ApplicationRecord) => void;
  updateApplication: (id: string, updater: (application: ApplicationRecord) => ApplicationRecord) => void;
  setStatus: (id: string, status: ApplicationStatus) => void;
  getApplicationById: (id: string) => ApplicationRecord | undefined;
}

export const useApplicationsStore = create<ApplicationsStore>((set, get) => ({
  applications: initialApplications,
  addApplication: (application) => set((state) => ({ applications: [application, ...state.applications] })),
  updateApplication: (id, updater) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === id ? updater(application) : application,
      ),
    })),
  setStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    })),
  getApplicationById: (id) => get().applications.find((application) => application.id === id),
}));
