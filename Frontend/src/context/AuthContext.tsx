import React, { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loginUser, registerUser } from "../api/endpoints";
import { decodeJwtPayload } from "../utils/jwt";
import { readJson, readStorage, removeStorage, writeJson, writeStorage } from "../utils/storage";
import type {
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserRole,
} from "../types/auth";

const TOKEN_KEY = "disaster_platform_token";
const USER_KEY = "disaster_platform_user";


type JwtPayload = {
  sub?: string;
  role?: UserRole;
  user_id?: number;
};

interface AuthContextValue {
  token: string;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<LoginResponse>;
  register: (payload: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => readStorage(TOKEN_KEY) || "");
  const [user, setUser] = useState<AuthenticatedUser | null>(() => readJson<AuthenticatedUser>(USER_KEY));

  useEffect(() => {
    if (token) {
      writeStorage(TOKEN_KEY, token);
    } else {
      removeStorage(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      writeJson(USER_KEY, user);
    } else {
      removeStorage(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (!token || user) return;

    const payload = decodeJwtPayload<JwtPayload>(token);

    if (!payload || !payload.user_id) {
      return;
    }

    setUser({
      id: payload.user_id,
      email: payload.sub ?? "",
      role: payload.role ?? "volunteer",
    });
  }, [token, user]);

  async function login(payload: LoginRequest) {
    const response = await loginUser(payload);

    const decoded = decodeJwtPayload<JwtPayload>(response.access_token);

    setToken(response.access_token);

    setUser({
      id: decoded?.user_id ?? response.id,
      email: response.email,
      role: decoded?.role ?? "volunteer",
    });

    return response;
  }

  async function register(payload: RegisterRequest) {
    return registerUser(payload);
  }

  function logout() {
    setToken("");
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}