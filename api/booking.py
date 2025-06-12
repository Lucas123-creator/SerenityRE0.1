from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import logging
import json
import sys
import os

# Add parent directory to path to import integration module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import environment configuration
from api.env_config import config

router = APIRouter()
logger = logging.getLogger(__name__)

class ClientInfo(BaseModel):
    name: str
    email: EmailStr
    phone: str

class BookingRequest(BaseModel):
    agent_email: EmailStr
    client_info: ClientInfo
    datetime: str  # ISO format
    property_id: str

class BookingResponse(BaseModel):
    booking_id: str
    status: str
    confirmation_message: str
    calendar_link: Optional[str] = None

@router.post("/book_appointment", response_model=BookingResponse)
async def book_appointment(request: BookingRequest):
    """
    Book a property viewing appointment
    """
    try:
        # Import the integration module
        from integration import book_viewing
        
        # Parse the datetime
        appointment_datetime = datetime.fromisoformat(request.datetime.replace('Z', '+00:00'))
        
        # Call the booking function
        booking_result = book_viewing(
            agent_email=request.agent_email,
            client_name=request.client_info.name,
            client_email=request.client_info.email,
            client_phone=request.client_info.phone,
            date=appointment_datetime.strftime("%Y-%m-%d"),
            time=appointment_datetime.strftime("%H:%M"),
            property_address=f"Property #{request.property_id}"  # In production, fetch actual address
        )
        
        # Generate booking ID
        booking_id = f"BK{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Log the appointment
        appointment_data = {
            "booking_id": booking_id,
            "agent_email": request.agent_email,
            "client_info": request.client_info.dict(),
            "datetime": request.datetime,
            "property_id": request.property_id,
            "created_at": datetime.now().isoformat()
        }
        
        # Save to appointments.json
        try:
            with open("appointments.json", "r") as f:
                appointments = json.load(f)
        except:
            appointments = []
        
        appointments.append(appointment_data)
        
        with open("appointments.json", "w") as f:
            json.dump(appointments, f, indent=2)
        
        logger.info(f"Booking created: {booking_id} for property {request.property_id}")
        
        return BookingResponse(
            booking_id=booking_id,
            status="confirmed",
            confirmation_message=f"Your viewing for property #{request.property_id} has been scheduled for {appointment_datetime.strftime('%B %d, %Y at %I:%M %p')}",
            calendar_link=booking_result.get("calendar_link")
        )
        
    except Exception as e:
        logger.error(f"Error booking appointment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error booking appointment: {str(e)}") 