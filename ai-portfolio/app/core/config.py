import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# App Settings
APP_HOST = os.getenv("APP_HOST", "127.0.0.1")
APP_PORT = int(os.getenv("APP_PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

# Database Configuration
DB_PATH = os.getenv("DB_PATH", "app/data/conversations.db")

# Gemini API Settings
GEMINI_MODEL = "gemini-2.0-pro-exp-02-05"

# Other Settings
MAX_CONVERSATION_HISTORY = 20
CONVERSATION_TIMEOUT_MINUTES = 30
