import google.generativeai as genai
import re
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

def extract_topics(text):
    """Extract potential topics from user messages"""
    # Simple keyword extraction - in production use NLP
    keywords = [
        "skills", "experience", "projects", "education",
        "contact", "work", "background", "portfolio",
        "coding", "development", "design", "ai", "machine learning"
    ]
    
    found_topics = []
    for keyword in keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text.lower()):
            found_topics.append(keyword)
    
    return found_topics

class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel(GEMINI_MODEL)
    
    def get_system_prompt(self, personal_data, topics=None):
        """Generate system prompt with personal data and optional topics focus"""
        # Basic personalization based on discussed topics
        personalized_prompt = ''
        if topics and len(topics) > 0:
            personalized_prompt = f"\nI notice you've been interested in discussing: {', '.join(topics)}. I'm happy to explore these topics more or discuss other aspects of my background."
        
        # Format data sections
        skills_section = "\n".join([
            f"- {skill['name']} ({skill['level']}): {', '.join(skill['keywords'])}"
            for skill in personal_data.get("skills", [])
        ])
        
        projects_section = "\n".join([
            f"- {project['name']}: {project['description']}. Technologies: {', '.join(project['technologies'])}"
            for project in personal_data.get("projects", [])
        ])
        
        experience_section = "\n".join([
            f"- {exp['position']} at {exp['company']} ({exp['startDate']} to {exp['endDate']}): {exp['summary']}"
            for exp in personal_data.get("experience", [])
        ])
        
        education_section = "\n".join([
            f"- {edu['studyType']} in {edu['area']} from {edu['institution']} ({edu['startDate']} to {edu['endDate']})"
            for edu in personal_data.get("education", [])
        ])
        
        faq_section = "\n\n".join([
            f"Q: {faq['question']}\nA: {faq['answer']}"
            for faq in personal_data.get("faq", [])
        ])
        
        # Construct full system prompt
        prompt = f"""You are an AI assistant representing the portfolio owner. 
Here is information about the portfolio owner that you should use to answer questions:

Name: {personal_data['basics']['name']}
Title: {personal_data['basics']['title']}
Summary: {personal_data['basics']['summary']}

Skills: 
{skills_section}

Projects:
{projects_section}

Experience:
{experience_section}

Education:
{education_section}

FAQs:
{faq_section}

Your task is to represent the portfolio owner in a friendly, professional manner. 
Answer questions about the portfolio owner's skills, experiences, projects, and qualifications. 
If you don't know something specific, you can say so, but try to be helpful and redirect the conversation 
to what you do know about the portfolio owner.{personalized_prompt}"""
        
        return prompt
    
    def generate_response(self, message, history=None, system_prompt=None):
        """Generate a response using the Gemini API"""
        # Extract topics for future reference
        topics = extract_topics(message)
        
        # Start chat with history if provided
        if history:
            chat = self.model.start_chat(history=history)
        else:
            chat = self.model.start_chat()
        
        # Set system instructions if provided
        if system_prompt:
            chat.system_instruction = system_prompt
        
        # Generate response
        response = chat.send_message(message)
        
        return {
            "response": response.text,
            "topics": topics
        }
