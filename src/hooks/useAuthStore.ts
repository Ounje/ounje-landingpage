import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "customer" | "vendor" | "rider" | "guest";

export interface UserInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  profileId?: string;
  location?: string;
  address?: string;
}

interface AuthState {
  user: UserInfo | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: UserInfo, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (extra: Partial<UserInfo>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: "guest",
      token: null,
      isAuthenticated: false,
      login: (userData, accessToken, refreshToken) => {
        // Save refresh token to localStorage so our apiClient interceptor can read it
        localStorage.setItem("ounje_refresh_token", refreshToken);
        set({
          user: userData,
          role: userData.role || "guest",
          token: accessToken,
          isAuthenticated: true,
        });
      },
      logout: () => {
        localStorage.removeItem("ounje_refresh_token");
        set({
          user: null,
          role: "guest",
          token: null,
          isAuthenticated: false,
        });
      },
      updateUser: (extra) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...extra };
          return {
            user: updatedUser,
            role: updatedUser.role || state.role,
          };
        });
      },
    }),
    {
      name: "ounje_auth_store", // unique key for localStorage persistence
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
