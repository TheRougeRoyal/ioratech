"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function DemoPage() {
  const { startDemo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    startDemo();
    router.push("/dashboard");
  }, [startDemo, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-r-transparent" />
    </div>
  );
}
