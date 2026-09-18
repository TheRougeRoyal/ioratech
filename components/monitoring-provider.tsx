"use client";

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { logger } from '@/lib/logger';

export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    onCLS(metric => logger.info({ value: metric.value, name: 'CLS' }, 'Web Vital'));
    onINP(metric => logger.info({ value: metric.value, name: 'INP' }, 'Web Vital'));
    onFCP(metric => logger.info({ value: metric.value, name: 'FCP' }, 'Web Vital'));
    onLCP(metric => logger.info({ value: metric.value, name: 'LCP' }, 'Web Vital'));
    onTTFB(metric => logger.info({ value: metric.value, name: 'TTFB' }, 'Web Vital'));
  }, []);

  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
