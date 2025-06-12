from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import json
import os
from typing import List, Dict, Optional
from .utils.listings_filter import filter_listings
from .lead_scoring import router as lead_scoring_router

# Load OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set")

app = FastAPI()

# Include the lead scoring router
app.include_router(lead_scoring_router)

class ClientMessage(BaseModel):
    message: str

class ListingResponse(BaseModel):
    title: str
    price: float
    location: str
    image: str

class AIResponse(BaseModel):
    response: str
    suggested_listings: List[ListingResponse]

def extract_intent_from_gpt(response_text: str) -> Dict:
    """Parse GPT response into a structured dictionary"""
    try:
        # Remove any markdown or extra formatting
        clean_text = response_text.strip().replace("```json\n", "").replace("\n```", "")
        return json.loads(clean_text)
    except json.JSONDecodeError:
        # Fallback to empty dict if parsing fails
        return {}

@app.post("/api/respond-to-client", response_model=AIResponse)
async def respond_to_client(client_message: ClientMessage):
    try:
        # Prepare the prompt for GPT
        prompt = f"""You are an AI real estate agent. Extract the following information from this message:
        - intent (buy/rent/book)
        - price/budget
        - location
        - bedrooms
        - property type (apartment, villa, etc.)
        
        Format your response as a JSON object with these fields.
        
        Client message: {client_message.message}
        
        Response format:
        {{
            "intent": "buy/rent/book",
            "budget": number,
            "location": "string",
            "bedrooms": number,
            "type": "string"
        }}"""

        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful real estate assistant that extracts structured information from client messages."},
                {"role": "user", "content": prompt}
            ]
        )

        # Extract structured intent from GPT response
        intent_data = extract_intent_from_gpt(response.choices[0].message.content)

        # Get matching listings
        suggested_listings = filter_listings(intent_data)

        # Generate natural language response
        response_prompt = f"""Based on the client's requirements:
        - Intent: {intent_data.get('intent')}
        - Budget: {intent_data.get('budget')}
        - Location: {intent_data.get('location')}
        - Bedrooms: {intent_data.get('bedrooms')}
        - Type: {intent_data.get('type')}
        
        Generate a helpful and professional response. Mention the number of matching properties found."""

        natural_response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful real estate assistant."},
                {"role": "user", "content": response_prompt}
            ]
        )

        return AIResponse(
            response=natural_response.choices[0].message.content,
            suggested_listings=suggested_listings
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 