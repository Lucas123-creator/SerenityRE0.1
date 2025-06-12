from pydantic import BaseModel, Field, UUID4, EmailStr, constr
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class LeadIntent(str, Enum):
    BUY = "buy"
    RENT = "rent"
    BOOK = "book"

class LeadTag(str, Enum):
    HOT = "hot"
    WARM = "warm"
    COLD = "cold"

class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    CLOSED = "closed"

class LeadPreferences(BaseModel):
    budget: Optional[float] = None
    location: Optional[str] = None
    urgency: Optional[str] = None

class LeadBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: constr(regex=r'^\+?1?\d{9,15}$')
    intent: LeadIntent
    budget: Optional[float] = None
    location: str
    assigned_agent: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[constr(regex=r'^\+?1?\d{9,15}$')] = None
    intent: Optional[LeadIntent] = None
    budget: Optional[float] = None
    location: Optional[str] = None
    assigned_agent: Optional[str] = None
    status: Optional[LeadStatus] = None

class LeadNoteBase(BaseModel):
    text: str = Field(..., min_length=1)

class LeadNoteCreate(LeadNoteBase):
    pass

class LeadNoteInDB(LeadNoteBase):
    id: UUID4
    lead_id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class LeadInDB(LeadBase):
    id: UUID4
    score: float
    tag: LeadTag
    status: LeadStatus
    created_at: datetime
    notes: List[LeadNoteInDB] = []

    class Config:
        from_attributes = True

class LeadResponse(LeadInDB):
    pass

class LeadList(BaseModel):
    items: List[LeadResponse]
    total: int
    page: int
    size: int
    pages: int

class LeadSearch(BaseModel):
    query: Optional[str] = None
    status: Optional[LeadStatus] = None
    tag: Optional[LeadTag] = None
    assigned_agent: Optional[str] = None
    page: int = Field(1, ge=1)
    size: int = Field(10, ge=1, le=100)

class LeadScoreRequest(BaseModel):
    chat_history: str
    preferences: LeadPreferences

class LeadScoreResponse(BaseModel):
    score: float = Field(..., ge=0.0, le=1.0)
    tag: LeadTag
    reasons: List[str]

class LeadAnalytics(BaseModel):
    total_leads: int
    hot_leads_percentage: float
    conversion_rate: float
    lead_sources: Dict[str, int]
    leads_by_status: Dict[str, int]
    leads_by_tag: Dict[str, int]
    recent_conversion_trend: List[Dict[str, any]] 