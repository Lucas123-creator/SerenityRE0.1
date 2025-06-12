import axios from 'axios';

interface CRMConfig {
  apiKey: string;
  baseUrl: string;
  organizationId: string;
}

interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  status: 'available' | 'sold' | 'pending';
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '+1234567890',
    propertyId: '1',
    status: 'new',
    source: 'Website',
    notes: 'Interested in a city center apartment.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1987654321',
    propertyId: '2',
    status: 'contacted',
    source: 'Referral',
    notes: 'Looking for a house with a garden.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment in City Center',
    description: 'Beautiful modern apartment with great views',
    price: 250000,
    location: 'City Center',
    status: 'available',
  },
  {
    id: '2',
    title: 'Cozy Suburban House',
    description: 'A lovely house with a garden and garage',
    price: 350000,
    location: 'Suburbs',
    status: 'pending',
  },
];

export class CRMService {
  private config: CRMConfig;
  private useMock: boolean;

  constructor(config: CRMConfig) {
    this.config = config;
    // Use mock data if no API key or running on localhost
    this.useMock = !config.apiKey || config.baseUrl.includes('localhost') || config.baseUrl.includes('mock');
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'X-Organization-ID': this.config.organizationId,
    };
  }

  async createLead(lead: Lead): Promise<Lead> {
    if (this.useMock) {
      const newLead = { ...lead, id: (mockLeads.length + 1).toString(), createdAt: new Date(), updatedAt: new Date() };
      mockLeads.push(newLead);
      return newLead;
    }
    try {
      const response = await axios.post<Lead>(
        `${this.config.baseUrl}/leads`,
        lead,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error;
    }
  }

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
    if (this.useMock) {
      const idx = mockLeads.findIndex(l => l.id === leadId);
      if (idx !== -1) {
        mockLeads[idx] = { ...mockLeads[idx], ...updates, updatedAt: new Date() };
        return mockLeads[idx];
      }
      throw new Error('Lead not found');
    }
    try {
      const response = await axios.patch<Lead>(
        `${this.config.baseUrl}/leads/${leadId}`,
        updates,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw error;
    }
  }

  async getLeads(filters?: Partial<Lead>): Promise<Lead[]> {
    if (this.useMock) {
      // Optionally filter mock leads
      if (filters) {
        return mockLeads.filter(lead => {
          return Object.entries(filters).every(([key, value]) => (lead as any)[key] === value);
        });
      }
      return mockLeads;
    }
    try {
      const response = await axios.get<Lead[]>(
        `${this.config.baseUrl}/leads`,
        {
          params: filters,
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw error;
    }
  }

  async syncProperty(property: Property): Promise<void> {
    if (this.useMock) {
      // No-op for mock
      return;
    }
    try {
      await axios.post(
        `${this.config.baseUrl}/properties/sync`,
        property,
        { headers: this.getHeaders() }
      );
    } catch (error) {
      console.error('Failed to sync property:', error);
      throw error;
    }
  }

  async getLeadAnalytics(): Promise<any> {
    if (this.useMock) {
      return { total: mockLeads.length, converted: 1, lost: 0 };
    }
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/analytics/leads`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch lead analytics:', error);
      throw error;
    }
  }

  async getProperties(filters?: Partial<Property>): Promise<Property[]> {
    if (this.useMock) {
      if (filters) {
        return mockProperties.filter(property => {
          return Object.entries(filters).every(([key, value]) => (property as any)[key] === value);
        });
      }
      return mockProperties;
    }
    try {
      const response = await axios.get<Property[]>(
        `${this.config.baseUrl}/properties`,
        {
          params: filters,
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      throw error;
    }
  }
} 