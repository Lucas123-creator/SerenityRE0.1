from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
import json
import os
from datetime import datetime
import uuid

from api.database import get_db
from .models import Property
from .schemas import (
    PropertyCreate, PropertyUpdate, PropertyResponse, PropertyList,
    PropertySearch, ImageUpload, PropertyType
)

router = APIRouter(
    prefix="/api/properties",
    tags=["properties"]
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

@router.get("", response_model=PropertyList)
def list_properties(
    location: Optional[str] = None,
    property_type: Optional[PropertyType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db)
):
    """
    List all properties with optional filtering
    """
    query = db.query(Property)

    # Apply filters
    if location:
        query = query.filter(Property.location.ilike(f"%{location}%"))
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)

    return paginate(query, page, size)

@router.get("/search", response_model=PropertyList)
def search_properties(
    search: PropertySearch,
    db: Session = Depends(get_db)
):
    """
    Search properties with advanced filtering and pagination
    """
    query = db.query(Property)
    
    filters = []
    if search.location:
        filters.append(Property.location.ilike(f"%{search.location}%"))
    if search.property_type:
        filters.append(Property.property_type == search.property_type)
    if search.min_price is not None:
        filters.append(Property.price >= search.min_price)
    if search.max_price is not None:
        filters.append(Property.price <= search.max_price)
    if search.bedrooms is not None:
        filters.append(Property.bedrooms >= search.bedrooms)

    if filters:
        query = query.filter(and_(*filters))

    return paginate(query, search.page, search.size)

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(
    property_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """
    Get a single property by ID
    """
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@router.post("", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(
    property: PropertyCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new property listing
    """
    db_property = Property(**property.model_dump())
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: uuid.UUID,
    property_update: PropertyUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing property
    """
    db_property = db.query(Property).filter(Property.id == property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    update_data = property_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_property, field, value)

    db_property.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_property)
    return db_property

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
    property_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """
    Delete a property
    """
    db_property = db.query(Property).filter(Property.id == property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db.delete(db_property)
    db.commit()

@router.post("/{property_id}/images", response_model=ImageUpload)
async def upload_property_images(
    property_id: uuid.UUID,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload one or more images for a property
    """
    db_property = db.query(Property).filter(Property.id == property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    # Create uploads directory if it doesn't exist
    upload_dir = f"uploads/properties/{property_id}"
    os.makedirs(upload_dir, exist_ok=True)

    urls = []
    for file in files:
        # Generate unique filename
        ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(upload_dir, filename)

        # Save file
        contents = await file.read()
        with open(filepath, "wb") as f:
            f.write(contents)

        # Generate URL
        url = f"/uploads/properties/{property_id}/{filename}"
        urls.append(url)

    # Update property with new image URLs
    current_images = json.loads(db_property.images) if db_property.images else []
    current_images.extend(urls)
    db_property.images = json.dumps(current_images)
    db_property.updated_at = datetime.utcnow()
    
    db.commit()
    return ImageUpload(urls=urls) 