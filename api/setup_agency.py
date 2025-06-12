from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import json
import os
import subprocess
from datetime import datetime
import qrcode
from io import BytesIO
import base64

app = FastAPI()

class AgencySetup(BaseModel):
    branding: Dict
    listings: Dict
    integration: Dict
    language: Dict

class AgencyProfile(BaseModel):
    id: str
    name: str
    subdomain: str
    setup_date: str
    status: str
    config: Dict

# In-memory storage (replace with database in production)
agency_profiles: Dict[str, AgencyProfile] = {}

@app.post("/api/setup/agency")
async def setup_agency(setup: AgencySetup):
    try:
        # Generate unique agency ID and subdomain
        agency_id = f"agency_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        subdomain = setup.branding.get("agencyName", "").lower().replace(" ", "-")
        
        # Create agency profile
        profile = AgencyProfile(
            id=agency_id,
            name=setup.branding.get("agencyName", ""),
            subdomain=subdomain,
            setup_date=datetime.now().isoformat(),
            status="pending",
            config=setup.dict()
        )
        
        # Store profile
        agency_profiles[agency_id] = profile
        
        # Create deployment directory
        os.makedirs(f"deployments/{agency_id}", exist_ok=True)
        
        # Save configuration
        with open(f"deployments/{agency_id}/config.json", "w") as f:
            json.dump(setup.dict(), f, indent=2)
        
        # Generate QR code for WhatsApp
        if setup.integration.get("whatsapp", {}).get("enabled"):
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(f"https://wa.me/{setup.integration['whatsapp']['phoneNumber']}")
            qr.make(fit=True)
            qr_img = qr.make_image(fill_color="black", back_color="white")
            
            # Save QR code
            buffer = BytesIO()
            qr_img.save(buffer, format="PNG")
            qr_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            # Save QR code to file
            with open(f"deployments/{agency_id}/whatsapp_qr.png", "wb") as f:
                f.write(buffer.getvalue())
        
        # Trigger deployment
        try:
            # Run deployment script
            subprocess.run([
                "python", "deploy_agent.py",
                "--agency-id", agency_id,
                "--config", f"deployments/{agency_id}/config.json"
            ], check=True)
            
            # Update status
            profile.status = "active"
            agency_profiles[agency_id] = profile
            
            return {
                "status": "success",
                "agency_id": agency_id,
                "subdomain": f"{subdomain}.serenity.ai",
                "whatsapp_qr": qr_base64 if setup.integration.get("whatsapp", {}).get("enabled") else None
            }
            
        except subprocess.CalledProcessError as e:
            profile.status = "failed"
            agency_profiles[agency_id] = profile
            raise HTTPException(status_code=500, detail=f"Deployment failed: {str(e)}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/preview/{agency_id}")
async def get_preview(agency_id: str):
    if agency_id not in agency_profiles:
        raise HTTPException(status_code=404, detail="Agency not found")
    
    profile = agency_profiles[agency_id]
    return {
        "status": profile.status,
        "config": profile.config,
        "preview_url": f"https://{profile.subdomain}.serenity.ai/preview"
    }

@app.post("/api/deploy/{agency_id}")
async def deploy_agency(agency_id: str):
    if agency_id not in agency_profiles:
        raise HTTPException(status_code=404, detail="Agency not found")
    
    profile = agency_profiles[agency_id]
    
    try:
        # Run deployment script
        subprocess.run([
            "python", "deploy_agent.py",
            "--agency-id", agency_id,
            "--config", f"deployments/{agency_id}/config.json"
        ], check=True)
        
        # Update status
        profile.status = "active"
        agency_profiles[agency_id] = profile
        
        return {
            "status": "success",
            "message": "Agency deployed successfully",
            "url": f"https://{profile.subdomain}.serenity.ai"
        }
        
    except subprocess.CalledProcessError as e:
        profile.status = "failed"
        agency_profiles[agency_id] = profile
        raise HTTPException(status_code=500, detail=f"Deployment failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 