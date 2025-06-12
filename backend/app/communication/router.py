from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..auth.utils import get_current_active_user
from . import models, schemas

router = APIRouter(tags=["Communication"])

# Message endpoints
@router.post("/api/messages", response_model=schemas.Message)
async def create_message(
    message: schemas.MessageCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new message in a lead's conversation."""
    # Verify lead exists and user has access
    lead = db.query(models.Lead).filter(models.Lead.id == message.lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Create message
    db_message = models.Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/api/messages/{lead_id}", response_model=schemas.MessageThread)
async def get_lead_messages(
    lead_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get all messages for a specific lead."""
    # Verify lead exists and user has access
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Get messages
    messages = (
        db.query(models.Message)
        .filter(models.Message.lead_id == lead_id)
        .order_by(models.Message.timestamp)
        .all()
    )
    return {"lead_id": lead_id, "messages": messages}

# Notification endpoints
@router.post("/api/notifications", response_model=schemas.Notification)
async def create_notification(
    notification: schemas.NotificationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new notification for a user."""
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == notification.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create notification
    db_notification = models.Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

@router.get("/api/notifications", response_model=schemas.NotificationList)
async def get_notifications(
    unread_only: bool = Query(False, description="Filter unread notifications"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get notifications for the current user."""
    # Build query
    query = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    )
    
    if unread_only:
        query = query.filter(models.Notification.read == False)
    
    # Get total unread count
    unread_count = db.query(func.count(models.Notification.id)).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.read == False
    ).scalar()
    
    # Get paginated notifications
    notifications = query.order_by(
        models.Notification.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return {
        "notifications": notifications,
        "unread_count": unread_count
    }

@router.put("/api/notifications/{notification_id}", response_model=schemas.Notification)
async def update_notification(
    notification_id: str,
    notification_update: schemas.NotificationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Mark a notification as read/unread."""
    # Get notification
    db_notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    # Update notification
    db_notification.read = notification_update.read
    db.commit()
    db.refresh(db_notification)
    return db_notification 