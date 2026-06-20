"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthChange } from "@/lib/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  getIdToken: async () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/request-access"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
    const isDashboard = pathname.startsWith("/dashboard");
    if (!user && isDashboard) {
      router.push("/login");
    } else if (user && isAuthPage) {
      router.push("/dashboard");
    }
  }, [user, loading, pathname, router]);

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}
