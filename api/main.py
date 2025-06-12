from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from logging.handlers import RotatingFileHandler
import os
from pathlib import Path

# Import environment configuration
from api.env_config import config

# Import routers
from api.listings import router as listings_router
from api.chat import router as chat_router
from api.booking import router as booking_router
from api.scoring import router as scoring_router
from api.crm import router as crm_router
from api.config import router as config_router
from api.healthcheck import router as healthcheck_router
from api.properties import router as properties_router
from api.leads import router as leads_router
from api.whatsapp import router as whatsapp_router

# Create logs directory if it doesn't exist
Path("logs").mkdir(exist_ok=True)

# Configure logging
log_level = getattr(logging, config.LOG_LEVEL.upper(), logging.INFO)
logging.basicConfig(level=log_level)
logger = logging.getLogger(__name__)

# Create a rotating file handler
file_handler = RotatingFileHandler(
    config.LOG_FILE,
    maxBytes=10485760,  # 10MB
    backupCount=5
)
file_handler.setFormatter(
    logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
)
logger.addHandler(file_handler)

# Create FastAPI app
app = FastAPI(
    title="Serenity AI Agent API",
    description="API for Serenity Real Estate AI Assistant",
    version="1.0.0"
)

# Configure CORS
if config.ALLOWED_ORIGINS and config.ALLOWED_ORIGINS[0]:
    origins = [origin.strip() for origin in config.ALLOWED_ORIGINS if origin.strip()]
else:
    # Default origins for development
    origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://serenity-ai.vercel.app"
    ]

# Add wildcard for development if CORS_ALLOW_ALL is true
if config.CORS_ALLOW_ALL:
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# Include routers
app.include_router(listings_router, prefix="/api", tags=["listings"])
app.include_router(chat_router, prefix="/api", tags=["chat"])
app.include_router(booking_router, prefix="/api", tags=["booking"])
app.include_router(scoring_router, prefix="/api", tags=["scoring"])
app.include_router(crm_router, prefix="/api", tags=["crm"])
app.include_router(config_router, prefix="/api", tags=["config"])
app.include_router(healthcheck_router, prefix="/api", tags=["health"])
app.include_router(properties_router)
app.include_router(leads_router)
app.include_router(whatsapp_router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Serenity AI Agent API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 