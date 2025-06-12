import axios from 'axios';

interface WhatsAppConfig {
  apiKey: string;
  phoneNumberId: string;
  businessAccountId: string;
}

interface Message {
  to: string;
  type: 'text' | 'template' | 'image' | 'document';
  content: {
    text?: string;
    templateName?: string;
    templateParams?: Record<string, string>;
    mediaUrl?: string;
    caption?: string;
  };
}

interface Template {
  name: string;
  language: string;
  components: Array<{
    type: string;
    parameters: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

export class WhatsAppService {
  private config: WhatsAppConfig;
  private baseUrl: string;

  constructor(config: WhatsAppConfig) {
    this.config = config;
    this.baseUrl = 'https://graph.facebook.com/v17.0';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async sendMessage(message: Message): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.config.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: message.to,
          type: message.type,
          ...this.getMessagePayload(message),
        },
        { headers: this.getHeaders() }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      return false;
    }
  }

  private getMessagePayload(message: Message) {
    switch (message.type) {
      case 'text':
        return { text: { body: message.content.text } };
      case 'template':
        return {
          template: {
            name: message.content.templateName,
            language: { code: 'en' },
            components: [{
              type: 'body',
              parameters: Object.entries(message.content.templateParams || {}).map(([key, value]) => ({
                type: 'text',
                text: value,
              })),
            }],
          },
        };
      case 'image':
        return {
          image: {
            link: message.content.mediaUrl,
            caption: message.content.caption,
          },
        };
      case 'document':
        return {
          document: {
            link: message.content.mediaUrl,
            caption: message.content.caption,
          },
        };
      default:
        throw new Error(`Unsupported message type: ${message.type}`);
    }
  }

  async sendBookingConfirmation(to: string, bookingDetails: any): Promise<boolean> {
    const message: Message = {
      to,
      type: 'template',
      content: {
        templateName: 'booking_confirmation',
        templateParams: {
          property_name: bookingDetails.propertyName,
          date: bookingDetails.date,
          time: bookingDetails.time,
        },
      },
    };

    return this.sendMessage(message);
  }

  async sendLeadNotification(to: string, leadDetails: any): Promise<boolean> {
    const message: Message = {
      to,
      type: 'template',
      content: {
        templateName: 'new_lead_notification',
        templateParams: {
          lead_name: leadDetails.name,
          property_name: leadDetails.propertyName,
        },
      },
    };

    return this.sendMessage(message);
  }

  async sendPropertyDetails(to: string, propertyDetails: any): Promise<boolean> {
    const message: Message = {
      to,
      type: 'template',
      content: {
        templateName: 'property_details',
        templateParams: {
          property_name: propertyDetails.title,
          price: propertyDetails.price.toString(),
          location: propertyDetails.location,
        },
      },
    };

    return this.sendMessage(message);
  }
} 