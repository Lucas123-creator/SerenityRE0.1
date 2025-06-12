# Serenity – Real Estate AI Platform

## Project Overview
Serenity is a modern, AI-powered real estate CRM and client engagement platform. It combines conversational AI, CRM sync, WhatsApp integration, and agent productivity tools to help agencies deliver a premium, automated experience for buyers and sellers.

## Features Summary
- **AI Assistant**: Natural language chat for property search, lead qualification, and instant replies
- **CRM Sync**: Two-way integration with major CRMs (HubSpot, Salesforce, Pipedrive, custom)
- **WhatsApp Integration**: QR code chat, direct messaging, and lead escalation
- **Agent Dashboard**: Modern, responsive UI with analytics, lead management, and booking tools
- **PDF & Share**: Export property summaries, share via link or WhatsApp
- **Onboarding Wizard**: Guided agency setup, branding, and integrations
- **Lead Timeline**: Full audit trail of AI, agent, and CRM events
- **Notifications**: Real-time alerts for hot leads, bookings, and sync issues
- **Mobile-First**: Fully responsive, SaaS-grade design

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI**: OpenAI/Claude API
- **Messaging**: WhatsApp Cloud API
- **Deployment**: Docker, Railway (backend), Vercel (frontend)

## Setup Instructions

### 1. Clone the repo
```sh
git clone https://github.com/your-org/serenity.git
cd serenity
```

### 2. Install dependencies
- **Backend**:
  ```sh
  cd api
  pip install -r ../requirements.txt
  ```
- **Frontend**:
  ```sh
  cd web-ui
  npm install
  ```

### 3. Configure environment variables
- Copy `.env.example` to `.env` in both root and `web-ui/` as needed
- Fill in all required API keys and URLs

### 4. Run the backend
```sh
cd api
uvicorn main:app --reload
```

### 5. Run the frontend
```sh
cd web-ui
npm run dev
```

## Folder Structure Overview
```
serenity/
├── api/                # FastAPI backend
├── web-ui/             # React frontend
├── requirements.txt    # Python deps
├── Dockerfile          # Backend Docker
├── docker-compose.yml  # Full stack deploy
├── .env.example        # Env variable template
├── README.md           # This file
```

## Deployment Notes
- Use `docker-compose up --build` for full stack deployment
- Set up PostgreSQL and run migrations if needed
- Deploy backend to Railway, frontend to Vercel (or similar)
- Set `VITE_API_URL` in frontend to point to backend API
- Add SSL certs or use a proxy for HTTPS
- Health check: `/api/health` (backend), `/dashboard` (frontend)

## Demo Credentials (optional)
- Email: `demo@serenity.agency`
- Password: `demo1234`

---
For support or questions, contact the Serenity team. 