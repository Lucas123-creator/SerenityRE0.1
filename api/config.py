from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging
import json
from pathlib import Path

router = APIRouter()
logger = logging.getLogger(__name__)

class AgencyConfig(BaseModel):
    agency_id: str
    agency_name: str
    logo_url: str
    primary_color: str
    secondary_color: str
    languages: List[str]
    chatbot_name: str
    welcome_message: str
    contact_info: dict

# Mock agency profiles
MOCK_AGENCIES = {
    "agency_001": {
        "agency_id": "agency_001",
        "agency_name": "Serenity Real Estate",
        "logo_url": "https://example.com/serenity-logo.png",
        "primary_color": "#2563EB",
        "secondary_color": "#1E40AF",
        "languages": ["en", "ar", "es"],
        "chatbot_name": "Serenity AI Assistant",
        "welcome_message": "Welcome to Serenity Real Estate! How can I help you find your dream property today?",
        "contact_info": {
            "phone": "+971-4-123-4567",
            "email": "info@serenity-re.com",
            "address": "Dubai Marina, Dubai, UAE"
        }
    },
    "agency_002": {
        "agency_id": "agency_002",
        "agency_name": "Premium Properties Dubai",
        "logo_url": "https://example.com/premium-logo.png",
        "primary_color": "#DC2626",
        "secondary_color": "#B91C1C",
        "languages": ["en", "ar"],
        "chatbot_name": "Premium AI Agent",
        "welcome_message": "Welcome to Premium Properties! Let me help you discover luxury properties in Dubai.",
        "contact_info": {
            "phone": "+971-4-987-6543",
            "email": "contact@premiumprop.ae",
            "address": "Downtown Dubai, UAE"
        }
    }
}

@router.get("/agency-config/{agency_id}", response_model=AgencyConfig)
async def get_agency_config(agency_id: str):
    """
    Get agency-specific configuration and branding
    """
    try:
        # Check if we have agency profile files
        agency_file = Path(f"agency_profiles/{agency_id}.json")
        
        if agency_file.exists():
            with open(agency_file, 'r') as f:
                agency_data = json.load(f)
        else:
            # Use mock data
            agency_data = MOCK_AGENCIES.get(agency_id)
            
            if not agency_data:
                # Return default configuration if agency not found
                agency_data = {
                    "agency_id": agency_id,
                    "agency_name": "Real Estate Agency",
                    "logo_url": "https://example.com/default-logo.png",
                    "primary_color": "#000000",
                    "secondary_color": "#666666",
                    "languages": ["en"],
                    "chatbot_name": "AI Assistant",
                    "welcome_message": "Welcome! How can I help you today?",
                    "contact_info": {
                        "phone": "+1-234-567-8900",
                        "email": "info@realestate.com",
                        "address": "123 Main St, City"
                    }
                }
                logger.warning(f"Agency {agency_id} not found, using default configuration")
        
        logger.info(f"Returning configuration for agency: {agency_id}")
        
        return AgencyConfig(**agency_data)
        
    except Exception as e:
        logger.error(f"Error getting agency config: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving agency configuration: {str(e)}") 