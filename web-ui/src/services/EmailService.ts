import axios from 'axios';

interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  replyTo?: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
  html?: string;
}

export class EmailService {
  private config: EmailConfig;
  private baseUrl: string;

  constructor(config: EmailConfig) {
    this.config = config;
    this.baseUrl = import.meta.env.VITE_EMAIL_SERVICE_URL || 'https://api.email-service.com';
  }

  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/send`, {
        to,
        from: this.config.fromEmail,
        replyTo: this.config.replyTo,
        subject: template.subject,
        text: template.body,
        html: template.html,
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.status === 200;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendBookingConfirmation(to: string, bookingDetails: any): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'Booking Confirmation',
      body: `Thank you for your booking. Details: ${JSON.stringify(bookingDetails)}`,
      html: `
        <h1>Booking Confirmation</h1>
        <p>Thank you for your booking.</p>
        <div>
          <h2>Booking Details:</h2>
          <ul>
            <li>Property: ${bookingDetails.propertyName}</li>
            <li>Date: ${bookingDetails.date}</li>
            <li>Time: ${bookingDetails.time}</li>
          </ul>
        </div>
      `,
    };

    return this.sendEmail(to, template);
  }

  async sendLeadNotification(to: string, leadDetails: any): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'New Lead Received',
      body: `New lead received: ${JSON.stringify(leadDetails)}`,
      html: `
        <h1>New Lead Received</h1>
        <p>A new lead has been received.</p>
        <div>
          <h2>Lead Details:</h2>
          <ul>
            <li>Name: ${leadDetails.name}</li>
            <li>Email: ${leadDetails.email}</li>
            <li>Phone: ${leadDetails.phone}</li>
            <li>Property: ${leadDetails.propertyName}</li>
          </ul>
        </div>
      `,
    };

    return this.sendEmail(to, template);
  }
} 