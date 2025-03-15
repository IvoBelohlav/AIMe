import json
import os

# Replace with YOUR actual information
personal_data = {
  "basics": {
    "name": "Jan Novak",  # Replace with your actual name
    "title": "Full Stack Developer & AI Specialist",  # Replace with your title
    "summary": "Passionate developer specializing in AI-powered web applications with expertise in creating interactive experiences",
    "website": "https://jannovak.com",  # Replace with your website
    "location": "Prague, Czech Republic",  # Replace with your location
    "profiles": [
      {
        "network": "LinkedIn",
        "url": "https://linkedin.com/in/jannovak"  # Replace with your LinkedIn
      },
      {
        "network": "GitHub",
        "url": "https://github.com/jannovak"  # Replace with your GitHub
      }
    ]
  },
  "skills": [
    {
      "name": "Web Development",
      "level": "Advanced",
      "keywords": ["HTML", "CSS", "JavaScript", "React", "Node.js", "FastAPI"]
    },
    {
      "name": "AI & Machine Learning",
      "level": "Intermediate",
      "keywords": ["Python", "TensorFlow", "Google Gemini API", "NLP", "Computer Vision"]
    },
    {
      "name": "Languages",
      "level": "Native/Fluent",
      "keywords": ["Czech", "Slovak", "English", "German"]
    }
  ],
  "projects": [
    {
      "name": "AI Portfolio Assistant",
      "description": "Interactive AI-powered portfolio with animated avatar that speaks and responds to questions",
      "technologies": ["Python", "FastAPI", "Google Gemini API", "JavaScript", "SVG Animation"],
      "url": "https://ai-portfolio.jannovak.com",
      "highlights": [
        "Implemented real-time voice interactions with Web Speech API",
        "Created SVG avatar with synchronized lip movements",
        "Built seamless integration with Google's Gemini API"
      ]
    },
    {
      "name": "Smart Home Control System",
      "description": "IoT platform for controlling smart home devices with voice and mobile interface",
      "technologies": ["React Native", "Node.js", "MongoDB", "MQTT", "Raspberry Pi"],
      "url": "https://smarthome.jannovak.com",
      "highlights": [
        "Developed cross-platform mobile application",
        "Created secure API for device communication",
        "Implemented voice control features in multiple languages"
      ]
    }
  ],
  "experience": [
    {
      "company": "Technologie s.r.o.",
      "position": "Senior Developer",
      "website": "https://technologie.cz",
      "startDate": "2020-01-01",
      "endDate": "Present",
      "summary": "Leading development of AI-powered web applications for enterprise clients",
      "highlights": [
        "Led development team of 6 engineers on multiple client projects",
        "Designed and implemented AI-driven customer service platform",
        "Reduced application loading time by 60% through performance optimization"
      ]
    },
    {
      "company": "WebStudio Praha",
      "position": "Software Developer",
      "website": "https://webstudio.cz",
      "startDate": "2017-06-01",
      "endDate": "2019-12-31",
      "summary": "Developed responsive web applications and e-commerce platforms",
      "highlights": [
        "Built custom e-commerce solutions for 20+ clients",
        "Implemented payment processing and inventory management systems",
        "Mentored junior developers and led code review process"
      ]
    }
  ],
  "education": [
    {
      "institution": "Czech Technical University in Prague",
      "area": "Computer Science",
      "studyType": "Master's Degree",
      "startDate": "2015-09-01",
      "endDate": "2017-05-31"
    },
    {
      "institution": "Charles University",
      "area": "Information Technology",
      "studyType": "Bachelor's Degree",
      "startDate": "2012-09-01",
      "endDate": "2015-05-31"
    }
  ],
  "faq": [
    {
      "question": "What are your core skills?",
      "answer": "My core skills include full-stack web development with React and Node.js, AI integration using Google's Gemini API and TensorFlow, and creating interactive user experiences. I'm also fluent in multiple languages including Czech, Slovak, English, and German."
    },
    {
      "question": "What projects are you most proud of?",
      "answer": "I'm particularly proud of my AI Portfolio Assistant that features an animated avatar with voice capabilities, and the Smart Home Control System that allows users to manage IoT devices through a mobile app and voice commands in multiple languages."
    },
    {
      "question": "Are you available for freelance work?",
      "answer": "Yes, I'm selectively taking on new freelance projects, especially those involving AI integration, interactive web applications, or IoT solutions. Feel free to reach out to discuss potential collaborations."
    },
    {
      "question": "Do you speak Czech?",
      "answer": "Ano, mluvím plynně česky. Je to můj mateřský jazyk a rád komunikuji v češtině i slovenštině."
    }
  ]
}

# Save to file
file_path = 'app/data/personal_data.json'
os.makedirs(os.path.dirname(file_path), exist_ok=True)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(personal_data, f, indent=2)

print(f"Personal data saved to {file_path}")
