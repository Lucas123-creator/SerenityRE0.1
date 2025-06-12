from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from ..database import Base

class AgencySettings(Base):
    __tablename__ = "agency_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    agency_id = Column(String, nullable=False, index=True)
    assistant_name = Column(String, nullable=False, default="Serenity")
    default_language = Column(String, nullable=False, default="en")
    timezone = Column(String, nullable=False, default="UTC")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    branding = relationship("BrandingSettings", back_populates="agency", uselist=False)
    integrations = relationship("IntegrationSettings", back_populates="agency")

class BrandingSettings(Base):
    __tablename__ = "branding_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    agency_id = Column(String, ForeignKey("agency_settings.agency_id"), nullable=False)
    logo_url = Column(String)
    primary_color = Column(String, default="#2563eb")  # Default blue
    secondary_color = Column(String, default="#1d4ed8")  # Darker blue
    chatbot_avatar = Column(String)
    custom_domain = Column(String)

    # Relationships
    agency = relationship("AgencySettings", back_populates="branding")

class IntegrationSettings(Base):
    __tablename__ = "integration_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    agency_id = Column(String, ForeignKey("agency_settings.agency_id"), nullable=False)
    integration_type = Column(String, nullable=False)  # calendar, crm, whatsapp, email
    access_token = Column(String)
    config_json = Column(JSONB, default={})
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    agency = relationship("AgencySettings", back_populates="integrations") 