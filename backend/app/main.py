from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .files.setup import setup_file_management

app = FastAPI(
    title="Real Estate Serenity API",
    description="API for Real Estate Serenity platform",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup file management module
setup_file_management(app)

# Import and include other routers
from .auth.router import router as auth_router
from .communication.router import router as communication_router

app.include_router(auth_router)
app.include_router(communication_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Real Estate Serenity API"} 