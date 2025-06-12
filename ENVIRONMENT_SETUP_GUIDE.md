# 🔧 Serenity AI Agent Environment Configuration Guide

## 📋 Environment Files Schema

The system uses two environment files:
- **`.env`** - Development configuration
- **`.env.production`** - Production configuration

## 🚀 Quick Setup

### 1. Create Environment Files
```bash
# Development
cp env.example .env

# Production  
cp env.production.template .env.production
```

### 2. Configure Required Values
Edit the files with your actual credentials (see detailed steps below).

## 📊 Configuration Schema

### 🔑 REQUIRED KEYS (Essential for functionality)

| Key | Type | Required For | Example |
|-----|------|-------------|---------|
| `OPENAI_API_KEY` | string | AI Chat functionality | `sk-proj-abc123...` |
| `API_KEY` | string | API authentication | `secure_api_key_here` |
| `SECRET_KEY` | string | JWT/encryption | `minimum_32_character_secret` |

### 🔧 OPTIONAL KEYS (Enhanced functionality)

| Category | Key | Purpose | Where to Get |
|----------|-----|---------|--------------|
| **Database** | `SUPABASE_URL` | Data storage | Supabase Dashboard |
| **Database** | `SUPABASE_KEY` | Database auth | Supabase Dashboard |
| **CRM** | `BITRIX_WEBHOOK_URL` | Lead sync | Bitrix24 Settings |
| **CRM** | `PIPEDRIVE_API_KEY` | Lead sync | Pipedrive Settings |
| **Calendar** | `GOOGLE_CLIENT_ID` | Booking integration | Google Cloud Console |
| **Calendar** | `GOOGLE_CLIENT_SECRET` | Google auth | Google Cloud Console |
| **Email** | `SMTP_USERNAME` | Email notifications | Email provider |
| **Email** | `SMTP_PASSWORD` | Email auth | App password |
| **WhatsApp** | `WHATSAPP_API_KEY` | WhatsApp integration | WhatsApp Business API |
| **Storage** | `AWS_ACCESS_KEY_ID` | File uploads | AWS IAM Console |

## 📝 Step-by-Step Setup Instructions

### Step 1: OpenAI API Key (REQUIRED)
**Purpose**: Powers the AI chat functionality

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`)
6. Add to your `.env` file:
```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

### Step 2: Basic API Configuration (REQUIRED)
**Purpose**: Secure your API endpoints

1. Generate a secure API key:
```bash
# For development
API_KEY=dev_serenity_$(date +%s)_$(openssl rand -hex 8)

# For production (use a secure random generator)
API_KEY=prod_serenity_$(openssl rand -hex 16)
```

2. Generate a secret key:
```bash
# Must be at least 32 characters
SECRET_KEY=$(openssl rand -hex 32)
```

3. Add to your environment file:
```bash
API_KEY=your_generated_api_key
SECRET_KEY=your_generated_secret_key
```

### Step 3: Database Configuration (OPTIONAL)
**Purpose**: Persistent data storage (uses local files if not configured)

#### Option A: Supabase (Recommended)
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Navigate to **Settings > API**
4. Copy the **Project URL** and **anon public key**
5. Add to environment:
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
```

#### Option B: PostgreSQL
1. Set up PostgreSQL database
2. Create connection string:
```bash
DATABASE_URL=postgresql://username:password@host:port/database_name
```

### Step 4: CRM Integration (OPTIONAL)
**Purpose**: Automatically sync leads to your CRM

#### Option A: Bitrix24
1. Go to your Bitrix24 portal
2. Navigate to **Applications > Webhooks**
3. Create **Inbound webhook**
4. Select permissions: `crm` scope
5. Copy the webhook URL:
```bash
BITRIX_WEBHOOK_URL=https://your-domain.bitrix24.com/rest/1/webhook-key/
```

#### Option B: Pipedrive
1. Go to [Pipedrive](https://app.pipedrive.com)
2. Navigate to **Settings > Personal preferences > API**
3. Copy your API token:
```bash
PIPEDRIVE_API_KEY=your-api-token
PIPEDRIVE_DOMAIN=your-company.pipedrive.com
```

### Step 5: Calendar Integration (OPTIONAL)
**Purpose**: Schedule property viewings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **Google Calendar API**
4. Create **OAuth 2.0 credentials**:
   - Application type: **Web application**
   - Authorized redirect URIs: 
     - Development: `http://localhost:8000/auth/google/callback`
     - Production: `https://your-domain.com/auth/google/callback`
