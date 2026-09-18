"use client";

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { logger } from '@/lib/logger';

export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getCLS(metric => logger.info({ value: metric.value, name: 'CLS' }, 'Web Vital'));
    getFID(metric => logger.info({ value: metric.value, name: 'FID' }, 'Web Vital'));
    getFCP(metric => logger.info({ value: metric.value, name: 'FCP' }, 'Web Vital'));
    getLCP(metric => logger.info({ value: metric.value, name: 'LCP' }, 'Web Vital'));
    getTTFB(metric => logger.info({ value: metric.value, name: 'TTFB' }, 'Web Vital'));
  }, []);

  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
