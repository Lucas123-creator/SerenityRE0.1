import { useState, useEffect } from 'react';
import { 
  getAnalyticsOverview,
  getLeadMetrics,
  getRevenueMetrics
} from '../api';

interface AnalyticsData {
  overview: any;
  leads: any;
  revenue: any;
}

interface UseAnalyticsResult {
  data: AnalyticsData | null;
  loading: boolean;
  error: Error | null;
}

export const useAnalytics = (): UseAnalyticsResult => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [overview, leads, revenue] = await Promise.all([
          getAnalyticsOverview(),
          getLeadMetrics(),
          getRevenueMetrics()
        ]);

        setData({
          overview,
          leads,
          revenue
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { data, loading, error };
}; 