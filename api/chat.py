from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal
import logging
import sys
import os

# Add parent directory to path to import realestate_ai_assistant
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import environment configuration
from api.env_config import config

router = APIRouter()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    message: str
    language: Literal["en", "ar", "es"] = "en"
    role: Literal["buyer", "seller", "appointment"] = "buyer"

class PropertyCard(BaseModel):
    id: str
    title: str
    location: str
    price: int
    bedrooms: int
    bathrooms: int
    area: int
    image: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    suggested_listings: List[PropertyCard] = []
    next_action: Optional[str] = None

@router.post("/respond_to_client", response_model=ChatResponse)
async def respond_to_client(request: ChatRequest):
    """
    Handle AI conversation with clients
    """
    try:
        # Check if OpenAI API key is configured
        if not config.OPENAI_API_KEY:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Import the AI assistant module
        from realestate_ai_assistant import respond_to_client as ai_respond
        
        # Set OpenAI API key for the assistant
        os.environ["OPENAI_API_KEY"] = config.OPENAI_API_KEY
        
        # Call the AI assistant
        ai_response = ai_respond(
            client_message=request.message,
            language=request.language,
            role=request.role
        )
        
        # Parse suggested listings if any
        suggested_listings = []
        
        # Extract any property recommendations from the response
        # This is a simplified version - in production, you'd parse the AI response
        # to extract specific property recommendations
        if "property" in ai_response.lower() or "listing" in ai_response.lower():
            # Mock suggested listings based on context
            suggested_listings = [
                PropertyCard(
                    id="1",
                    title="Luxury Villa in Dubai Marina",
                    location="Dubai Marina",
                    price=2500000,
                    bedrooms=4,
                    bathrooms=3,
                    area=3500,
                    image="https://example.com/villa1.jpg"
                )
            ]
        
        # Determine next action based on response content
        next_action = None
        if "schedule" in ai_response.lower() or "viewing" in ai_response.lower():
            next_action = "schedule_viewing"
        elif "contact" in ai_response.lower() or "call" in ai_response.lower():
            next_action = "contact_agent"
        
        logger.info(f"Chat response generated for message: {request.message[:50]}...")
        
        return ChatResponse(
            response=ai_response,
            suggested_listings=suggested_listings,
            next_action=next_action
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}") 