import json
from typing import Dict, Any, List, Optional

# For language detection and translation
try:
    from langdetect import detect
    from googletrans import Translator
    TRANSLATION_AVAILABLE = True
except ImportError:
    TRANSLATION_AVAILABLE = False

# Supported languages
SUPPORTED_LANGS = {
    'en': 'English',
    'ar': 'Arabic',
    'es': 'Spanish',
}

# Simulated in-memory user session store (for demo)
USER_SESSIONS: Dict[str, Dict[str, Any]] = {}

# Placeholder for listings fetch

def fetch_listings(criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
    # TODO: Integrate with listings.json or Supabase
    # For now, return a static example
    return [
        {
            "title": "Modern 3BR Townhouse in Jumeirah",
            "price": 2150000.00,
            "location": "Jumeirah Village Circle, Dubai",
            "description": "Fully upgraded townhouse with private garden...",
            "media": [
                "https://cdn.example.com/media/property1.jpg",
                "https://cdn.example.com/media/property2.jpg"
            ]
        }
    ]

# --- Language helpers ---
def detect_language(text: str) -> str:
    if TRANSLATION_AVAILABLE:
        try:
            lang = detect(text)
            if lang in SUPPORTED_LANGS:
                return lang
        except Exception:
            pass
    return 'en'  # Default to English

def translate(text: str, dest: str) -> str:
    if TRANSLATION_AVAILABLE and dest != 'en':
        try:
            translator = Translator()
            return translator.translate(text, dest=dest).text
        except Exception:
            pass
    return text

# --- Message formatting helpers ---
def format_listing_card(listing: Dict[str, Any], lang: str) -> str:
    # Simple markdown card for WhatsApp/Webchat
    card = f"**{listing['title']}**\n"
    card += f"{listing['location']}\n"
    card += f"💰 {listing['price']:,}" + (" AED" if lang == 'en' else "") + "\n"
    card += f"{listing['description'][:80]}...\n"
    if listing['media']:
        card += f"[Image]({listing['media'][0]})\n"
    return card

def short_reply(text: str, lang: str) -> str:
    return translate(text, lang)

# --- Role-based handlers ---
def handle_buyer_query(user_input: str, session: Dict[str, Any], lang: str) -> str:
    # Extract criteria (very basic demo)
    criteria = session.get('criteria', {})
    if 'villa' in user_input.lower():
        criteria['property_type'] = 'villa'
    if 'palm' in user_input.lower():
        criteria['location'] = 'Palm Jumeirah'
    if '3m' in user_input.lower() or '3 million' in user_input.lower():
        criteria['max_price'] = 3000000
    session['criteria'] = criteria
    listings = fetch_listings(criteria)
    if not listings:
        return short_reply("Sorry, I couldn't find any matching properties.", lang)
    reply = short_reply("Here are some options:", lang) + "\n\n"
    for l in listings:
        reply += format_listing_card(l, lang) + "\n---\n"
    return reply

def handle_seller_input(user_input: str, session: Dict[str, Any], lang: str) -> str:
    # TODO: Collect property info step-by-step, store in session
    return short_reply("Please provide your property details: type, location, price, and features.", lang)

def handle_appointment_booking(user_input: str, session: Dict[str, Any], lang: str) -> str:
    # TODO: Integrate with calendar API for real booking
    return short_reply("When would you like to schedule a viewing? Please suggest a date and time.", lang)

# --- Intent recognition (stretch goal) ---
intent_map = {
    'buy': ['buy', 'looking for', 'search', 'find', 'want to buy'],
    'sell': ['sell', 'list my property', 'offer', 'post listing'],
    'appointment': ['viewing', 'appointment', 'visit', 'schedule'],
}

def recognize_intent(user_input: str) -> str:
    text = user_input.lower()
    for intent, keywords in intent_map.items():
        if any(k in text for k in keywords):
            return intent
    return 'unknown'

def fallback_handler(user_input: str, lang: str) -> str:
    return short_reply("Sorry, I didn't understand your request. Can you rephrase?", lang)

# --- Main entry point ---
def respond_to_client(user_input: str, user_lang: Optional[str], user_role: str, user_id: str = 'default') -> str:
    # Detect language if not provided
    lang = user_lang or detect_language(user_input)
    # Load or create session
    session = USER_SESSIONS.setdefault(user_id, {})
    # Multi-turn memory: store last role
    session['last_role'] = user_role
    # Route to handler
    if user_role == 'buyer':
        return handle_buyer_query(user_input, session, lang)
    elif user_role == 'seller':
        return handle_seller_input(user_input, session, lang)
    elif user_role == 'appointment':
        return handle_appointment_booking(user_input, session, lang)
    else:
        # Fallback: try intent recognition
        intent = recognize_intent(user_input)
        if intent == 'buy':
            return handle_buyer_query(user_input, session, lang)
        elif intent == 'sell':
            return handle_seller_input(user_input, session, lang)
        elif intent == 'appointment':
            return handle_appointment_booking(user_input, session, lang)
        else:
            return fallback_handler(user_input, lang)
    # TODO: Add CRM sync, Twilio/WhatsApp, web widget, and email fallback integration

# Example usage:
if __name__ == "__main__":
    # Simulate a user query in Arabic
    user_input = "أبحث عن فيلا في نخلة جميرا أقل من ٣ مليون"
    print(respond_to_client(user_input, 'ar', 'buyer', user_id='user1'))
    # Simulate a user query in Spanish
    user_input2 = "Busco apartamento en Madrid por menos de 500,000 euros"
    print(respond_to_client(user_input2, 'es', 'buyer', user_id='user2'))
    # Simulate a seller
    user_input3 = "I want to list my property in Dubai Marina"
    print(respond_to_client(user_input3, 'en', 'seller', user_id='user3')) 