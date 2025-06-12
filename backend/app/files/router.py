from fastapi import APIRouter

router = APIRouter(prefix="/api/files", tags=["Files"])

@router.get("/health")
async def files_health():
    return {"status": "ok"} 