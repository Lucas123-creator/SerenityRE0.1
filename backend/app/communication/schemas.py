from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field

# Message schemas
class MessageBase(BaseModel):
    lead_id: UUID
    sender: str = Field(..., pattern="^(user|agent|ai)$")
    content: str
    channel: str = Field(..., pattern="^(web|whatsapp|email)$")

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: UUID
    timestamp: datetime

    class Config:
        from_attributes = True

class MessageThread(BaseModel):
    lead_id: UUID
    messages: List[Message]

# Notification schemas
class NotificationBase(BaseModel):
    user_id: UUID
    type: str = Field(..., pattern="^(lead_assigned|hot_lead|crm_error)$")
    message: str

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    read: bool

class Notification(NotificationBase):
    id: UUID
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationList(BaseModel):
    notifications: List[Notification]
    unread_count: int 