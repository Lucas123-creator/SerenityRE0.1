from pydantic import BaseModel, Field, UUID4, HttpUrl
from typing import List, Optional
from datetime import datetime
from enum import Enum

class PropertyType(str, Enum):
    APARTMENT = "apartment"
    HOUSE = "house"
    VILLA = "villa"
    LAND = "land"
    COMMERCIAL = "commercial"

class PropertyStatus(str, Enum):
    ACTIVE = "active"
    SOLD = "sold"
    HIDDEN = "hidden"

class PropertyBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10)
    price: float = Field(..., gt=0)
    location: str = Field(..., min_length=3)
    bedrooms: int = Field(..., ge=0)
    bathrooms: int = Field(..., ge=0)
    property_type: PropertyType
    status: PropertyStatus = PropertyStatus.ACTIVE

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, min_length=10)
    price: Optional[float] = Field(None, gt=0)
    location: Optional[str] = Field(None, min_length=3)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    property_type: Optional[PropertyType] = None
    status: Optional[PropertyStatus] = None

class PropertyInDB(PropertyBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime
    images: Optional[List[HttpUrl]] = []

    class Config:
        from_attributes = True

class PropertyResponse(PropertyInDB):
    pass

class PropertyList(BaseModel):
    items: List[PropertyResponse]
    total: int
    page: int
    size: int
    pages: int

class PropertySearch(BaseModel):
    location: Optional[str] = None
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    property_type: Optional[PropertyType] = None
    page: int = Field(1, ge=1)
    size: int = Field(10, ge=1, le=100)

class ImageUpload(BaseModel):
    urls: List[HttpUrl] 