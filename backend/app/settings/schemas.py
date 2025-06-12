from datetime import datetime
from typing import Optional, Dict, List
from uuid import UUID
from pydantic import BaseModel, Field, HttpUrl

# Agency Settings Schemas
class AgencySettingsBase(BaseModel):
    assistant_name: str = Field(default="Serenity")
    default_language: str = Field(default="en")
    timezone: str = Field(default="UTC")

class AgencySettingsCreate(AgencySettingsBase):
    agency_id: str

class AgencySettingsUpdate(AgencySettingsBase):
    pass

class AgencySettings(AgencySettingsBase):
    id: UUID
    agency_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Branding Settings Schemas
class BrandingSettingsBase(BaseModel):
    logo_url: Optional[HttpUrl] = None
    primary_color: str = Field(default="#2563eb")
    secondary_color: str = Field(default="#1d4ed8")
    chatbot_avatar: Optional[HttpUrl] = None
    custom_domain: Optional[str] = None

class BrandingSettingsCreate(BrandingSettingsBase):
    agency_id: str

class BrandingSettingsUpdate(BrandingSettingsBase):
    pass

class BrandingSettings(BrandingSettingsBase):
    id: UUID
    agency_id: str

    class Config:
        from_attributes = True

# Integration Settings Schemas
class IntegrationSettingsBase(BaseModel):
    integration_type: str = Field(..., description="Type of integration (calendar, crm, whatsapp, email)")
    access_token: Optional[str] = None
    config_json: Dict = Field(default_factory=dict)

class IntegrationSettingsCreate(IntegrationSettingsBase):
    agency_id: str

class IntegrationSettingsUpdate(IntegrationSettingsBase):
    pass

class IntegrationSettings(IntegrationSettingsBase):
    id: UUID
    agency_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Combined Response Schemas
class AgencySettingsResponse(BaseModel):
    settings: AgencySettings
    branding: Optional[BrandingSettings] = None

class IntegrationsListResponse(BaseModel):
    integrations: List[IntegrationSettings] 