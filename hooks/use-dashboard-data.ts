import useSWR from 'swr';

const fetcher = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

export function useDashboardData(token: string | null) {
  if (!token) return { data: null, error: null, isLoading: true };

  const { data: emissions } = useSWR(`/api/dashboard/emissions`, () =>
    fetcher(`/api/dashboard/emissions`, { headers: { Authorization: `Bearer ${token}` } })
  );
  const { data: reports } = useSWR(`/api/dashboard/reports`, () =>
    fetcher(`/api/dashboard/reports`, { headers: { Authorization: `Bearer ${token}` } })
  );
  const { data: risks } = useSWR(`/api/dashboard/risks`, () =>
    fetcher(`/api/dashboard/risks`, { headers: { Authorization: `Bearer ${token}` } })
  );

  return {
    emissions: emissions?.data || [],
    reports: reports?.data || [],
    risks: risks?.data || [],
    isLoading: !emissions && !reports && !risks,
  };
}
