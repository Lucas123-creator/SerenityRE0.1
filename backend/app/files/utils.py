import os
import uuid
from pathlib import Path
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException
from . import schemas

# Constants
UPLOAD_DIR = Path("uploads")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
SUPPORTED_TYPES = schemas.SupportedFileTypes()

def get_file_extension(filename: str) -> str:
    """Get file extension from filename."""
    return os.path.splitext(filename)[1].lower().lstrip('.')

def validate_file(file: UploadFile, file_type: str) -> Tuple[str, str]:
    """Validate file size and type."""
    # Check file size
    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    file.file.seek(0)
    
    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE/1024/1024}MB"
        )
    
    # Check file type
    ext = get_file_extension(file.filename)
    if file_type not in SUPPORTED_TYPES.dict():
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    if ext not in SUPPORTED_TYPES.dict()[file_type]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension for {file_type}. Supported: {SUPPORTED_TYPES.dict()[file_type]}"
        )
    
    return ext, file.content_type

def generate_unique_filename(original_filename: str, file_type: str) -> Tuple[str, str]:
    """Generate unique filename and path for upload."""
    ext = get_file_extension(original_filename)
    unique_id = str(uuid.uuid4())
    filename = f"{unique_id}.{ext}"
    
    # Create type-specific directory
    upload_path = UPLOAD_DIR / file_type
    upload_path.mkdir(parents=True, exist_ok=True)
    
    return filename, str(upload_path / filename)

def save_upload_file(file: UploadFile, file_type: str) -> Tuple[str, str, str, int]:
    """Save uploaded file and return metadata."""
    # Validate file
    ext, mime_type = validate_file(file, file_type)
    
    # Generate unique filename and path
    filename, filepath = generate_unique_filename(file.filename, file_type)
    
    # Ensure upload directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    # Save file
    with open(filepath, "wb") as f:
        f.write(file.file.read())
    
    return filename, filepath, mime_type, os.path.getsize(filepath)

def delete_file(filepath: str) -> None:
    """Delete file from disk."""
    try:
        os.remove(filepath)
    except OSError:
        pass  # File might not exist, which is fine

def get_file_url(file_id: str, filename: str) -> Optional[str]:
    """Generate URL for file access."""
    # In production, this would return a CDN or storage service URL
    # For local development, return a relative path
    return f"/api/files/{file_id}" 