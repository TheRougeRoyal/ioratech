"use client";

import { useAuth } from "@/lib/auth-context";
import { useCallback } from "react";

export function useAuthHeaders() {
  const { getIdToken } = useAuth();

  const getHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getIdToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [getIdToken]);

  return { getHeaders };
}
