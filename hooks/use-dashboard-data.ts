"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";

export interface DashboardData {
  profile: {
    id: string;
    email: string;
    name?: string;
    company?: string;
    industry?: string;
    job_title?: string;
    subscription_tier?: string;
    onboarding_completed?: boolean;
  } | null;
  emissions: Array<{
    id: string;
    user_id: string;
    scope: number;
    category: string;
    value: number;
    unit?: string;
    period?: string;
    created_at?: string;
  }>;
  risks: Array<{
    id: string;
    user_id: string;
    category: string;
    risk_type: string;
    score: number;
    trend?: string;
    description?: string;
    created_at?: string;
  }>;
  compliance: Array<{
    id: string;
    user_id: string;
    framework: string;
    status: string;
    score: number;
    categories?: Array<{ name: string; status: string; score: number }>;
    created_at?: string;
  }>;
  reports: Array<{
    id: string;
    user_id: string;
    name: string;
    type: string;
    status: string;
    frameworks?: string[];
    date?: string;
    created_at?: string;
  }>;
}

interface UseDashboardDataResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): UseDashboardDataResult {
  const { user, getIdToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getIdToken();
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/dashboard/data", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        setError("Session expired. Please sign in again.");
        setLoading(false);
        return;
      }

      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.error?.message || "Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("An error occurred while loading your data.");
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
