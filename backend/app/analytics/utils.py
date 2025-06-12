from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..models.property import Property
from ..models.lead import Lead
from ..models.agent import Agent

def get_date_range(days: int = 7) -> tuple[datetime, datetime]:
    """Get date range for analytics queries."""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    return start_date, end_date

def calculate_conversion_rate(conversions: int, total: int) -> float:
    """Calculate conversion rate as a percentage."""
    if total == 0:
        return 0.0
    return (conversions / total) * 100

def get_mock_chart_data(days: int = 30) -> List[Dict[str, Any]]:
    """Generate mock chart data for testing."""
    data = []
    base_value = 100
    for i in range(days):
        timestamp = datetime.utcnow() - timedelta(days=days-i)
        value = base_value + (i * 10) + (i % 3 * 5)  # Some variation
        data.append({
            "timestamp": timestamp,
            "value": value
        })
    return data

def get_property_metrics(db: Session, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
    """Get property-related metrics."""
    # Get total properties
    total_properties = db.query(func.count(Property.id)).scalar()
    
    # Get top viewed properties
    top_properties = (
        db.query(
            Property.id,
            Property.title,
            func.count(Property.views).label('views'),
            func.count(Property.inquiries).label('inquiries')
        )
        .group_by(Property.id)
        .order_by(desc('views'))
        .limit(5)
        .all()
    )
    
    # Get property type performance
    property_types = (
        db.query(
            Property.property_type,
            func.count(Property.id).label('count'),
            func.avg(Property.price).label('avg_price')
        )
        .group_by(Property.property_type)
        .all()
    )
    
    return {
        "total_properties": total_properties,
        "top_properties": top_properties,
        "property_types": property_types
    }

def get_lead_metrics(db: Session, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
    """Get lead-related metrics."""
    # Get new leads this week
    new_leads = (
        db.query(func.count(Lead.id))
        .filter(Lead.created_at >= start_date)
        .scalar()
    )
    
    # Get lead sources
    lead_sources = (
        db.query(
            Lead.source,
            func.count(Lead.id).label('count')
        )
        .group_by(Lead.source)
        .all()
    )
    
    return {
        "new_leads": new_leads,
        "lead_sources": lead_sources
    }

def get_agent_metrics(db: Session, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
    """Get agent performance metrics."""
    agents = (
        db.query(
            Agent.id,
            Agent.name,
            func.count(Lead.id).label('leads_assigned'),
            func.avg(Lead.response_time).label('avg_response_time')
        )
        .join(Lead)
        .group_by(Agent.id)
        .all()
    )
    
    return {
        "agents": agents
    }

def get_mock_revenue_metrics() -> Dict[str, Any]:
    """Generate mock revenue metrics."""
    return {
        "monthly_revenue": 150000.0,
        "avg_revenue_per_lead": 2500.0,
        "revenue_by_property_type": [
            {"type": "Apartment", "revenue": 75000.0},
            {"type": "House", "revenue": 45000.0},
            {"type": "Villa", "revenue": 30000.0}
        ]
    } 