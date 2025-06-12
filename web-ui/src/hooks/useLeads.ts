import { useState, useEffect } from 'react';
import { getLeads } from '../api';
import type { Lead, LeadCreate, LeadUpdate, LeadFilter, LeadAnalytics } from '../types/leads';
import { leadsApi } from '../api/leads';

interface UseLeadsResult {
  leads: Lead[];
  loading: boolean;
  error: Error | null;
  analytics: LeadAnalytics | null;
  fetchLeads: (filters?: LeadFilter) => Promise<void>;
  createLead: (lead: LeadCreate) => Promise<Lead>;
  updateLead: (id: number, lead: LeadUpdate) => Promise<Lead>;
  deleteLead: (id: number) => Promise<void>;
  fetchAnalytics: () => Promise<LeadAnalytics>;
  scoreLead: (id: number) => Promise<Lead>;
}

export const useLeads = (filters?: any): UseLeadsResult => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const data = await getLeads(filters);
        setLeads(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch leads'));
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [filters]);

  const fetchLeads = async (filters?: LeadFilter) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeads(filters);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch leads'));
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (lead: LeadCreate) => {
    try {
      setLoading(true);
      setError(null);
      const newLead = await leadsApi.createLead(lead);
      setLeads(prev => [...prev, newLead]);
      return newLead;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create lead'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (id: number, lead: LeadUpdate) => {
    try {
      setLoading(true);
      setError(null);
      const updatedLead = await leadsApi.updateLead(id, lead);
      setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
      return updatedLead;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update lead'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await leadsApi.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete lead'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadsApi.getLeadAnalytics();
      setAnalytics(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const scoreLead = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const scoredLead = await leadsApi.scoreLead(id);
      setLeads(prev => prev.map(l => l.id === id ? scoredLead : l));
      return scoredLead;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to score lead'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    leads,
    loading,
    error,
    analytics,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    fetchAnalytics,
    scoreLead
  };
}; 