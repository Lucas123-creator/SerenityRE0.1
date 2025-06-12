# Serenity Deployment Checklist

- [ ] Run `docker-compose up --build`
- [ ] Create PostgreSQL DB
- [ ] Add agency config via `/onboarding`
- [ ] Set `VITE_API_URL` for frontend
- [ ] Add SSL cert or use proxy
- [ ] Verify `/api/health` and `/dashboard` work 