5. Copy credentials:
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### Step 6: Email Configuration (OPTIONAL)
**Purpose**: Send booking confirmations and notifications

#### Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password:
   - Google Account > Security > 2-Step Verification > App Passwords
   - Select app: **Mail**, device: **Other (custom name)**
   - Use the generated 16-character password
3. Configure:
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FROM_EMAIL=noreply@your-company.com
```

### Step 7: WhatsApp Integration (OPTIONAL)
**Purpose**: Send property updates via WhatsApp

1. Apply for [WhatsApp Business API](https://business.whatsapp.com/products/business-api)
2. Get approved and receive credentials
3. Configure:
```bash
WHATSAPP_API_KEY=your-whatsapp-api-key
WHATSAPP_PHONE_NUMBER=+1234567890
```

### Step 8: File Storage (OPTIONAL)
**Purpose**: Store property images and documents

#### AWS S3 Setup
1. Go to [AWS Console](https://console.aws.amazon.com)
2. Create S3 bucket
3. Create IAM user with S3 permissions
4. Generate access keys
5. Configure:
```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
```

## 🔒 Security Best Practices

### Development Environment
- ✅ Use weak keys for testing
- ✅ Allow all CORS origins
- ✅ Enable debug mode
- ✅ Use HTTP (localhost)

### Production Environment
- ❗ Use strong, unique keys (32+ characters)
- ❗ Restrict CORS origins to your domains only
- ❗ Disable debug mode
- ❗ Use HTTPS only
- ❗ Enable monitoring/logging

## 📁 File Management

### Clean Up Redundant Files
```bash
# Remove old environment files if they exist
rm -f env.example
rm -f .env.example
rm -f api/.env.example

# Create your environment files
cp env.production.template .env.production
cp env.production.template .env  # Use as template for development
```

### Edit Your Files
```bash
# Development
nano .env

# Production
nano .env.production
```

## ✅ Validation Checklist

### Minimum Configuration (Development)
- [ ] `OPENAI_API_KEY` - For AI chat
- [ ] `API_KEY` - For API security
- [ ] `SECRET_KEY` - For encryption

### Full Configuration (Production)
- [ ] All minimum requirements
- [ ] Database connection (Supabase/PostgreSQL)
- [ ] CRM integration (Bitrix24/Pipedrive)
- [ ] Calendar integration (Google)
- [ ] Email configuration (SMTP)
- [ ] File storage (AWS S3)
- [ ] Monitoring (Sentry)

## 🧪 Testing Your Configuration

### 1. Test Basic Setup
```bash
python run_api.py
# Should start without errors
```

### 2. Test API Endpoints
```bash
# Health check
curl http://localhost:8000/api/healthcheck

# Test with your API key
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:8000/api/listings
```

### 3. Test AI Chat (requires OpenAI key)
```bash
curl -X POST http://localhost:8000/api/respond_to_client \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "language": "en", "role": "buyer"}'
```

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| API won't start | Check all required keys are set |
| Chat not working | Verify OpenAI API key is valid |
| CORS errors | Add your frontend URL to ALLOWED_ORIGINS |
| Database errors | Check connection string format |
| CRM not syncing | Verify webhook URL and permissions |

## 📞 Support

If you encounter issues:
1. Check the logs: `tail -f logs/api.log`
2. Verify environment variables: `python -c "from api.env_config import config; print(config.OPENAI_API_KEY[:10])"` 
3. Test individual components using the API documentation at `/docs` 