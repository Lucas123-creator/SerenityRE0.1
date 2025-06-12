from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import re

from api.database import get_db
from .models import Lead, LeadNote
from .schemas import (
    LeadCreate, LeadUpdate, LeadResponse, LeadList, LeadSearch,
    LeadNoteCreate, LeadNoteInDB, LeadScoreRequest, LeadScoreResponse,
    LeadAnalytics, LeadTag
)

router = APIRouter(
    prefix="/api/leads",
    tags=["leads"]
)

# Helper function for pagination
def paginate(query, page: int = 1, size: int = 10):
    total = query.count()
    items = query.offset((page - 1) * size).limit(size).all()
    pages = (total + size - 1) // size
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }

@router.get("", response_model=LeadList)
def list_leads(
    search: LeadSearch = Depends(),
    db: Session = Depends(get_db)
):
    """
    List all leads with optional filtering and search
    """
    query = db.query(Lead)

    # Apply filters
    if search.status:
        query = query.filter(Lead.status == search.status)
    if search.tag:
        query = query.filter(Lead.tag == search.tag)
    if search.assigned_agent:
        query = query.filter(Lead.assigned_agent == search.assigned_agent)
    if search.query:
        search_filter = or_(
            Lead.name.ilike(f"%{search.query}%"),
            Lead.email.ilike(f"%{search.query}%"),
            Lead.location.ilike(f"%{search.query}%")
        )
        query = query.filter(search_filter)

    # Order by created_at desc
    query = query.order_by(Lead.created_at.desc())
    
    return paginate(query, search.page, search.size)

@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """
    Get a single lead by ID
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(
    lead: LeadCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new lead
    """
    db_lead = Lead(**lead.model_dump())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: uuid.UUID,
    lead_update: LeadUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing lead
    """
    db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    update_data = lead_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_lead, field, value)

    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.post("/{lead_id}/notes", response_model=LeadNoteInDB)
def add_lead_note(
    lead_id: uuid.UUID,
    note: LeadNoteCreate,
    db: Session = Depends(get_db)
):
    """
    Add a note to a lead
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    db_note = LeadNote(**note.model_dump(), lead_id=lead_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.get("/{lead_id}/notes", response_model=List[LeadNoteInDB])
def get_lead_notes(
    lead_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """
    Get all notes for a lead
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return db.query(LeadNote).filter(LeadNote.lead_id == lead_id).order_by(LeadNote.created_at.desc()).all()

@router.post("/score", response_model=LeadScoreResponse)
def score_lead(
    request: LeadScoreRequest,
    db: Session = Depends(get_db)
):
    """
    Score a lead based on chat history and preferences
    """
    score = 0.0
    reasons = []

    # Score based on chat history
    urgency_keywords = ['urgent', 'asap', 'quickly', 'soon', 'immediately']
    interest_keywords = ['interested', 'looking', 'want', 'need']
    budget_pattern = r'\$?\d+[kK]?'

    chat_lower = request.chat_history.lower()

    # Check urgency signals (30% weight)
    urgency_score = sum(keyword in chat_lower for keyword in urgency_keywords) * 0.1
    if urgency_score > 0:
        reasons.append(f"Detected urgency signals in conversation")
        score += min(urgency_score, 0.3)

    # Check interest signals (20% weight)
    interest_score = sum(keyword in chat_lower for keyword in interest_keywords) * 0.1
    if interest_score > 0:
        reasons.append(f"Shows clear interest in property")
        score += min(interest_score, 0.2)

    # Check budget clarity (30% weight)
    if request.preferences.budget:
        score += 0.3
        reasons.append("Clear budget specified")
    elif re.search(budget_pattern, chat_lower):
        score += 0.2
        reasons.append("Budget mentioned in conversation")

    # Check location specificity (20% weight)
    if request.preferences.location:
        score += 0.2
        reasons.append("Specific location preference")

    # Normalize score to 0-1
    score = min(max(score, 0.0), 1.0)

    # Determine tag based on score
    tag = LeadTag.COLD
    if score >= 0.7:
        tag = LeadTag.HOT
    elif score >= 0.4:
        tag = LeadTag.WARM

    return LeadScoreResponse(
        score=score,
        tag=tag,
        reasons=reasons
    )

@router.get("/analytics", response_model=LeadAnalytics)
def get_lead_analytics(
    db: Session = Depends(get_db)
):
    """
    Get lead analytics and statistics
    """
    # Get total leads
    total_leads = db.query(func.count(Lead.id)).scalar()

    # Get leads created in the last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_leads = db.query(Lead).filter(Lead.created_at >= week_ago).all()
    hot_leads = [lead for lead in recent_leads if lead.tag == LeadTag.HOT]
    hot_leads_percentage = (len(hot_leads) / len(recent_leads) * 100) if recent_leads else 0

    # Calculate conversion rate (leads marked as closed)
    closed_leads = db.query(func.count(Lead.id)).filter(Lead.status == 'closed').scalar()
    conversion_rate = (closed_leads / total_leads * 100) if total_leads > 0 else 0

    # Get lead source breakdown (mocked for now)
    lead_sources = {
        "website": 45,
        "referral": 30,
        "social": 15,
        "direct": 10
    }

    # Get leads by status
    leads_by_status = {
        status: db.query(func.count(Lead.id)).filter(Lead.status == status).scalar()
        for status in ['new', 'contacted', 'closed']
    }

    # Get leads by tag
    leads_by_tag = {
        tag: db.query(func.count(Lead.id)).filter(Lead.tag == tag).scalar()
        for tag in ['hot', 'warm', 'cold']
    }

    # Recent conversion trend (last 7 days)
    trend = []
    for i in range(7):
        date = datetime.utcnow() - timedelta(days=i)
        converted = db.query(func.count(Lead.id)).filter(
            Lead.status == 'closed',
            func.date(Lead.created_at) == date.date()
        ).scalar()
        trend.append({
            "date": date.date().isoformat(),
            "conversions": converted
        })

    return LeadAnalytics(
        total_leads=total_leads,
        hot_leads_percentage=hot_leads_percentage,
        conversion_rate=conversion_rate,
        lead_sources=lead_sources,
        leads_by_status=leads_by_status,
        leads_by_tag=leads_by_tag,
        recent_conversion_trend=trend
    ) 