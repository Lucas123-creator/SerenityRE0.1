from sqlalchemy import Column, String, Float, Integer, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from api.database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    location = Column(String, nullable=False)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    property_type = Column(
        Enum('apartment', 'house', 'villa', 'land', 'commercial', name='property_type_enum'),
        nullable=False
    )
    status = Column(
        Enum('active', 'sold', 'hidden', name='property_status_enum'),
        nullable=False,
        default='active'
    )
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # List of image URLs associated with the property
    images = Column(String, nullable=True)  # Stored as JSON string of URLs

    def __repr__(self):
        return f"<Property {self.title} at {self.location}>" 