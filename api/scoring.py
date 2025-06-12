from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Literal
import logging
import sys
import os

# Add parent directory to path if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

router = APIRouter()
logger = logging.getLogger(__name__)

class LeadPreferences(BaseModel):
    budget: int
    location: str
    urgency: Literal["immediate", "3_months", "6_months", "exploring"] = "exploring"

class LeadScoringRequest(BaseModel):
    chat_history: str
    preferences: LeadPreferences

class LeadScoringResponse(BaseModel):
    score: float
    tag: Literal["hot", "medium", "cold"]
    reasons: List[str]

@router.post("/score_lead", response_model=LeadScoringResponse)
async def score_lead(request: LeadScoringRequest):
    """
    Score a lead based on chat history and preferences
    """
    try:
        # Initialize scoring variables
        score = 0.0
        reasons = []
        
        # Score based on urgency
        urgency_scores = {
            "immediate": 40,
            "3_months": 30,
            "6_months": 20,
            "exploring": 10
        }
        urgency_score = urgency_scores.get(request.preferences.urgency, 10)
        score += urgency_score
        reasons.append(f"Urgency: {request.preferences.urgency} (+{urgency_score} points)")
        
        # Score based on budget
        if request.preferences.budget > 2000000:
            score += 20
            reasons.append("High budget buyer (+20 points)")
        elif request.preferences.budget > 1000000:
            score += 15
            reasons.append("Medium-high budget buyer (+15 points)")
        elif request.preferences.budget > 500000:
            score += 10
            reasons.append("Medium budget buyer (+10 points)")
        else:
            score += 5
            reasons.append("Entry-level budget buyer (+5 points)")
        
        # Analyze chat history for buying signals
        chat_lower = request.chat_history.lower()
        
        # Strong buying signals
        strong_signals = [
            ("ready to buy", 15),
            ("need to move", 15),
            ("mortgage approved", 20),
            ("cash buyer", 20),
            ("viewing", 10),
            ("schedule", 10),
            ("when can i see", 10)
        ]
        
        for signal, points in strong_signals:
            if signal in chat_lower:
                score += points
                reasons.append(f"Strong buying signal: '{signal}' (+{points} points)")
        
        # Questions indicating serious interest
        serious_questions = [
            ("price negotiable", 5),
            ("payment plan", 5),
            ("maintenance fee", 5),
            ("available", 5),
            ("school", 5),
            ("amenities", 5)
        ]
        
        for question, points in serious_questions:
            if question in chat_lower:
                score += points
                reasons.append(f"Serious inquiry: '{question}' (+{points} points)")
        
        # Normalize score to 0-100
        score = min(score, 100)
        
        # Determine tag based on score
        if score >= 70:
            tag = "hot"
        elif score >= 40:
            tag = "medium"
        else:
            tag = "cold"
        
        logger.info(f"Lead scored: {score} ({tag}) - Budget: {request.preferences.budget}, Urgency: {request.preferences.urgency}")
        
        return LeadScoringResponse(
            score=score,
            tag=tag,
            reasons=reasons
        )
        
    except Exception as e:
        logger.error(f"Error scoring lead: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error scoring lead: {str(e)}") 