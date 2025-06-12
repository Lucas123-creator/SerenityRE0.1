import { useState, useEffect } from 'react';
import { getProperty } from '../api';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  status: string;
  created_at: string;
  // Add other property fields as needed
}

interface UsePropertyResult {
  property: Property | null;
  loading: boolean;
  error: Error | null;
}

export const useProperty = (id: string): UsePropertyResult => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setProperty(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProperty(id);
        setProperty(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch property'));
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
}; 