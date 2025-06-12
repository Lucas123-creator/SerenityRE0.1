from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os

app = FastAPI()

MODEL_PATH = os.getenv('MODEL_PATH', 'models/lead_scorer_v1.pkl')
model = joblib.load(MODEL_PATH)

class LeadRequest(BaseModel):
    chat_text: str
    # Add more fields as needed

@app.post('/score_lead_live')
def score_lead_live(lead: LeadRequest):
    # Simple feature: intent_score
    intent_score = int(any(word in lead.chat_text.lower() for word in ['buy', 'urgent', 'now', 'call']))
    X = [[intent_score]]
    score = model.predict_proba(X)[0][1]
    return {"lead_score": float(score)} 