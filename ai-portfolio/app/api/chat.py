from fastapi import APIRouter, Request, HTTPException, BackgroundTasks, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import os
import re
import uuid
from datetime import datetime

# Import Gemini API
from app.core.gemini_api import GeminiAPI

# Get API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    # Fallback for testing - REPLACE WITH YOUR ACTUAL API KEY
    GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
    print("WARNING: Using hardcoded Gemini API key. Set the GEMINI_API_KEY environment variable.")

# Load personal data
PERSONAL_DATA_PATH = "app/data/personal_data.json"
try:
    with open(PERSONAL_DATA_PATH, 'r', encoding='utf-8') as f:
        file_content = f.read()
        personal_data = json.loads(file_content)
        
    # Verify name is loaded correctly
    name = personal_data.get("basics", {}).get("name", "")
    print(f"Loaded personal data for: {name}")
    
    if name == "Your Name":
        print("WARNING: Using placeholder name 'Your Name'. Please update your personal_data.json")
        
except Exception as e:
    print(f"Error loading personal data: {str(e)}")
    # Create a basic fallback
    personal_data = {
        "basics": {
            "name": "Portfolio Owner",
            "title": "Software Developer",
            "summary": "A passionate developer with experience in multiple technologies."
        },
        "skills": [],
        "projects": [],
        "experience": [],
        "education": [],
        "faq": []
    }

# Initialize Gemini API
gemini_api = GeminiAPI(api_key=GEMINI_API_KEY)

# Create router
router = APIRouter()

# In-memory conversation storage
# In a production app, use a database
conversations = {}

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    sentiment: str = "neutral"

def get_conversation_history(session_id: str) -> List[Dict[str, Any]]:
    """Get conversation history for the session"""
    if session_id in conversations:
        return conversations[session_id]["messages"]
    return []

def add_message(session_id: str, role: str, content: str) -> None:
    """Add a message to the conversation history"""
    if session_id not in conversations:
        conversations[session_id] = {
            "messages": [],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    
    conversations[session_id]["messages"].append({
        "role": role,
        "content": content,
        "timestamp": datetime.now()
    })
    conversations[session_id]["updated_at"] = datetime.now()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with the AI assistant"""
    message = request.message
    session_id = request.session_id
    
    # Create new session if none provided
    if not session_id or session_id not in conversations:
        session_id = str(uuid.uuid4())
        
        # Add first-person welcome message
        welcome_msg = f"Ahoj! Jsem Jan Novák. Rád tě poznávám! Můžeš se mě zeptat na moje projekty, zkušenosti nebo cokoliv jiného. Jak ti můžu pomoct?"
        add_message(session_id, "assistant", welcome_msg)
    
    # Add user message to conversation
    add_message(session_id, "user", message)
    
    # Get conversation history
    history = get_conversation_history(session_id)
    
    # Generate response
    try:
        result = gemini_api.generate_response(message, history, personal_data)
        response = result["response"]
        sentiment = result.get("sentiment", "neutral")
        
        # Add assistant response to conversation
        add_message(session_id, "assistant", response)
        
        return {
            "response": response,
            "session_id": session_id,
            "sentiment": sentiment
        }
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return {
            "response": "Promiň, ale narazil jsem na problém. Můžeš to zkusit znovu s jinou otázkou?",
            "session_id": session_id,
            "sentiment": "negative"
        }
