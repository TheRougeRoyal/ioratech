"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isDemo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !isDemo) {
      router.push("/login");
    }
  }, [user, loading, isDemo, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-neutral-50" />
      </div>
    );
  }

  if (!user && !isDemo) {
    return null; // Prevent flash of content before redirect
  }

  return <>{children}</>;
}
