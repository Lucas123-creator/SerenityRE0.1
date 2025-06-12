import os
from pathlib import Path
from typing import List

def create_upload_directories() -> None:
    """Create necessary upload directories."""
    base_dir = Path("uploads")
    subdirs = ["image", "document", "logo"]
    
    # Create base directory
    base_dir.mkdir(exist_ok=True)
    
    # Create subdirectories
    for subdir in subdirs:
        (base_dir / subdir).mkdir(exist_ok=True)
    
    print("✅ Created upload directories")

def create_env_file() -> None:
    """Create or update .env file with file management settings."""
    env_path = Path(".env")
    env_content = """
# File Management Settings
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=uploads
"""
    
    # Read existing .env if it exists
    existing_content = ""
    if env_path.exists():
        with open(env_path, "r") as f:
            existing_content = f.read()
    
    # Add file management settings if not present
    if "MAX_FILE_SIZE" not in existing_content:
        with open(env_path, "a") as f:
            f.write(env_content)
        print("✅ Added file management settings to .env")
    else:
        print("ℹ️ File management settings already present in .env")

def register_router(app) -> None:
    """Register the files router with the FastAPI app."""
    from .router import router as files_router
    app.include_router(files_router)
    print("✅ Registered files router")

def setup_file_management(app) -> None:
    """Run all setup steps for the file management module."""
    print("\n🚀 Setting up file management module...")
    
    # Create upload directories
    create_upload_directories()
    
    # Create/update .env file
    create_env_file()
    
    # Register router
    register_router(app)
    
    print("\n✨ File management module setup complete!") 