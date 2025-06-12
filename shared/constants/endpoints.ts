export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  // Leads
  LEADS: {
    LIST: '/api/leads',
    DETAIL: (id: string) => `/api/leads/${id}`,
    NOTES: (id: string) => `/api/leads/${id}/notes`,
    SCORE: '/api/leads/score',
    ANALYTICS: '/api/leads/analytics'
  },

  // Properties
  PROPERTIES: {
    LIST: '/api/properties',
    SEARCH: '/api/properties/search',
    DETAIL: (id: string) => `/api/properties/${id}`,
    IMAGES: (id: string) => `/api/properties/${id}/images`
  },

  // Authentication (placeholder for future)
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/users/me'
  }
}; 