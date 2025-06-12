import json
from typing import List, Dict
import os
from pathlib import Path

def load_listings() -> List[Dict]:
    """Load listings from the JSON file"""
    listings_path = Path(__file__).parent.parent.parent / "listings.json"
    try:
        with open(listings_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def price_within_range(listing_price: float, target_price: float, tolerance: float = 0.1) -> bool:
    """Check if listing price is within ±10% of target price"""
    lower_bound = target_price * (1 - tolerance)
    upper_bound = target_price * (1 + tolerance)
    return lower_bound <= listing_price <= upper_bound

def location_matches(listing_location: str, target_location: str) -> bool:
    """Check if locations match (case-insensitive partial match)"""
    return target_location.lower() in listing_location.lower()

def filter_listings(intent: Dict) -> List[Dict]:
    """
    Filter listings based on intent parameters
    
    Args:
        intent: Dict containing:
            - intent (buy/rent/book)
            - budget (float)
            - location (str)
            - bedrooms (int)
            - type (str)
    
    Returns:
        List of matching listings (max 3)
    """
    listings = load_listings()
    if not listings:
        return []

    # Extract criteria from intent
    budget = intent.get('budget')
    location = intent.get('location', '').strip()
    property_type = intent.get('type', '').lower()
    bedrooms = intent.get('bedrooms')

    filtered_listings = []
    
    for listing in listings:
        # Skip if essential criteria don't match
        if location and not location_matches(listing['location'], location):
            continue
            
        if budget and not price_within_range(listing['price'], budget):
            continue
            
        if property_type and property_type not in listing.get('type', '').lower():
            continue
            
        if bedrooms and listing.get('bedrooms') != bedrooms:
            continue
            
        # Add matching listing
        filtered_listings.append({
            'title': listing['title'],
            'price': listing['price'],
            'location': listing['location'],
            'image': listing.get('image', '')  # Default to empty string if no image
        })
        
        # Limit to top 3 matches
        if len(filtered_listings) >= 3:
            break
            
    return filtered_listings 