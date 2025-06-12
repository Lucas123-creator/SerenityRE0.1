export enum LeadIntent {
  BUY = 'buy',
  RENT = 'rent',
  BOOK = 'book'
}

export enum LeadTag {
  HOT = 'hot',
  WARM = 'warm',
  COLD = 'cold'
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  CLOSED = 'closed'
}

export interface LeadPreferences {
  budget?: number;
  location?: string;
  urgency?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  intent: LeadIntent;
  budget?: number;
  location: string;
  score: number;
  tag: LeadTag;
  assigned_agent?: string;
  status: LeadStatus;
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  text: string;
  created_at: string;
}

export interface LeadScoreRequest {
  chat_history: string;
  preferences: LeadPreferences;
}

export interface LeadScoreResponse {
  score: number;
  tag: LeadTag;
  reasons: string[];
}

export interface LeadAnalytics {
  total_leads: number;
  hot_leads_percentage: number;
  conversion_rate: number;
  lead_sources: Record<string, number>;
  leads_by_status: Record<string, number>;
  leads_by_tag: Record<string, number>;
  recent_conversion_trend: Array<{
    date: string;
    conversions: number;
  }>;
} 