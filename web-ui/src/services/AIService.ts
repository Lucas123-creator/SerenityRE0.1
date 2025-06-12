import axios from 'axios';

interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PropertyRecommendation {
  propertyId: string;
  score: number;
  reason: string;
}

interface LeadAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  intent: string;
  suggestedActions: string[];
  priority: 'high' | 'medium' | 'low';
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface RecommendationsResponse {
  recommendations: PropertyRecommendation[];
}

interface DescriptionResponse {
  description: string;
}

interface SuggestionResponse {
  suggestion: string;
}

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await axios.post<ChatResponse>(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: this.config.model,
          messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        { headers: this.getHeaders() }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Failed to get AI chat response:', error);
      throw error;
    }
  }

  async getPropertyRecommendations(
    userPreferences: Record<string, any>,
    availableProperties: any[]
  ): Promise<PropertyRecommendation[]> {
    try {
      const response = await axios.post<RecommendationsResponse>(
        `${this.config.baseUrl}/recommendations/properties`,
        {
          preferences: userPreferences,
          properties: availableProperties,
        },
        { headers: this.getHeaders() }
      );
      return response.data.recommendations;
    } catch (error) {
      console.error('Failed to get property recommendations:', error);
      throw error;
    }
  }

  async analyzeLead(lead: any): Promise<any> {
    // Mock fallback
    return {
      sentiment: 'positive',
      intent: 'Interested in buying',
      suggestedActions: ['Contact lead', 'Schedule a viewing'],
      priority: 'high',
    };
  }

  async generatePropertyDescription(property: any): Promise<string> {
    // Mock fallback
    return `This is a beautiful ${property.bedrooms}-bedroom, ${property.bathrooms}-bathroom property located in ${property.location}. It features ${property.features?.join(', ') || 'modern amenities'} and is perfect for families or professionals.`;
  }

  async suggestResponse(leadMessage: string, context: any): Promise<string> {
    try {
      const response = await axios.post<SuggestionResponse>(
        `${this.config.baseUrl}/suggest/response`,
        {
          message: leadMessage,
          context,
        },
        { headers: this.getHeaders() }
      );
      return response.data.suggestion;
    } catch (error) {
      console.error('Failed to get response suggestion:', error);
      throw error;
    }
  }
} 