from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Literal
import logging
import json
import sys
import os
from datetime import datetime

# Add parent directory to path to import integration module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import environment configuration
from api.env_config import config

router = APIRouter()
logger = logging.getLogger(__name__)

class CRMPushRequest(BaseModel):
    lead_data: Dict[str, Any]
    crm_target: Literal["bitrix", "pipedrive", "custom"] = "bitrix"

class CRMPushResponse(BaseModel):
    success: bool
    crm_id: str
    message: str
    sync_timestamp: str

@router.post("/push_lead", response_model=CRMPushResponse)
async def push_lead_to_crm(request: CRMPushRequest):
    """
    Push lead data to the specified CRM system
    """
    try:
        # Import the integration module
        from integration import push_to_bitrix_crm
        
        # Prepare lead data with required fields
        lead_data = {
            "name": request.lead_data.get("name", "Unknown Lead"),
            "email": request.lead_data.get("email", ""),
            "phone": request.lead_data.get("phone", ""),
            "source": request.lead_data.get("source", "Serenity AI Agent"),
            "budget": request.lead_data.get("budget", 0),
            "location": request.lead_data.get("location", ""),
            "property_type": request.lead_data.get("property_type", ""),
            "notes": request.lead_data.get("notes", ""),
            "score": request.lead_data.get("score", 0),
            "tag": request.lead_data.get("tag", "cold"),
            "created_at": datetime.now().isoformat()
        }
        
        # Log to CRM log file
        try:
            with open("crm_log.json", "r") as f:
                crm_logs = json.load(f)
        except:
            crm_logs = []
        
        # Generate CRM ID
        crm_id = f"CRM{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Add to log
        log_entry = {
            "crm_id": crm_id,
            "crm_target": request.crm_target,
            "lead_data": lead_data,
            "timestamp": datetime.now().isoformat()
        }
        crm_logs.append(log_entry)
        
        # Save log
        with open("crm_log.json", "w") as f:
            json.dump(crm_logs, f, indent=2)
        
        # Push to CRM based on target
        if request.crm_target == "bitrix":
            # Check if Bitrix webhook is configured
            if not config.BITRIX_WEBHOOK_URL:
                raise HTTPException(status_code=500, detail="Bitrix webhook URL not configured")
                
            # Set environment variable for integration module
            os.environ["BITRIX_WEBHOOK_URL"] = config.BITRIX_WEBHOOK_URL
            
            # Call Bitrix CRM integration
            result = push_to_bitrix_crm(
                name=lead_data["name"],
                email=lead_data["email"],
                phone=lead_data["phone"],
                source=lead_data["source"],
                comments=f"Budget: {lead_data['budget']}, Location: {lead_data['location']}, Score: {lead_data['score']} ({lead_data['tag']})"
            )
            
        elif request.crm_target == "pipedrive":
            # Check if Pipedrive is configured
            if not config.PIPEDRIVE_API_KEY:
                raise HTTPException(status_code=500, detail="Pipedrive API key not configured")
                
            # Set environment variables for Pipedrive
            os.environ["PIPEDRIVE_API_KEY"] = config.PIPEDRIVE_API_KEY
            os.environ["PIPEDRIVE_DOMAIN"] = config.PIPEDRIVE_DOMAIN
            
            # Mock Pipedrive integration (replace with actual implementation)
            result = {
                "success": True,
                "id": crm_id,
                "message": f"Lead pushed to Pipedrive domain: {config.PIPEDRIVE_DOMAIN}"
            }
            
        else:
            # Custom CRM integration
            result = {
                "success": True,
                "id": crm_id,
                "message": "Lead pushed to custom CRM (mock)"
            }
        
        logger.info(f"Lead {crm_id} pushed to {request.crm_target} CRM")
        
        return CRMPushResponse(
            success=True,
            crm_id=crm_id,
            message=f"Lead successfully pushed to {request.crm_target}",
            sync_timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error pushing lead to CRM: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error pushing lead to CRM: {str(e)}") 