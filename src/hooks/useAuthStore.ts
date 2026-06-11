import { create } from "zustand";

export type UserRole = "customer" | "vendor" | "rider" | "guest";

export interface UserInfo {
  name: string;
  email: string;
  phone?: string;
  bukaName?: string;
  vehicleType?: string;
  location?: string;
}

interface AuthState {
  user: UserInfo | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, extra?: Partial<UserInfo>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: "guest",
  token: null,
  isAuthenticated: false,
  login: (email, role, extra) => {
    const mockUser: UserInfo = {
      name: extra?.name || email.split("@")[0],
      email,
      ...extra,
    };
    set({
      user: mockUser,
      role,
      token: "mock-jwt-token",
      isAuthenticated: true,
    });
  },
  logout: () => {
    set({
      user: null,
      role: "guest",
      token: null,
      isAuthenticated: false,
    });
  },
}));
