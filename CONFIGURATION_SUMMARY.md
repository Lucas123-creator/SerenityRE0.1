# 🔧 Environment Configuration Summary

## 📂 File Structure

```
├── env.development.template     # Development environment template
├── env.production.template      # Production environment template
├── ENVIRONMENT_SETUP_GUIDE.md  # Detailed setup instructions
└── CONFIGURATION_SUMMARY.md    # This file (quick reference)
```

## 🚀 Quick Setup Commands

### 1. Create Environment Files
```bash
# Development environment
cp env.development.template .env

# Production environment  
cp env.production.template .env.production
```

### 2. Edit Environment Files
```bash
# Edit development config
nano .env

# Edit production config
nano .env.production
```

## 🔑 Required Configuration (Minimum)

To get the API running, you ONLY need these 3 values in your `.env` file:

```bash
# Essential for API functionality
OPENAI_API_KEY=sk-your-openai-api-key-here
API_KEY=dev_serenity_12345
SECRET_KEY=development_secret_key_minimum_32_characters_long
```

## 📋 Configuration Priority

### 🟢 Level 1: Basic Functionality (REQUIRED)
```bash
OPENAI_API_KEY=sk-...     # Get from: platform.openai.com
API_KEY=secure_key        # Generate: openssl rand -hex 16
SECRET_KEY=32_char_min    # Generate: openssl rand -hex 32
```

### 🟡 Level 2: Enhanced Features (RECOMMENDED)
```bash
# Database (for persistent storage)
SUPABASE_URL=https://...
SUPABASE_KEY=...

# Email (for notifications)
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=app-password
```

### 🟠 Level 3: Full Integration (OPTIONAL)
```bash
# CRM Integration
BITRIX_WEBHOOK_URL=https://...
PIPEDRIVE_API_KEY=...

# Calendar Integration
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# WhatsApp Integration
WHATSAPP_API_KEY=...

# File Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

## 🎯 Schema Reference

### Key Types and Validation

| Key | Type | Format | Example |
|-----|------|--------|---------|
| `OPENAI_API_KEY` | string | `sk-proj-*` | `sk-proj-abc123...` |
| `API_KEY` | string | alphanumeric | `dev_serenity_12345` |
| `SECRET_KEY` | string | 32+ chars | `a1b2c3d4e5f6...` |
| `SUPABASE_URL` | URL | https://\*.supabase.co | `https://abc.supabase.co` |
| `SUPABASE_KEY` | string | JWT token | `eyJhbGciOiJIUzI1NiI...` |
| `BITRIX_WEBHOOK_URL` | URL | Bitrix format | `https://domain.bitrix24.com/rest/1/key/` |
| `GOOGLE_CLIENT_ID` | string | Google format | `123.apps.googleusercontent.com` |
| `SMTP_USERNAME` | email | valid email | `user@gmail.com` |
| `SMTP_PASSWORD` | string | app password | `abcd efgh ijkl mnop` |

## 🧪 Quick Test Commands

### Test Minimum Setup
```bash
python run_api.py
# Should start on http://localhost:8000
```

### Test API Health
```bash
curl http://localhost:8000/api/healthcheck
# Should return: {"status": "ok", ...}
```

### Test AI Chat (requires OpenAI key)
```bash
curl -X POST http://localhost:8000/api/respond_to_client \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "language": "en", "role": "buyer"}'
```

## 🔧 Environment Differences

### Development (.env)
- Uses local files for data storage
- Allows all CORS origins
- Debug mode enabled
- HTTP allowed

### Production (.env.production)
- Requires database connection
- Restricted CORS origins
- Debug mode disabled
- HTTPS only

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| API won't start | Check `OPENAI_API_KEY`, `API_KEY`, `SECRET_KEY` |
| Chat not working | Verify OpenAI API key format: `sk-proj-...` |
| CORS errors | Add frontend URL to `ALLOWED_ORIGINS` |
| Permission errors | Check file permissions: `chmod 600 .env` |

## 🔗 Next Steps

1. **Minimum Setup**: Copy development template, add OpenAI key
2. **Test Locally**: Run `python run_api.py`
3. **Add Features**: Configure database, CRM, email as needed
4. **Deploy**: Use production template for deployment

For detailed instructions, see: `ENVIRONMENT_SETUP_GUIDE.md` 