from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import re

router = APIRouter()

class LeadPreferences(BaseModel):
    location: Optional[str] = None
    budget: Optional[float] = None
    urgency: Optional[str] = None

class LeadScoringRequest(BaseModel):
    chat_history: str
    preferences: LeadPreferences

class LeadScoringResponse(BaseModel):
    score: float
    tag: str
    reasons: List[str]

def calculate_lead_score(chat_history: str, preferences: LeadPreferences) -> tuple[float, List[str]]:
    score = 0.0
    reasons = []
    
    # Check for budget clarity
    if preferences.budget is not None:
        score += 0.3
        reasons.append(f"Clear budget specified: {preferences.budget}")
    elif re.search(r'\$\d+[kK]?|\d+\s*(million|k|M)', chat_history):
        score += 0.3
        reasons.append("Budget mentioned in conversation")
    
    # Check for location specificity
    if preferences.location:
        score += 0.3
        reasons.append(f"Specific location interest: {preferences.location}")
    elif re.search(r'(in|at|near|around)\s+[A-Z][a-zA-Z\s]+', chat_history):
        score += 0.3
        reasons.append("Location mentioned in conversation")
    
    # Check for urgency signals
    urgency_keywords = [
        r'urgent',
        r'this week',
        r'asap',
        r'cash buyer',
        r'ready to',
        r'immediately',
        r'quick',
        r'soon',
        r'right away'
    ]
    
    if preferences.urgency and preferences.urgency.lower() == 'high':
        score += 0.2
        reasons.append("High urgency indicated in preferences")
    elif any(re.search(keyword, chat_history.lower()) for keyword in urgency_keywords):
        score += 0.2
        reasons.append("Urgency signals detected in conversation")
    
    # Additional context-based scoring
    if re.search(r'pre-?approved|mortgage approved|loan approved', chat_history.lower()):
        score += 0.1
        reasons.append("Pre-approved for financing")
    
    if re.search(r'second viewing|follow.?up|another look', chat_history.lower()):
        score += 0.1
        reasons.append("Requesting follow-up viewings")
    
    # Ensure score doesn't exceed 1.0
    score = min(1.0, score)
    
    return score, reasons

@router.post("/api/score-lead", response_model=LeadScoringResponse)
async def score_lead(request: LeadScoringRequest) -> LeadScoringResponse:
    try:
        score, reasons = calculate_lead_score(request.chat_history, request.preferences)
        
        # Determine lead tag based on score
        tag = "cold"
        if score > 0.85:
            tag = "hot"
        elif score > 0.5:
            tag = "warm"
        
        return LeadScoringResponse(
            score=score,
            tag=tag,
            reasons=reasons
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 