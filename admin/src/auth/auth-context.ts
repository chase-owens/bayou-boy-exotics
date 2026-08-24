import { createContext } from "react";

export type AuthRole = "admin" | "manager";

export type AuthUser = {
  userId: string;
  username: string;
  email?: string;
  role: AuthRole;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;

  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
