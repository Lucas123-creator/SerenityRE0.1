from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from api.database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    intent = Column(
        Enum('buy', 'rent', 'book', name='lead_intent_enum'),
        nullable=False
    )
    budget = Column(Float, nullable=True)
    location = Column(String, nullable=False)
    score = Column(Float, nullable=False, default=0.0)
    tag = Column(
        Enum('hot', 'warm', 'cold', name='lead_tag_enum'),
        nullable=False,
        default='cold'
    )
    assigned_agent = Column(String, nullable=True)
    status = Column(
        Enum('new', 'contacted', 'closed', name='lead_status_enum'),
        nullable=False,
        default='new'
    )
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationship with notes
    notes = relationship("LeadNote", back_populates="lead", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Lead {self.name} ({self.tag})>"


class LeadNote(Base):
    __tablename__ = "lead_notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey('leads.id', ondelete='CASCADE'), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationship with lead
    lead = relationship("Lead", back_populates="notes")

    def __repr__(self):
        return f"<LeadNote for Lead {self.lead_id}>" 