import useSWR from 'swr';

const fetcher = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

export function useDashboardData(token: string | null) {
  // Hooks must be called unconditionally — early return moved after all hook calls.
  const { data: emissions } = useSWR(
    token ? `/api/dashboard/emissions` : null,
    token
      ? () => fetcher(`/api/dashboard/emissions`, { headers: { Authorization: `Bearer ${token}` } })
      : null
  );
  const { data: reports } = useSWR(
    token ? `/api/dashboard/reports` : null,
    token
      ? () => fetcher(`/api/dashboard/reports`, { headers: { Authorization: `Bearer ${token}` } })
      : null
  );
  const { data: risks } = useSWR(
    token ? `/api/dashboard/risks` : null,
    token
      ? () => fetcher(`/api/dashboard/risks`, { headers: { Authorization: `Bearer ${token}` } })
      : null
  );

  if (!token) return { data: null, error: null, isLoading: true };

  return {
    emissions: emissions?.data || [],
    reports: reports?.data || [],
    risks: risks?.data || [],
    isLoading: !emissions && !reports && !risks,
  };
}
