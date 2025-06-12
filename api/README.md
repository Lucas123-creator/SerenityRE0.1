# Serenity AI Agent API

A production-ready FastAPI backend that powers the Serenity AI Agent frontend, connecting the web-based UI to operational backend modules.

## Features

- **Property Listings Management**: Search and filter property listings
- **AI-Powered Chat**: Multilingual conversational AI for real estate inquiries
- **Appointment Booking**: Schedule property viewings with calendar integration
- **Lead Scoring**: Real-time lead qualification based on chat history and preferences
- **CRM Integration**: Push leads to Bitrix, Pipedrive, or custom CRM systems
- **Agency Configuration**: Customizable branding and preferences per agency
- **Health Monitoring**: API status and system health checks

## API Endpoints

### 1. Property Listings
```
GET /api/listings
```
- Query Parameters: `budget`, `location`, `bedrooms`, `min_price`, `property_type`
- Returns: Array of property listings

### 2. AI Chat
```
POST /api/respond_to_client
```
- Request Body:
```json
{
  "message": "I'm looking for a villa in Dubai Marina",
  "language": "en",
  "role": "buyer"
}
```
- Returns: AI response with suggested listings and next actions

### 3. Appointment Booking
```
POST /api/book_appointment
```
- Request Body:
```json
{
  "agent_email": "agent@example.com",
  "client_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "datetime": "2024-01-15T14:00:00Z",
  "property_id": "123"
}
```
- Returns: Booking confirmation with calendar link

### 4. Lead Scoring
```
POST /api/score_lead
```
- Request Body:
```json
{
  "chat_history": "I need to buy urgently...",
  "preferences": {
    "budget": 1500000,
    "location": "Dubai Marina",
    "urgency": "immediate"
  }
}
```
- Returns: Lead score (0-100), tag (hot/medium/cold), and scoring reasons

### 5. CRM Push
```
POST /api/push_lead
```
- Request Body:
```json
{
  "lead_data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "budget": 1500000,
    "score": 75
  },
  "crm_target": "bitrix"
}
```
- Returns: CRM sync status

### 6. Agency Configuration
```
GET /api/agency-config/{agency_id}
```
- Returns: Agency branding, languages, and preferences

### 7. Health Check
```
GET /api/healthcheck
```
- Returns: API status, uptime, and system information

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp api/.env.example .env
# Edit .env with your configuration
```

3. Run the API:
```bash
python run_api.py
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Environment Variables

- `API_KEY`: API authentication key
- `OPENAI_API_KEY`: OpenAI API key for chat functionality
- `SUPABASE_URL`: Supabase database URL
- `SUPABASE_KEY`: Supabase API key
- `BITRIX_WEBHOOK_URL`: Bitrix CRM webhook URL
- `PIPEDRIVE_API_KEY`: Pipedrive API key
- See `api/.env.example` for complete list

## CORS Configuration

By default, the API allows requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `https://serenity-ai.vercel.app`
- All origins (development mode)

Configure allowed origins in the `ALLOWED_ORIGINS` environment variable.

## Logging

API logs are stored in `logs/api.log` with automatic rotation (10MB max, 5 backups).

## Error Handling

All endpoints include comprehensive error handling with:
- Structured error responses
- Detailed logging
- Graceful fallbacks

## Security

- CORS middleware for cross-origin requests
- Input validation using Pydantic models
- Environment-based configuration
- API key authentication (when configured)

## Development

Run in development mode with auto-reload:
```bash
API_RELOAD=true python run_api.py
```

## Deployment

The API is designed to deploy on:
- **Vercel**: Use `vercel.json` configuration
- **Render**: Use `render.yaml` configuration
- **Cloud Run**: Use provided Dockerfile
- **Any Python hosting**: Standard WSGI/ASGI deployment

## Testing

Test the API using the interactive documentation at `/docs` or with curl:

```bash
# Get listings
curl http://localhost:8000/api/listings?budget=2000000&location=Dubai

# Chat with AI
curl -X POST http://localhost:8000/api/respond_to_client \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me villas", "language": "en", "role": "buyer"}'

# Health check
curl http://localhost:8000/api/healthcheck
```

## Contributing

1. Follow the existing code structure
2. Add comprehensive error handling
3. Update documentation for new endpoints
4. Include logging for debugging

## License

Proprietary - Serenity AI Agent 