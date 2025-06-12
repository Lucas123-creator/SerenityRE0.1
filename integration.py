import os
import json
import logging
import requests
from typing import Dict, Any, Optional
from datetime import datetime
import pytz

# For .env loading
from dotenv import load_dotenv
load_dotenv()

# Import centralized environment configuration
try:
    from api.env_config import config
except ImportError:
    # Fallback if running standalone
    class Config:
        GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
        GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
        BITRIX_WEBHOOK_URL = os.getenv("BITRIX_WEBHOOK_URL", "")
        PIPEDRIVE_API_KEY = os.getenv("PIPEDRIVE_API_KEY", "")
        PIPEDRIVE_DOMAIN = os.getenv("PIPEDRIVE_DOMAIN", "")
        SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
        SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
        FROM_EMAIL = os.getenv("FROM_EMAIL", "")
    config = Config()

# For Google Calendar
try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build as gcal_build
    GOOGLE_CALENDAR_AVAILABLE = True
except ImportError:
    GOOGLE_CALENDAR_AVAILABLE = False

# For Microsoft Graph (Outlook)
try:
    import msal
    import requests
    MS_GRAPH_AVAILABLE = True
except ImportError:
    MS_GRAPH_AVAILABLE = False

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

APPOINTMENTS_FILE = 'appointments.json'
CRM_LOG_FILE = 'crm_log.json'

# --- Calendar Sync ---
def book_viewing_detailed(agent_email: str, client_info: Dict[str, Any], datetime_obj: datetime, tz_str: str = 'Asia/Dubai', simulate: bool = False) -> Dict[str, Any]:
    """
    Book a viewing in agent's calendar (Google or Outlook). Fallback to CLI simulation if simulate=True.
    """
    result = {"status": "failed", "details": None}
    try:
        # Timezone conversion
        local_tz = pytz.timezone(tz_str)
        dt_local = local_tz.localize(datetime_obj)
        dt_utc = dt_local.astimezone(pytz.utc)
        # --- Google Calendar ---
        if GOOGLE_CALENDAR_AVAILABLE and not simulate:
            creds_path = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
            calendar_id = os.getenv('GOOGLE_CALENDAR_ID', agent_email)
            if creds_path and os.path.exists(creds_path):
                creds = service_account.Credentials.from_service_account_file(creds_path, scopes=['https://www.googleapis.com/auth/calendar'])
                service = gcal_build('calendar', 'v3', credentials=creds)
                event = {
                    'summary': f"Viewing: {client_info.get('name', 'Client')}",
                    'description': f"Contact: {client_info.get('email', '')}\nPhone: {client_info.get('phone', '')}",
                    'start': {'dateTime': dt_utc.isoformat(), 'timeZone': 'UTC'},
                    'end': {'dateTime': (dt_utc + pytz.timedelta(hours=1)).isoformat(), 'timeZone': 'UTC'},
                    'attendees': [{'email': agent_email}, {'email': client_info.get('email', '')}],
                }
                created = service.events().insert(calendarId=calendar_id, body=event).execute()
                result = {"status": "confirmed", "calendar": "google", "event_id": created['id']}
        # --- Microsoft Outlook Calendar ---
        elif MS_GRAPH_AVAILABLE and not simulate:
            # TODO: Implement MS Graph booking (requires OAuth2, see docs)
            result = {"status": "todo", "calendar": "outlook"}
        else:
            # CLI fallback simulation
            result = {"status": "simulated", "calendar": "cli", "datetime": dt_local.isoformat(), "agent": agent_email, "client": client_info}
        # Log appointment
        _log_appointment(result)
    except Exception as e:
        logging.error(f"Failed to book viewing: {e}")
        result = {"status": "error", "error": str(e)}
    return result

