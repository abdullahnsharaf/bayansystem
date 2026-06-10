import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "@/lib/types";

interface AuthStore {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (_employeeId: string, _password: string, _rememberDevice: boolean) => void;
  logout: () => void;
}

const defaultUser: AuthUser = {
  name: "Ahmad Razali",
  initials: "AR",
  role: "Senior Credit Officer",
  bankName: "Maybank Islamic",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: () => set({ isAuthenticated: true, user: defaultUser }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: "bayan-auth" },
  ),
);
