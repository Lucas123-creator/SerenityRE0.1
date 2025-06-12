import { useState, useEffect } from 'react';
import { getSettings, getBranding } from '../api';

interface Settings {
  general: any;
  branding: any;
}

interface UseSettingsResult {
  settings: Settings | null;
  loading: boolean;
  error: Error | null;
}

export const useSettings = (): UseSettingsResult => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const [general, branding] = await Promise.all([
          getSettings(),
          getBranding()
        ]);

        setSettings({
          general,
          branding
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
        setSettings(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}; 