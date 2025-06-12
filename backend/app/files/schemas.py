from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, HttpUrl

class FileBase(BaseModel):
    filename: str
    original_filename: str
    path: str
    file_type: str = Field(..., pattern="^(image|document|logo)$")
    mime_type: str
    size_bytes: int
    uploaded_by: str

class FileCreate(FileBase):
    pass

class File(FileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    url: Optional[HttpUrl] = None

    class Config:
        from_attributes = True

class FileUploadResponse(BaseModel):
    file: File
    message: str = "File uploaded successfully"

class FileListResponse(BaseModel):
    files: List[File]
    total: int

class SupportedFileTypes(BaseModel):
    image: List[str] = ["png", "jpg", "jpeg", "gif", "webp"]
    document: List[str] = ["pdf", "doc", "docx", "txt"]
    logo: List[str] = ["png", "jpg", "jpeg", "svg"] 