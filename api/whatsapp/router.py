from fastapi import APIRouter, HTTPException, Depends, Request, Response, BackgroundTasks
from typing import Dict, Any, Optional
import json
import httpx
import logging
from datetime import datetime
import uuid

# Import config and schemas
try:
    from ..env_config import config
    from .schemas import WhatsAppMessage, WhatsAppResponse
    # For ClientRequest
    from ..respond_to_client import ClientRequest
except ImportError:
    # Fallback imports for development
    import os
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from env_config import config
    from whatsapp.schemas import WhatsAppMessage, WhatsAppResponse
    from respond_to_client import ClientRequest

# Set up logger
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/whatsapp", tags=["WhatsApp"])

# WhatsApp API client
class WhatsAppClient:
    def __init__(self):
        self.api_key = getattr(config, "WHATSAPP_API_KEY", "test_key")
        self.phone_number_id = getattr(config, "WHATSAPP_PHONE_NUMBER_ID", "test_id")
        self.base_url = f"https://graph.facebook.com/v17.0/{self.phone_number_id}"
        
    async def send_message(self, to: str, message: str) -> bool:
        """Send a text message via WhatsApp API"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {"body": message}
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/messages",
                    headers=headers,
                    json=payload
                )
                if response.status_code == 200:
                    logger.info(f"Message sent to {to}")
                    return True
                else:
                    logger.error(f"Failed to send message: {response.text}")
                    return False
        except Exception as e:
            logger.error(f"Error sending WhatsApp message: {str(e)}")
            return False

# Get WhatsApp client
def get_whatsapp_client():
    return WhatsAppClient()

# Process message with AI and send response
async def process_message(message: WhatsAppMessage, background_tasks: BackgroundTasks):
    """Process incoming WhatsApp message with AI and send response"""
    try:
        # Import here to avoid circular imports
        from ..respond_to_client import respond_to_client
        
        # Create AI request
        ai_request = ClientRequest(
            message=message.message,
            language="en"  # Default to English, could detect language
        )
        
        try:
            # Get AI response
            ai_response = respond_to_client(ai_request)
            
            # Format response for WhatsApp
            whatsapp_message = format_ai_response_for_whatsapp(ai_response)
            
            # Send response
            client = WhatsAppClient()
            await client.send_message(message.from_number, whatsapp_message)
            
            # If listings are available, send them
            if ai_response.listings:
                # Wait a moment before sending listings
                for idx, listing in enumerate(ai_response.listings[:3]):  # Limit to 3 listings
                    listing_message = format_listing_for_whatsapp(listing)
                    # Add slight delay between messages
                    await client.send_message(message.from_number, listing_message)
            
            # If lead should be escalated, notify agent
            if ai_response.escalate:
                # Create a lead in the system
                lead_id = await create_lead_from_whatsapp(message, ai_response)
                
                # Notify agent about hot lead (in background)
                background_tasks.add_task(
                    notify_agent_about_lead,
                    lead_id=lead_id,
                    phone=message.from_number,
                    message=message.message,
                    score=ai_response.lead.score
                )
                
            return True
        except Exception as e:
            logger.error(f"Error processing message with AI: {str(e)}")
            # Send fallback message
            client = WhatsAppClient()
            await client.send_message(
                message.from_number,
                "Thank you for your message! Our team will get back to you shortly."
            )
            return False
    except Exception as e:
        logger.error(f"Critical error in process_message: {str(e)}")
        return False

# Helper functions
def format_ai_response_for_whatsapp(ai_response: Any) -> str:
    """Format AI response for WhatsApp"""
    message = ai_response.reply
    
    # Add call to action if there are listings
    if ai_response.listings:
        message += "\n\nI'm sending you some properties that match your criteria."
    
    return message

def format_listing_for_whatsapp(listing: Any) -> str:
    """Format a property listing for WhatsApp"""
    return (
        f"🏡 *{listing.title}*\n"
        f"📍 {listing.location}\n"
        f"💰 ${listing.price:,.2f}\n"
        f"🛏️ {listing.bedrooms} bedrooms\n"
        f"🔗 View details: {listing.url or 'Link coming soon'}\n\n"
        f"Reply with 'Schedule' to book a viewing."
    )

async def create_lead_from_whatsapp(message: WhatsAppMessage, ai_response: Any) -> str:
    """Create a lead in the system from WhatsApp message"""
    # This would typically call your lead creation API
    # For now, we'll just log it
    lead_id = str(uuid.uuid4())
    logger.info(f"Created lead {lead_id} from WhatsApp {message.from_number}")
    return lead_id

async def notify_agent_about_lead(lead_id: str, phone: str, message: str, score: float):
    """Notify agent about a hot lead"""
    # This would typically send a notification to agents
    # For now, we'll just log it
    logger.info(f"🔥 HOT LEAD NOTIFICATION: Lead {lead_id} from {phone} with score {score}")
    # In a real implementation, you might:
    # 1. Send email to agents
    # 2. Send push notification
    # 3. Update dashboard with real-time alert

# Webhook endpoint for WhatsApp
@router.post("/inbound")
async def whatsapp_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    whatsapp: WhatsAppClient = Depends(get_whatsapp_client)
) -> Dict[str, Any]:
    """Handle incoming WhatsApp messages"""
    try:
        # Parse webhook payload
        payload = await request.json()
        logger.info(f"Received WhatsApp webhook: {json.dumps(payload)}")
        
        # Extract message data
        # Note: This is a simplified version. Real WhatsApp webhook has a more complex structure
        message_data = {
            "from": payload.get("from", ""),
            "message": payload.get("message", ""),
            "timestamp": payload.get("timestamp", datetime.now().isoformat()),
            "message_id": payload.get("message_id", str(uuid.uuid4())),
            "name": payload.get("name", "")
        }
        
        # Create WhatsApp message
        whatsapp_message = WhatsAppMessage(**message_data)
        
        # Process message in background
        background_tasks.add_task(process_message, whatsapp_message, background_tasks)
        
        # Return success immediately (WhatsApp expects quick response)
        return {"status": "success", "message": "Message received"}
    
    except Exception as e:
        logger.error(f"Error handling WhatsApp webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing webhook: {str(e)}")

# Verification endpoint for WhatsApp
@router.get("/inbound")
async def verify_webhook(request: Request) -> Response:
    """Verify WhatsApp webhook"""
    # WhatsApp sends a verification token when setting up the webhook
    verify_token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")
    
    if verify_token == getattr(config, "WHATSAPP_VERIFY_TOKEN", "test_token"):
        return Response(content=challenge)
    else:
        raise HTTPException(status_code=403, detail="Invalid verification token")

# Health check endpoint
@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Check if WhatsApp API is healthy"""
    return {"status": "ok", "service": "whatsapp"}
