from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
from ..database import get_db
from .models import AgencySettings, BrandingSettings, IntegrationSettings
from .schemas import (
    AgencySettingsResponse, AgencySettingsUpdate, BrandingSettings, BrandingSettingsUpdate,
    IntegrationsListResponse, IntegrationSettingsCreate
)

router = APIRouter(prefix="/api/settings", tags=["Settings"])

# Helper: get agency_id from query or header (stub for now)
def get_agency_id(agency_id: str = Query(..., description="Agency ID for tenant scoping")):
    if not agency_id:
        raise HTTPException(status_code=401, detail="Missing or unauthenticated agency ID")
    return agency_id

@router.get("", response_model=AgencySettingsResponse)
def get_settings(
    agency_id: str = Depends(get_agency_id),
    db: Session = Depends(get_db)
):
    settings = db.query(AgencySettings).filter_by(agency_id=agency_id).first()
    branding = db.query(BrandingSettings).filter_by(agency_id=agency_id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Agency settings not found")
    return {"settings": settings, "branding": branding}

@router.put("", response_model=AgencySettingsResponse)
def update_settings(
    update: AgencySettingsUpdate,
    agency_id: str = Depends(get_agency_id),
    db: Session = Depends(get_db)
):
    settings = db.query(AgencySettings).filter_by(agency_id=agency_id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Agency settings not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    db.refresh(settings)
    branding = db.query(BrandingSettings).filter_by(agency_id=agency_id).first()
    return {"settings": settings, "branding": branding}

@router.get("/branding", response_model=BrandingSettings)
def get_branding(
    agency_id: str = Depends(get_agency_id),
    db: Session = Depends(get_db)
):
    branding = db.query(BrandingSettings).filter_by(agency_id=agency_id).first()
    if not branding:
        raise HTTPException(status_code=404, detail="Branding settings not found")
    return branding

@router.put("/branding", response_model=BrandingSettings)
def update_branding(
    update: BrandingSettingsUpdate,
    agency_id: str = Depends(get_agency_id),
    db: Session = Depends(get_db)
):
    branding = db.query(BrandingSettings).filter_by(agency_id=agency_id).first()
    if not branding:
        raise HTTPException(status_code=404, detail="Branding settings not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(branding, field, value)
    db.commit()
    db.refresh(branding)
    return branding

@router.get("/integrations", response_model=IntegrationsListResponse)
def list_integrations(
    agency_id: str = Depends(get_agency_id),
    db: Session = Depends(get_db)
):
    integrations = db.query(IntegrationSettings).filter_by(agency_id=agency_id).all()
    return {"integrations": integrations}

@router.post("/integrations", response_model=IntegrationsListResponse, status_code=status.HTTP_201_CREATED)
def add_integration(
    integration: IntegrationSettingsCreate,
    agency_id: str = Depends(get_agency_id),
    db: Session = Depends(get_db)
):
    new_integration = IntegrationSettings(**integration.dict(), agency_id=agency_id)
    db.add(new_integration)
    db.commit()
    integrations = db.query(IntegrationSettings).filter_by(agency_id=agency_id).all()
    return {"integrations": integrations}

@router.delete("/integrations/{integration_id}", response_model=IntegrationsListResponse)
def delete_integration(
    integration_id: UUID,
    agency_id: str = Depends(get_agency_id),
    db: Session = Depends(get_db)
):
    integration = db.query(IntegrationSettings).filter_by(id=integration_id, agency_id=agency_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    db.delete(integration)
    db.commit()
    integrations = db.query(IntegrationSettings).filter_by(agency_id=agency_id).all()
    return {"integrations": integrations} 