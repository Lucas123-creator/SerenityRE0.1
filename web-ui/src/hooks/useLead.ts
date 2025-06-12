import { useState, useEffect } from 'react';
import { getLead } from '../api';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  score: number;
  created_at: string;
  // Add other lead properties as needed
}

interface UseLeadResult {
  lead: Lead | null;
  loading: boolean;
  error: Error | null;
}

export const useLead = (id: string): UseLeadResult => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) {
        setLead(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getLead(id);
        setLead(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lead'));
        setLead(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  return { lead, loading, error };
}; 