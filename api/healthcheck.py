from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import logging
import psutil
import os

router = APIRouter()
logger = logging.getLogger(__name__)

class HealthCheckResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    uptime_seconds: float
    system_info: dict

# Track start time
START_TIME = datetime.now()

@router.get("/healthcheck", response_model=HealthCheckResponse)
async def health_check():
    """
    Check API health status and system information
    """
    try:
        # Calculate uptime
        uptime = (datetime.now() - START_TIME).total_seconds()
        
        # Get system information
        system_info = {
            "cpu_percent": psutil.cpu_percent(interval=0.1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "python_version": os.sys.version.split()[0],
            "platform": os.sys.platform
        }
        
        logger.info("Health check performed successfully")
        
        return HealthCheckResponse(
            status="ok",
            timestamp=datetime.now().isoformat(),
            version="1.0.0",
            uptime_seconds=uptime,
            system_info=system_info
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return HealthCheckResponse(
            status="error",
            timestamp=datetime.now().isoformat(),
            version="1.0.0",
            uptime_seconds=0,
            system_info={"error": str(e)}
        ) 