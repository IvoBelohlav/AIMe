from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import json
from app.core.config import DB_PATH

Base = declarative_base()

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    topics = Column(Text, default='[]')  # JSON string of topics discussed
    user_data = Column(Text, default='{}')  # JSON string of user data
    
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    
    def get_topics(self):
        if not self.topics:
            return []
        return json.loads(self.topics)
    
    def set_topics(self, topics):
        self.topics = json.dumps(list(set(topics)))
    
    def get_user_data(self):
        if not self.user_data:
            return {}
        return json.loads(self.user_data)
    
    def set_user_data(self, data):
        current_data = self.get_user_data()
        current_data.update(data)
        self.user_data = json.dumps(current_data)

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String)  # "user" or "assistant"
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    conversation = relationship("Conversation", back_populates="messages")

# Initialize database
engine = create_engine(f"sqlite:///{DB_PATH}")
Base.metadata.create_all(bind=engine)
