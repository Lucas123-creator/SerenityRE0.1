from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
import json
import logging
from pathlib import Path

router = APIRouter()
logger = logging.getLogger(__name__)

# Mock data structure for property listings
MOCK_LISTINGS = [
    {
        "id": "1",
        "title": "Luxury Villa in Dubai Marina",
        "location": "Dubai Marina",
        "price": 2500000,
        "bedrooms": 4,
        "bathrooms": 3,
        "area": 3500,
        "type": "Villa",
        "description": "Stunning waterfront villa with panoramic views",
        "images": ["https://example.com/villa1.jpg"],
        "features": ["Swimming Pool", "Garden", "Parking", "Sea View"]
    },
    {
        "id": "2",
        "title": "Modern Apartment in Downtown",
        "location": "Downtown Dubai",
        "price": 1200000,
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 1200,
        "type": "Apartment",
        "description": "Contemporary apartment in the heart of the city",
        "images": ["https://example.com/apt1.jpg"],
        "features": ["Gym", "Concierge", "Parking"]
    }
]

@router.get("/listings")
async def get_listings(
    budget: Optional[int] = Query(None, description="Maximum budget"),
    location: Optional[str] = Query(None, description="Property location"),
    bedrooms: Optional[int] = Query(None, description="Number of bedrooms"),
    min_price: Optional[int] = Query(None, description="Minimum price"),
    property_type: Optional[str] = Query(None, description="Property type")
) -> List[dict]:
    """
    Get all or filtered property listings
    """
    try:
        # Try to load from listings.json if it exists
        listings_file = Path("listings_test.json")
        if listings_file.exists():
            with open(listings_file, 'r') as f:
                content = f.read().strip()
                if content and content != "[]":
                    listings = json.loads(content)
                else:
                    listings = MOCK_LISTINGS
        else:
            listings = MOCK_LISTINGS
        
        # Apply filters
        filtered_listings = listings
        
        if budget:
            filtered_listings = [l for l in filtered_listings if l.get('price', 0) <= budget]
        
        if min_price:
            filtered_listings = [l for l in filtered_listings if l.get('price', 0) >= min_price]
        
        if location:
            filtered_listings = [l for l in filtered_listings if location.lower() in l.get('location', '').lower()]
        
        if bedrooms:
            filtered_listings = [l for l in filtered_listings if l.get('bedrooms', 0) >= bedrooms]
        
        if property_type:
            filtered_listings = [l for l in filtered_listings if property_type.lower() in l.get('type', '').lower()]
        
        logger.info(f"Returning {len(filtered_listings)} listings with filters: budget={budget}, location={location}, bedrooms={bedrooms}")
        
        return filtered_listings
        
    except Exception as e:
        logger.error(f"Error getting listings: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving listings: {str(e)}") 