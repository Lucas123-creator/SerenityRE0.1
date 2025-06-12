/// <reference types="vite/client" />
import { EmailService } from '../services/EmailService';
import { CRMService } from '../services/CRMService';
import { WhatsAppService } from '../services/WhatsAppService';
import { AIService } from '../services/AIService';

// Email Service Configuration
const emailConfig = {
  apiKey: import.meta.env.VITE_EMAIL_SERVICE_API_KEY || '',
  fromEmail: import.meta.env.VITE_EMAIL_FROM || 'noreply@realestateserenity.com',
  replyTo: import.meta.env.VITE_EMAIL_REPLY_TO || 'support@realestateserenity.com',
};

// CRM Service Configuration
const crmConfig = {
  apiKey: import.meta.env.VITE_CRM_API_KEY || '',
  baseUrl: import.meta.env.VITE_CRM_API_URL || 'https://api.crm-service.com',
  organizationId: import.meta.env.VITE_CRM_ORGANIZATION_ID || '',
};

// WhatsApp Service Configuration
const whatsappConfig = {
  apiKey: import.meta.env.VITE_WHATSAPP_API_KEY || '',
  phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
  businessAccountId: import.meta.env.VITE_WHATSAPP_BUSINESS_ACCOUNT_ID || '',
};

// AI Service Configuration
const aiConfig = {
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  baseUrl: import.meta.env.VITE_AI_API_URL || 'https://api.ai-service.com',
  model: import.meta.env.VITE_AI_MODEL || 'gpt-4',
};

// Initialize services
export const emailService = new EmailService(emailConfig);
export const crmService = new CRMService(crmConfig);
export const whatsappService = new WhatsAppService(whatsappConfig);
export const aiService = new AIService(aiConfig);

// Service initialization validation
const validateServices = () => {
  const requiredEnvVars = [
    'VITE_EMAIL_SERVICE_API_KEY',
    'VITE_CRM_API_KEY',
    'VITE_CRM_ORGANIZATION_ID',
    'VITE_WHATSAPP_API_KEY',
    'VITE_WHATSAPP_PHONE_NUMBER_ID',
    'VITE_WHATSAPP_BUSINESS_ACCOUNT_ID',
    'VITE_AI_API_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missingVars.length > 0) {
    console.warn(
      'Warning: The following environment variables are not set:',
      missingVars.join(', ')
    );
  }
};

// Run validation on service initialization
validateServices(); 