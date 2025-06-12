# Serenity AI Agent API - Quick Start Guide

## 🚀 Getting Started in 3 Minutes

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up Environment (Optional)
For basic testing, the API works with defaults. For production:
```bash
cp env.example .env
# Edit .env with your API keys
```

### 3. Run the API
```bash
python run_api.py
```

The API will start at: http://localhost:8000

## 📋 Test the Endpoints

### Interactive Documentation
Visit http://localhost:8000/docs for Swagger UI

### Quick Tests with curl

1. **Check Health**
```bash
curl http://localhost:8000/api/healthcheck
```

2. **Get Property Listings**
```bash
curl "http://localhost:8000/api/listings?budget=2000000&location=Dubai"
```

3. **Chat with AI** (requires OpenAI API key in .env)
```bash
curl -X POST http://localhost:8000/api/respond_to_client \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me luxury villas in Dubai Marina",
    "language": "en",
    "role": "buyer"
  }'
```

4. **Score a Lead**
```bash
curl -X POST http://localhost:8000/api/score_lead \
  -H "Content-Type: application/json" \
  -d '{
    "chat_history": "I need to buy a property urgently. My budget is 2 million.",
    "preferences": {
      "budget": 2000000,
      "location": "Dubai Marina",
      "urgency": "immediate"
    }
  }'
```

5. **Book an Appointment**
```bash
curl -X POST http://localhost:8000/api/book_appointment \
  -H "Content-Type: application/json" \
  -d '{
    "agent_email": "agent@example.com",
    "client_info": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "datetime": "2024-01-20T14:00:00Z",
    "property_id": "1"
  }'
```

## 🔧 Configuration

### Minimal Setup (Local Testing)
- No configuration needed
- Uses mock data and local JSON files
- Perfect for development

### Production Setup
1. Copy `env.example` to `.env`
2. Add your OpenAI API key for chat functionality
3. Configure CRM webhooks (optional)
4. Set up calendar integration (optional)

## 📁 Project Structure
```
api/
├── main.py          # FastAPI application
├── listings.py      # Property listings endpoint
├── chat.py          # AI chat endpoint
├── booking.py       # Appointment booking
├── scoring.py       # Lead scoring
├── crm.py          # CRM integration
├── config.py       # Agency configuration
├── healthcheck.py  # Health monitoring
└── README.md       # Full documentation
```

## 🌐 Frontend Integration

The API is designed to work seamlessly with the React frontend:

```javascript
// Example: Fetch listings
const response = await fetch('http://localhost:8000/api/listings?budget=1500000');
const listings = await response.json();

// Example: Chat with AI
const chatResponse = await fetch('http://localhost:8000/api/respond_to_client', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "I'm looking for a 3-bedroom apartment",
    language: "en",
    role: "buyer"
  })
});
const aiResponse = await chatResponse.json();
```

## 🚨 Troubleshooting

### API won't start
- Check Python version (3.8+ required)
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is free

### Chat endpoint returns errors
- Add OpenAI API key to `.env` file
- Check API key is valid

### CORS errors
- Frontend URL must be in ALLOWED_ORIGINS
- For development, API allows all origins by default

## 📚 Next Steps

1. Explore the full API documentation at `/docs`
2. Configure environment variables for production
3. Set up database connection (optional)
4. Deploy to your preferred hosting platform

Need help? Check the full documentation in `api/README.md` 