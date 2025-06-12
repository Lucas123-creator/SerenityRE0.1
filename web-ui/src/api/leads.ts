import { apiClient } from './client';
import type { Lead, LeadCreate, LeadUpdate, LeadFilter, LeadAnalytics } from '../types/leads';

export const leadsApi = {
  // Get all leads with optional filtering
  getLeads: async (filters?: LeadFilter): Promise<Lead[]> => {
    const response = await apiClient.get('/leads', { params: filters });
    return response.data;
  },

  // Get a single lead by ID
  getLead: async (id: number): Promise<Lead> => {
    const response = await apiClient.get(`/leads/${id}`);
    return response.data;
  },

  // Create a new lead
  createLead: async (lead: LeadCreate): Promise<Lead> => {
    const response = await apiClient.post('/leads', lead);
    return response.data;
  },

  // Update an existing lead
  updateLead: async (id: number, lead: LeadUpdate): Promise<Lead> => {
    const response = await apiClient.put(`/leads/${id}`, lead);
    return response.data;
  },

  // Delete a lead
  deleteLead: async (id: number): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  // Get lead analytics
  getLeadAnalytics: async (): Promise<LeadAnalytics> => {
    const response = await apiClient.get('/leads/analytics');
    return response.data;
  },

  // Score a lead
  scoreLead: async (id: number): Promise<Lead> => {
    const response = await apiClient.post(`/leads/${id}/score`);
    return response.data;
  }
}; 