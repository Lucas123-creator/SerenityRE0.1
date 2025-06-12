#!/usr/bin/env python
"""
Startup script for the Serenity AI Agent API
"""
import uvicorn
from api.main import app
import os
from pathlib import Path
from api.env_config import config

if __name__ == "__main__":
    # Create necessary directories
    Path("logs").mkdir(exist_ok=True)
    Path("agency_profiles").mkdir(exist_ok=True)
    
    # Get configuration from environment
    host = config.API_HOST
    port = config.API_PORT
    reload = config.API_RELOAD
    log_level = config.LOG_LEVEL.lower()
    
    print(f"Starting Serenity AI Agent API on {host}:{port}")
    print(f"Environment: {config.NODE_ENV}")
    print(f"Debug mode: {config.DEBUG}")
    print(f"Documentation will be available at http://localhost:{port}/docs")
    
    # Run the API
    uvicorn.run(
        "api.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level=log_level if log_level in ["critical", "error", "warning", "info", "debug", "trace"] else "info"
    ) 