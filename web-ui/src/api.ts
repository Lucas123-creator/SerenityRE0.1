import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Properties API
export const getProperties = async (filters?: any) => {
  try {
    const { data } = await api.get('/properties', { params: filters });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProperty = async (id: string) => {
  try {
    const { data } = await api.get(`/properties/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createProperty = async (propertyData: any) => {
  try {
    const { data } = await api.post('/properties', propertyData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProperty = async (id: string, propertyData: any) => {
  try {
    const { data } = await api.put(`/properties/${id}`, propertyData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteProperty = async (id: string) => {
  try {
    const { data } = await api.delete(`/properties/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const searchProperties = async (filters: any) => {
  try {
    const { data } = await api.get('/properties/search', { params: filters });
    return data;
  } catch (error) {
    throw error;
  }
};

// Leads API
export const getLeads = async (filters?: any) => {
  try {
    const { data } = await api.get('/leads', { params: filters });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getLead = async (id: string) => {
  try {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createLead = async (leadData: any) => {
  try {
    const { data } = await api.post('/leads', leadData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateLead = async (id: string, leadData: any) => {
  try {
    const { data } = await api.put(`/leads/${id}`, leadData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const scoreLead = async (payload: any) => {
  try {
    const { data } = await api.post('/leads/score', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const addLeadNote = async (id: string, text: string) => {
  try {
    const { data } = await api.post(`/leads/${id}/notes`, { text });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getLeadNotes = async (id: string) => {
  try {
    const { data } = await api.get(`/leads/${id}/notes`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Analytics API
export const getAnalyticsOverview = async () => {
  try {
    const { data } = await api.get('/analytics/overview');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPropertyMetrics = async () => {
  try {
    const { data } = await api.get('/analytics/properties');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getLeadMetrics = async () => {
  try {
    const { data } = await api.get('/analytics/leads');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAgentMetrics = async () => {
  try {
    const { data } = await api.get('/analytics/agents');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getRevenueMetrics = async () => {
  try {
    const { data } = await api.get('/analytics/revenue');
    return data;
  } catch (error) {
    throw error;
  }
};

// Settings API
export const getSettings = async () => {
  try {
    const { data } = await api.get('/settings');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateSettings = async (settingsData: any) => {
  try {
    const { data } = await api.put('/settings', settingsData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getBranding = async () => {
  try {
    const { data } = await api.get('/settings/branding');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateBranding = async (brandingData: any) => {
  try {
    const { data } = await api.put('/settings/branding', brandingData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getIntegrations = async () => {
  try {
    const { data } = await api.get('/settings/integrations');
    return data;
  } catch (error) {
    throw error;
  }
};

export const addIntegration = async (integrationData: any) => {
  try {
    const { data } = await api.post('/settings/integrations', integrationData);
    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (profileData: any) => {
  try {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await api.get('/auth/users');
    return data;
  } catch (error) {
    throw error;
  }
};

// Messages & Notifications API
export const sendMessage = async (messageData: any) => {
  try {
    const { data } = await api.post('/messages', messageData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMessageHistory = async (leadId: string) => {
  try {
    const { data } = await api.get(`/messages/${leadId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendNotification = async (notificationData: any) => {
  try {
    const { data } = await api.post('/notifications', notificationData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const { data } = await api.get('/notifications');
    return data;
  } catch (error) {
    throw error;
  }
};

export const markNotificationRead = async (id: string) => {
  try {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  } catch (error) {
    throw error;
  }
};

// File Upload API
export const uploadFile = async (file: File, meta: any = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(meta).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    const { data } = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getFiles = async () => {
  try {
    const { data } = await api.get('/files');
    return data as any;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (id: string) => {
  try {
    const { data } = await api.delete(`/files/${id}`);
    return data as any;
  } catch (error) {
    throw error;
  }
};

export const getFileTypes = async () => {
  try {
    const { data } = await api.get('/files/types');
    return data;
  } catch (error) {
    throw error;
  }
}; 