from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import openai
import json
import os

router = APIRouter()

# --- Pydantic Models ---
class ClientRequest(BaseModel):
    message: str
    language: Optional[str] = 'en'

class Listing(BaseModel):
    id: str
    title: str
    location: str
    price: float
    type: str
    bedrooms: int
    url: Optional[str] = None

class LeadInfo(BaseModel):
    score: float
    tag: str
    escalate: bool

class ClientResponse(BaseModel):
    reply: str
    listings: List[Listing]
    lead: LeadInfo
    intent_summary: str
    escalate: Optional[bool] = False

# --- Helper: Mock filter_listings ---
def filter_listings(intent_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    # Return 3 mock listings based on intent_data
    return [
        {
            "id": "1",
            "title": "Modern Apartment in City Center",
            "location": intent_data.get("location", "Bucharest"),
            "price": 950000,
            "type": intent_data.get("type", "apartment"),
            "bedrooms": intent_data.get("bedrooms", 2),
            "url": "https://example.com/listing/1"
        },
        {
            "id": "2",
            "title": "Cozy Suburban House",
            "location": intent_data.get("location", "Cluj"),
            "price": 650000,
            "type": intent_data.get("type", "house"),
            "bedrooms": intent_data.get("bedrooms", 3),
            "url": "https://example.com/listing/2"
        },
        {
            "id": "3",
            "title": "Luxury Penthouse",
            "location": intent_data.get("location", "Constanta"),
            "price": 1850000,
            "type": intent_data.get("type", "penthouse"),
            "bedrooms": intent_data.get("bedrooms", 4),
            "url": "https://example.com/listing/3"
        },
    ]

# --- Helper: Mock lead scoring ---
def score_lead(chat_history, preferences) -> Dict[str, Any]:
    # Simple mock scoring
    score = 0.9 if 'buy' in preferences.get('intent', '') else 0.6
    tag = 'hot' if score > 0.8 else 'warm'
    escalate = score > 0.85
    return {"score": score, "tag": tag, "escalate": escalate}

# --- Helper: Save lead (simulate) ---
def save_lead(lead_data: Dict[str, Any]):
    try:
        with open('leads.json', 'a') as f:
            f.write(json.dumps(lead_data) + '\n')
    except Exception as e:
        print(f"Failed to save lead: {e}")

# --- AI Extraction ---
def extract_intent(message: str, language: str = 'en') -> Dict[str, Any]:
    system_prompt = f"""
    You are a real estate AI assistant. Extract the user's intent (buy, rent, view, ask), filters (location, price, type, bedrooms), and urgency keywords from the following message. Respond in JSON.
    """
    prompt = system_prompt + f"\nMessage: {message}\nLanguage: {language}"
    try:
        # Use OpenAI or Claude here; stubbed for now
        # response = openai.ChatCompletion.create(...)
        # intent_data = json.loads(response['choices'][0]['message']['content'])
        # Mocked intent extraction:
        if 'buy' in message.lower():
            intent = 'buy'
        elif 'rent' in message.lower():
            intent = 'rent'
        elif 'view' in message.lower():
            intent = 'view'
        else:
            intent = 'ask'
        return {
            "intent": intent,
            "location": "Bucharest" if 'bucharest' in message.lower() else "Cluj",
            "price": 1000000 if 'million' in message.lower() else 500000,
            "type": "apartment" if 'apartment' in message.lower() else "house",
            "bedrooms": 2 if '2br' in message.lower() else 3,
            "urgency": 'urgent' if 'urgent' in message.lower() else 'normal',
        }
    except Exception as e:
        print(f"AI extraction failed: {e}")
        return {"intent": "ask", "location": "", "price": 0, "type": "", "bedrooms": 0, "urgency": "normal"}

# --- Endpoint ---
@router.post("/api/respond_to_client", response_model=ClientResponse)
def respond_to_client(req: ClientRequest):
    # 1. Extract intent and filters
    try:
        intent_data = extract_intent(req.message, req.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI extraction failed: {e}")

    # 2. Filter listings
    listings = filter_listings(intent_data)

    # 3. Score lead
    lead_score = score_lead([req.message], intent_data)

    # 4. Save lead (simulate)
    lead_data = {
        "message": req.message,
        "intent": intent_data,
        "score": lead_score["score"],
        "tag": lead_score["tag"],
        "escalate": lead_score["escalate"],
    }
    save_lead(lead_data)

    # 5. If hot lead, escalate
    escalate = lead_score["escalate"]
    if escalate:
        # Simulate notification trigger (could POST to /api/notifications)
        print("Escalating hot lead notification!")

    # 6. Compose reply
    reply = f"Thank you for your message! Based on your interest to {intent_data['intent']} in {intent_data['location']}, here are some listings you might like."
    intent_summary = f"Intent: {intent_data['intent']}, Location: {intent_data['location']}, Price: {intent_data['price']}, Type: {intent_data['type']}, Bedrooms: {intent_data['bedrooms']}"

    return ClientResponse(
        reply=reply,
        listings=[Listing(**l) for l in listings],
        lead=LeadInfo(**lead_score),
        intent_summary=intent_summary,
        escalate=escalate
    ) 