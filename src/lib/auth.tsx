import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthUser = { name: string; email: string; avatar: string };

interface AuthState {
  user: AuthUser | null;
  isReady: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);
const STORAGE_KEY = "furry.session";

const demoUser: AuthUser = {
  name: "Bessie Cooper",
  email: "bessie@furrysitterz.com",
  avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bessie-admin&backgroundColor=fde7d1",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  const signIn = useCallback(async (email: string, _password: string, remember: boolean) => {
    await new Promise((r) => setTimeout(r, 700));
    const next = { ...demoUser, email: email || demoUser.email };
    setUser(next);
    const target = remember ? localStorage : sessionStorage;
    target.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ user, isReady, signIn, signOut }), [user, isReady, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