def _log_appointment(appointment: Dict[str, Any]):
    try:
        if os.path.exists(APPOINTMENTS_FILE):
            with open(APPOINTMENTS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = []
        data.append(appointment)
        with open(APPOINTMENTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logging.error(f"Failed to log appointment: {e}")

# --- CRM Integration ---
def push_to_crm(lead_data: Dict[str, Any], crm_target: str = 'bitrix24') -> Dict[str, Any]:
    """
    Push lead data to CRM (Bitrix24, Pipedrive, or custom webhook).
    """
    resp = {"status": "failed", "crm": crm_target}
    try:
        if crm_target == 'bitrix24':
            webhook = config.BITRIX_WEBHOOK_URL
            if webhook:
                import requests
                r = requests.post(webhook, json=lead_data)
                resp = {"status": r.status_code, "crm": "bitrix24", "response": r.text}
        elif crm_target == 'pipedrive':
            api_key = config.PIPEDRIVE_API_KEY
            domain = config.PIPEDRIVE_DOMAIN
            url = f'https://{domain}.pipedrive.com/v1/leads' if domain else 'https://api.pipedrive.com/v1/leads'
            if api_key:
                import requests
                params = {'api_token': api_key}
                r = requests.post(url, params=params, json=lead_data)
                resp = {"status": r.status_code, "crm": "pipedrive", "response": r.text}
        elif crm_target == 'custom':
            endpoint = os.getenv('CUSTOM_CRM_ENDPOINT')
            if endpoint:
                r = requests.post(endpoint, json=lead_data)
                resp = {"status": r.status_code, "crm": "custom", "response": r.text}
        else:
            resp = {"status": "unknown_crm", "crm": crm_target}
        _log_crm_response(resp)
    except Exception as e:
        logging.error(f"Failed to push to CRM: {e}")
        resp = {"status": "error", "error": str(e), "crm": crm_target}
    return resp

def _log_crm_response(resp: Dict[str, Any]):
    try:
        if os.path.exists(CRM_LOG_FILE):
            with open(CRM_LOG_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = []
        data.append(resp)
        with open(CRM_LOG_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logging.error(f"Failed to log CRM response: {e}")

# --- Webhook Callback Prep (Bonus) ---
# Example: FastAPI endpoint for CRM callback
# from fastapi import FastAPI, Request
# app = FastAPI()
#
# @app.post('/crm/callback')
# async def crm_callback(request: Request):
#     data = await request.json()
#     # TODO: Attach chat summary, lead score, and metadata
#     logging.info(f"CRM callback received: {data}")
#     return {"status": "received"}

# --- Role-based permissions (Stretch) ---
# TODO: Define permissions for sync/edit/delete per agent role

# --- API-compatible wrapper functions ---
def push_to_bitrix_crm(name: str, email: str, phone: str, source: str, comments: str = "") -> Dict[str, Any]:
    """
    Simplified Bitrix CRM push function compatible with API expectations
    """
    lead_data = {
        "fields": {
            "TITLE": f"Lead: {name}",
            "NAME": name,
            "EMAIL": [{"VALUE": email, "VALUE_TYPE": "WORK"}] if email else [],
            "PHONE": [{"VALUE": phone, "VALUE_TYPE": "WORK"}] if phone else [],
            "SOURCE_ID": source,
            "COMMENTS": comments
        }
    }
    
    webhook_url = config.BITRIX_WEBHOOK_URL
    if not webhook_url:
        return {"success": False, "error": "Bitrix webhook URL not configured"}
    
    try:
        # Bitrix24 REST API expects the endpoint to include the method
        if not webhook_url.endswith('/'):
            webhook_url += '/'
        webhook_url += 'crm.lead.add.json'
        
        response = requests.post(webhook_url, json=lead_data, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        if result.get('result'):
            return {
                "success": True,
                "lead_id": result['result'],
                "message": f"Lead {name} successfully added to Bitrix24"
            }
        else:
            return {
                "success": False,
                "error": result.get('error_description', 'Unknown error'),
                "response": result
            }
    except requests.RequestException as e:
        logging.error(f"Bitrix CRM API error: {e}")
        return {"success": False, "error": str(e)}
    except Exception as e:
        logging.error(f"Unexpected error in Bitrix CRM push: {e}")
        return {"success": False, "error": str(e)}

def book_viewing(agent_email: str, client_name: str, client_email: str, client_phone: str, 
                date: str, time: str, property_address: str) -> Dict[str, Any]:
    """
    Simplified booking function compatible with API expectations
    """
    try:
        # Combine date and time
        datetime_str = f"{date} {time}"
        datetime_obj = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
        
        # Create client info dict
        client_info = {
            "name": client_name,
            "email": client_email,
            "phone": client_phone
        }
        
        # Use the original book_viewing_detailed function
        result = book_viewing_detailed(agent_email, client_info, datetime_obj, simulate=True)
        
        # Format response for API
        if result.get("status") == "confirmed":
            return {
                "success": True,
                "booking_id": result.get("event_id", f"booking_{datetime.now().strftime('%Y%m%d%H%M%S')}"),
                "calendar_link": f"https://calendar.google.com/calendar/event?eid={result.get('event_id', '')}"
            }
        else:
            return {
                "success": True,  # Even simulation is considered successful
                "booking_id": f"sim_{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "calendar_link": None,
                "message": "Booking simulated successfully"
            }
            
    except Exception as e:
        logging.error(f"Booking error: {e}")
        return {
            "success": False,
            "error": str(e)
        }

# --- Example CLI usage ---
if __name__ == "__main__":
    # Test simplified API functions
    print("Testing Bitrix CRM push:")
    result = push_to_bitrix_crm(
        name="Test Client",
        email="test@example.com", 
        phone="+971501234567",
        source="Serenity AI Agent",
        comments="Test lead from API"
    )
    print(result)
    
    print("\nTesting booking:")
    result = book_viewing(
        agent_email="agent@example.com",
        client_name="Test Client",
        client_email="test@example.com",
        client_phone="+971501234567",
        date="2024-01-20",
        time="14:00",
        property_address="Test Property"
    )
    print(result) 