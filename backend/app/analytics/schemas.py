from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class OverviewMetrics(BaseModel):
    total_properties: int
    total_leads: int
    hot_lead_percentage: float = Field(..., ge=0, le=100)
    avg_response_time_minutes: float
    total_bookings: int
    recent_activity: datetime

class PropertyView(BaseModel):
    property_id: int
    title: str
    views: int
    inquiries: int
    conversion_rate: float

class PropertyTypeMetrics(BaseModel):
    property_type: str
    count: int
    avg_price: float
    conversion_rate: float

class PropertyAnalytics(BaseModel):
    top_viewed_properties: List[PropertyView]
    property_type_performance: List[PropertyTypeMetrics]
    overall_conversion_rate: float

class LeadSourceMetrics(BaseModel):
    source: str
    count: int
    conversion_rate: float

class LeadAnalytics(BaseModel):
    new_leads_this_week: int
    conversion_rate: float
    lead_sources: List[LeadSourceMetrics]

class AgentPerformance(BaseModel):
    agent_id: int
    name: str
    leads_assigned: int
    avg_response_time_minutes: float
    conversion_rate: float

class AgentAnalytics(BaseModel):
    agents: List[AgentPerformance]
    overall_avg_response_time: float
    overall_conversion_rate: float

class RevenueMetrics(BaseModel):
    monthly_revenue: float
    avg_revenue_per_lead: float
    revenue_by_property_type: List[dict]

class ChartDataPoint(BaseModel):
    timestamp: datetime
    value: float

class ChartData(BaseModel):
    labels: List[str]
    values: List[float]
    type: str = "line"  # or "bar", "pie", etc. 