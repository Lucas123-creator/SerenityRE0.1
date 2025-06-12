from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class WhatsAppMessage(BaseModel):
    """WhatsApp message received from webhook"""
    from_number: str = Field(..., alias="from")
    message: str
    timestamp: Optional[str] = None
    message_id: Optional[str] = None
    name: Optional[str] = None
    
class WhatsAppResponse(BaseModel):
    """Response to send back to WhatsApp"""
    message: str
    media_url: Optional[str] = None
    buttons: Optional[List[Dict[str, str]]] = None
    
class WhatsAppConfig(BaseModel):
    """WhatsApp API configuration"""
    api_key: str
    phone_number_id: str
    business_account_id: str
    
class WhatsAppConversation(BaseModel):
    """WhatsApp conversation with a lead"""
    lead_id: Optional[str] = None
    phone_number: str
    messages: List[Dict[str, Any]] = []
    last_message_timestamp: Optional[str] = None
    assigned_agent: Optional[str] = None
    is_active: bool = True
