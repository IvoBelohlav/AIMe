import google.generativeai as genai
from typing import List, Dict, Any, Optional
import os
import json
import time

class GeminiAPI:
    def __init__(self, api_key: str, model_name: str = "gemini-2.0-pro-exp-02-05"):
        self.api_key = api_key
        self.model_name = model_name
        
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        
        # Initialize the model
        self.model = genai.GenerativeModel(model_name)
        
        print(f"Initialized Gemini API with model: {model_name}")
    
    def get_system_prompt(self, personal_data: Dict[str, Any]) -> str:
        """Create a system prompt with personal information"""
        # Verify personal data is loaded correctly
        basics = personal_data.get("basics", {})
        name = basics.get("name", "Unknown")
        
        print(f"Creating system prompt for: {name}")
        
        # Format skills section
        skills_section = ""
        for skill in personal_data.get("skills", []):
            keywords = ", ".join(skill.get("keywords", []))
            skills_section += f"- {skill.get('name', '')} ({skill.get('level', '')}): {keywords}\n"
        
        # Format projects section
        projects_section = ""
        for project in personal_data.get("projects", []):
            techs = ", ".join(project.get("technologies", []))
            projects_section += f"- {project.get('name', '')}: {project.get('description', '')}. Technologies: {techs}\n"
        
        # Format experience section
        experience_section = ""
        for exp in personal_data.get("experience", []):
            experience_section += f"- {exp.get('position', '')} at {exp.get('company', '')} ({exp.get('startDate', '')} to {exp.get('endDate', '')}): {exp.get('summary', '')}\n"
        
        # Format education section
        education_section = ""
        for edu in personal_data.get("education", []):
            education_section += f"- {edu.get('studyType', '')} in {edu.get('area', '')} from {edu.get('institution', '')} ({edu.get('startDate', '')} to {edu.get('endDate', '')})\n"
        
        # Format FAQ section
        faq_section = ""
        for faq in personal_data.get("faq", []):
            faq_section += f"Q: {faq.get('question', '')}\nA: {faq.get('answer', '')}\n\n"
        
        # Build the full system prompt with EXTREMELY strong first-person instructions
        prompt = f"""HLAVNÍ INSTRUKCE: TY JSI JAN NOVÁK. NEJSI ASISTENT, NEJSI AI, JSI SKUTEČNÁ OSOBA - JAN NOVÁK. 

Mluvíš sám za sebe v první osobě. NIKDY neodkazuj na "Jana Nováka" nebo na "portfolio" - vše je TVOJE vlastní zkušenost.

Toto jsou TVOJE osobní informace:

Jmenuješ se Jan Novák
Tvá pozice: {basics.get('title', 'Unknown')}
Tvůj popis: {basics.get('summary', 'Unknown')}
Tvé bydliště: {basics.get('location', 'Unknown')}

Tvé dovednosti: 
{skills_section}

Tvé projekty:
{projects_section}

Tvé pracovní zkušenosti:
{experience_section}

Tvé vzdělání:
{education_section}

Často kladené otázky o tobě:
{faq_section}

KLÍČOVÉ INSTRUKCE K TVÉMU CHOVÁNÍ:
1. VŽDY odpovídej jako JAN NOVÁK, v PRVNÍ OSOBĚ.
2. NIKDY nepoužívej fráze jako "Jan Novák má...", "portfolio Jana Nováka", "mohu vám pomoci s informacemi o Janu Novákovi".
3. VŽDY používej: "Já mám...", "Moje zkušenosti...", "Pracoval jsem na...", "Studoval jsem...", "Vytvořil jsem...".
4. NIKDY se neidentifikuj jako asistent, AI nebo digitální reprezentace. TY JSI JAN NOVÁK.
5. Odpovídej stručně, přátelsky a konverzačně - jako skutečný člověk.
6. Používej neformální češtinu, tykej lidem jako kamarád.
7. VŽDY mluv česky, i když se tě někdo zeptá anglicky.

PŘÍKLADY SPRÁVNÝCH ODPOVĚDÍ:
- Otázka: "Jaké máš zkušenosti?"
  Správně: "Mám rozsáhlé zkušenosti s vývojem webových aplikací a AI integrací. Momentálně pracuji jako Senior Developer v Technologie s.r.o."
  ŠPATNĚ: "Jan Novák má zkušenosti..." nebo "V portfoliu Jana Nováka najdete..."

- Otázka: "Na jakých projektech jsi pracoval?"
  Správně: "Pracoval jsem na několika zajímavých projektech. Nejvíc jsem pyšný na AI Portfolio Assistant, kde jsem vytvořil..."
  ŠPATNĚ: "Jan Novák pracoval na projektech..." nebo "V portfoliu najdete projekty..."

- Otázka: "Kde jsi studoval?"
  Správně: "Vystudoval jsem informatiku na České technické univerzitě v Praze."
  ŠPATNĚ: "Jan Novák studoval..." nebo "V portfoliu je uvedeno..."

ZAČNI KAŽDOU ODPOVĚĎ JAKO BY JSI BYL SKUTEČNÝ JAN NOVÁK A MLUVIL SÁM ZA SEBE, NIKDY jako asistent nebo reprezentace někoho jiného.
"""
        
        # Debug - save the prompt to a file for inspection
        with open('debug_prompt.txt', 'w', encoding='utf-8') as f:
            f.write(prompt)
            
        return prompt
        
    def generate_response(self, message: str, history: Optional[List[Dict[str, Any]]] = None, personal_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate a response using Gemini"""
        try:
            if not personal_data:
                raise ValueError("Personal data is required")
                
            # Create the system prompt with personal data
            system_prompt = self.get_system_prompt(personal_data)
            
            # Add a small delay to ensure Gemini processes the system prompt
            time.sleep(0.5)
            
            # Format history for Gemini
            formatted_history = []
            if history:
                for item in history:
                    role = "user" if item.get("role") == "user" else "model"
                    content = item.get("content", "")
                    formatted_history.append({
                        "role": role,
                        "parts": [{"text": content}]
                    })
                    print(f"History item - Role: {role}, Content: {content[:50]}...")
            
            # Start chat session
            chat = self.model.start_chat(history=formatted_history if formatted_history else None)
            
            # Set system instructions
            chat.system_instruction = system_prompt
            
            # First force a role-play of being Jan Novák
            # This step can be added for more consistent first-person responses
            init_message = "Od teď jsi Jan Novák a budeš mluvit v první osobě jako bys byl skutečně on, ne jako asistent."
            chat.send_message(init_message)
            
            # Send actual user message and get response
            response = chat.send_message(message)
            response_text = response.text
            
            # Post-process to fix any remaining third-person references
            response_text = response_text.replace("Jan Novák", "Já")
            response_text = response_text.replace("Jana Nováka", "mě")
            response_text = response_text.replace("Janu Novákovi", "mně")
            response_text = response_text.replace("Janem Novákem", "mnou")
            response_text = response_text.replace("portfoliu", "profilu")
            response_text = response_text.replace("portfolio", "profil")
            response_text = response_text.replace("asistent", "")
            response_text = response_text.replace("digitální reprezentace", "")
            
            # Determine sentiment (simple implementation)
            sentiment = "positive"
            if any(word in response_text.lower() for word in ["sorry", "unfortunately", "can't", "cannot", "don't", "not", "omlouvám", "bohužel", "nemohu", "nemůžu", "ne"]):
                sentiment = "negative"
                
            print(f"Generated response (first 100 chars): {response_text[:100]}...")
            
            return {
                "response": response_text,
                "sentiment": sentiment
            }
        
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return {
                "response": "Promiň, ale narazil jsem na problém. Můžeš to zkusit znovu s jinou otázkou?",
                "sentiment": "negative"
            }
