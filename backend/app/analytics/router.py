from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..database import get_db
from ..models.property import Property, PropertyView, PropertyInquiry
from ..models.lead import Lead
from ..models.agent import Agent
from . import schemas, utils

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/overview", response_model=schemas.OverviewMetrics)
async def get_overview_metrics(
    db: Session = Depends(get_db)
):
    """Get overview metrics for the dashboard."""
    # Get date range for the last 30 days
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)
    
    # Get total properties and leads
    total_properties = db.query(func.count(Property.id)).scalar()
    total_leads = db.query(func.count(Lead.id)).scalar()
    
    # Calculate hot lead percentage (leads with score > 80)
    hot_leads = db.query(func.count(Lead.id)).filter(Lead.score >= 80).scalar()
    hot_lead_percentage = (hot_leads / total_leads * 100) if total_leads > 0 else 0
    
    # Mock data for now
    avg_response_time = 45.5  # minutes
    total_bookings = 12
    recent_activity = datetime.utcnow()
    
    return {
        "total_properties": total_properties,
        "total_leads": total_leads,
        "hot_lead_percentage": hot_lead_percentage,
        "avg_response_time_minutes": avg_response_time,
        "total_bookings": total_bookings,
        "recent_activity": recent_activity
    }

@router.get("/properties", response_model=schemas.PropertyAnalytics)
async def get_property_analytics(
    db: Session = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """Get property-related analytics."""
    start_date, end_date = utils.get_date_range(days)
    
    # Get top viewed properties
    top_properties = (
        db.query(
            Property.id,
            Property.title,
            func.count(PropertyView.id).label('views'),
            func.count(PropertyInquiry.id).label('inquiries')
        )
        .outerjoin(PropertyView)
        .outerjoin(PropertyInquiry)
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
            func.avg(Property.price).label('avg_price'),
            func.count(PropertyInquiry.id).label('inquiries')
        )
        .outerjoin(PropertyInquiry)
        .group_by(Property.property_type)
        .all()
    )
    
    # Calculate conversion rates
    top_viewed = [
        schemas.PropertyView(
            property_id=p.id,
            title=p.title,
            views=p.views,
            inquiries=p.inquiries,
            conversion_rate=utils.calculate_conversion_rate(p.inquiries, p.views)
        )
        for p in top_properties
    ]
    
    property_type_performance = [
        schemas.PropertyTypeMetrics(
            property_type=pt.property_type,
            count=pt.count,
            avg_price=pt.avg_price,
            conversion_rate=utils.calculate_conversion_rate(pt.inquiries, pt.count)
        )
        for pt in property_types
    ]
    
    # Calculate overall conversion rate
    total_views = sum(p.views for p in top_properties)
    total_inquiries = sum(p.inquiries for p in top_properties)
    overall_conversion_rate = utils.calculate_conversion_rate(total_inquiries, total_views)
    
    return {
        "top_viewed_properties": top_viewed,
        "property_type_performance": property_type_performance,
        "overall_conversion_rate": overall_conversion_rate
    }

@router.get("/leads", response_model=schemas.LeadAnalytics)
async def get_lead_analytics(
    db: Session = Depends(get_db),
    days: int = Query(7, ge=1, le=30)
):
    """Get lead-related analytics."""
    start_date, end_date = utils.get_date_range(days)
    
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
            func.count(Lead.id).label('count'),
            func.count(Lead.viewing_scheduled).label('conversions')
        )
        .group_by(Lead.source)
        .all()
    )
    
    # Calculate conversion rates
    lead_source_metrics = [
        schemas.LeadSourceMetrics(
            source=ls.source,
            count=ls.count,
            conversion_rate=utils.calculate_conversion_rate(ls.conversions, ls.count)
        )
        for ls in lead_sources
    ]
    
    # Calculate overall conversion rate
    total_leads = sum(ls.count for ls in lead_sources)
    total_conversions = sum(ls.conversions for ls in lead_sources)
    overall_conversion_rate = utils.calculate_conversion_rate(total_conversions, total_leads)
    
    return {
        "new_leads_this_week": new_leads,
        "conversion_rate": overall_conversion_rate,
        "lead_sources": lead_source_metrics
    }

@router.get("/agents", response_model=schemas.AgentAnalytics)
async def get_agent_analytics(
    db: Session = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """Get agent performance analytics."""
    start_date, end_date = utils.get_date_range(days)
    
    # Get agent performance
    agents = (
        db.query(
            Agent.id,
            Agent.name,
            func.count(Lead.id).label('leads_assigned'),
            func.avg(Lead.response_time).label('avg_response_time'),
            func.count(Lead.viewing_scheduled).label('conversions')
        )
        .join(Lead)
        .filter(Lead.created_at >= start_date)
        .group_by(Agent.id)
        .all()
    )
    
    # Calculate agent metrics
    agent_performance = [
        schemas.AgentPerformance(
            agent_id=a.id,
            name=a.name,
            leads_assigned=a.leads_assigned,
            avg_response_time_minutes=a.avg_response_time or 0,
            conversion_rate=utils.calculate_conversion_rate(a.conversions, a.leads_assigned)
        )
        for a in agents
    ]
    
    # Calculate overall metrics
    total_leads = sum(a.leads_assigned for a in agents)
    total_conversions = sum(a.conversions for a in agents)
    total_response_time = sum(a.avg_response_time or 0 for a in agents)
    
    return {
        "agents": agent_performance,
        "overall_avg_response_time": total_response_time / len(agents) if agents else 0,
        "overall_conversion_rate": utils.calculate_conversion_rate(total_conversions, total_leads)
    }

@router.get("/revenue", response_model=schemas.RevenueMetrics)
async def get_revenue_analytics(
    db: Session = Depends(get_db)
):
    """Get revenue analytics (mocked for now)."""
    # Return mock data
    return {
        "monthly_revenue": 150000.0,
        "avg_revenue_per_lead": 2500.0,
        "revenue_by_property_type": [
            {"type": "Apartment", "revenue": 75000.0},
            {"type": "House", "revenue": 45000.0},
            {"type": "Villa", "revenue": 30000.0}
        ]
    } 