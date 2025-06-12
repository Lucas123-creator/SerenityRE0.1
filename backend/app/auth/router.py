from datetime import timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, schemas, utils
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and return JWT token."""
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token = utils.create_access_token(
        data={"sub": user.email, "role": user.role, "agency_id": user.agency_id}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    """Logout user (JWT is stateless, so just return success)."""
    return {"message": "Successfully logged out"}

@router.post("/register", response_model=schemas.UserResponse)
async def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(utils.get_current_admin_user)
):
    """Register new user (admin only)."""
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = utils.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        role=user.role,
        agency_id=user.agency_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generate token
    access_token = utils.create_access_token(
        data={"sub": db_user.email, "role": db_user.role, "agency_id": db_user.agency_id}
    )
    return {"user": db_user, "access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.User)
async def read_users_me(
    current_user: models.User = Depends(utils.get_current_active_user)
):
    """Get current user profile."""
    return current_user

@router.put("/users/me", response_model=schemas.User)
async def update_user_me(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(utils.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile."""
    if user_update.password:
        current_user.hashed_password = utils.get_password_hash(user_update.password)
    if user_update.full_name:
        current_user.full_name = user_update.full_name
    if user_update.is_active is not None:
        current_user.is_active = user_update.is_active
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/users", response_model=schemas.UsersListResponse)
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(utils.get_current_admin_user)
):
    """List all users in the agency (admin only)."""
    users = db.query(models.User).filter(
        models.User.agency_id == current_user.agency_id
    ).offset(skip).limit(limit).all()
    return {"users": users}

@router.post("/users", response_model=schemas.UserResponse)
async def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(utils.get_current_admin_user)
):
    """Create new user (admin only)."""
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = utils.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        role=user.role,
        agency_id=current_user.agency_id  # Use admin's agency_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generate token
    access_token = utils.create_access_token(
        data={"sub": db_user.email, "role": db_user.role, "agency_id": db_user.agency_id}
    )
    return {"user": db_user, "access_token": access_token, "token_type": "bearer"} 