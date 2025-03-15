from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime, timedelta
from app.core.config import DB_PATH, CONVERSATION_TIMEOUT_MINUTES
from app.models.database import Conversation, Message, Base
import uuid

# Initialize database connection
engine = create_engine(f"sqlite:///{DB_PATH}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_conversation():
    """Create a new conversation with a unique session ID"""
    db = SessionLocal()
    session_id = str(uuid.uuid4())
    conversation = Conversation(session_id=session_id)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    db.close()
    return conversation

def get_conversation(session_id):
    """Get conversation by session ID"""
    db = SessionLocal()
    conversation = db.query(Conversation).filter(Conversation.session_id == session_id).first()
    db.close()
    return conversation

def add_message(conversation_id, role, content):
    """Add a message to a conversation"""
    db = SessionLocal()
    message = Message(conversation_id=conversation_id, role=role, content=content)
    db.add(message)
    
    # Update last_updated timestamp on the conversation
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    conversation.last_updated = datetime.utcnow()
    
    db.commit()
    db.close()
    return message

def get_messages(conversation_id, limit=None):
    """Get messages from a conversation with optional limit"""
    db = SessionLocal()
    query = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.timestamp)
    if limit:
        query = query.limit(limit)
    messages = query.all()
    db.close()
    return messages

def get_conversation_history(conversation_id, format="gemini"):
    """Get formatted conversation history for the specified model"""
    messages = get_messages(conversation_id)
    
    if format == "gemini":
        # Format for Gemini API
        history = []
        for msg in messages:
            history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [{"text": msg.content}]
            })
        return history
    
    return messages

def add_topics(conversation_id, topics):
    """Add topics to a conversation"""
    db = SessionLocal()
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conversation:
        current_topics = conversation.get_topics()
        new_topics = list(set(current_topics + topics))
        conversation.set_topics(new_topics)
        db.commit()
    db.close()

def cleanup_old_conversations():
    """Remove conversations that haven't been updated in a while"""
    db = SessionLocal()
    cutoff_time = datetime.utcnow() - timedelta(minutes=CONVERSATION_TIMEOUT_MINUTES)
    old_conversations = db.query(Conversation).filter(Conversation.last_updated < cutoff_time).all()
    
    for conversation in old_conversations:
        db.delete(conversation)
    
    db.commit()
    db.close()
    return len(old_conversations)
