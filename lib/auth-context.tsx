"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthChange, logOut } from "@/lib/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isDemo: boolean;
  getIdToken: () => Promise<string | null>;
  startDemo: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemo: false,
  getIdToken: async () => null,
  startDemo: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/request-access"];
const DEMO_STORAGE_KEY = "iora:sessionMode";

// A minimal Firebase-User-shaped object the dashboard pages already consume.
// We only need the fields actually read across the app: displayName, email, uid,
// plus a getIdToken stub that returns a non-empty string so the fetches proceed.
function buildDemoUser(): FirebaseUser {
  const now = new Date().toISOString();
  return {
    uid: "demo-user",
    email: "demo@iora.local",
    displayName: "Demo User",
    isAnonymous: true,
    emailVerified: true,
    phoneNumber: null,
    photoURL: null,
    providerId: "demo",
    metadata: { creationTime: now, lastSignInTime: now },
    providerData: [],
    refreshToken: "demo-refresh",
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => "demo-token",
    getIdTokenResult: async () => ({
      authTime: now,
      expirationTime: now,
      issuedAtTime: now,
      signInProvider: "demo",
      signInSecondFactor: null,
      token: "demo-token",
      claims: { demo: true },
    }),
    reload: async () => {},
    toJSON: () => ({ uid: "demo-user", email: "demo@iora.local", isAnonymous: true }),
  } as unknown as FirebaseUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedMode = typeof window !== "undefined" ? sessionStorage.getItem(DEMO_STORAGE_KEY) : null;
    if (storedMode === "demo") {
      setIsDemo(true);
      setUser(buildDemoUser());
    }

    const unsubscribe = onAuthChange((firebaseUser) => {
      // If a real sign-in lands while a demo session is active, prefer the real user.
      if (firebaseUser) {
        setIsDemo(false);
        sessionStorage.removeItem(DEMO_STORAGE_KEY);
        setUser(firebaseUser);
      } else if (storedMode !== "demo") {
        setUser(null);
      }
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
    // Demo sessions have no Firebase token; returning null lets the existing
    // page-level guards skip API calls and keep the seeded mock data on screen.
    if (isDemo) return null;
    try {
      return await user.getIdToken();
    } catch {
      return null;
    }
  };

  const startDemo = () => {
    sessionStorage.setItem(DEMO_STORAGE_KEY, "demo");
    setIsDemo(true);
    setUser(buildDemoUser());
  };

  const signOut = async () => {
    sessionStorage.removeItem(DEMO_STORAGE_KEY);
    setIsDemo(false);
    setUser(null);
    await logOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, getIdToken, startDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
