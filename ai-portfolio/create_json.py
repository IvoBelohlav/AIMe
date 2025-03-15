import json
import os
import pathlib

# Ensure directory exists
os.makedirs('app/data', exist_ok=True)

# Create personal data dictionary
personal_data = {
  "basics": {
    "name": "Your Name",
    "title": "Your Professional Title",
    "summary": "A brief professional summary about yourself",
    "website": "https://your-website.com",
    "location": "Your Location",
    "profiles": [
      {
        "network": "LinkedIn",
        "url": "https://linkedin.com/in/yourusername"
      },
      {
        "network": "GitHub",
        "url": "https://github.com/yourusername"
      }
    ]
  },
  "skills": [
    {
      "name": "Web Development",
      "level": "Advanced",
      "keywords": ["HTML", "CSS", "JavaScript", "React", "Node.js"]
    },
    {
      "name": "Machine Learning",
      "level": "Intermediate",
      "keywords": ["Python", "TensorFlow", "Scikit-learn"]
    }
  ],
  "projects": [
    {
      "name": "Project 1",
      "description": "Description of your first project",
      "technologies": ["React", "Node.js", "MongoDB"],
      "url": "https://project1.com",
      "highlights": [
        "Key achievement 1",
        "Key achievement 2"
      ]
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Your Position",
      "website": "https://company.com",
      "startDate": "2020-01-01",
      "endDate": "Present",
      "summary": "Brief description of your role",
      "highlights": [
        "Accomplishment 1",
        "Accomplishment 2"
      ]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "area": "Your Degree",
      "studyType": "Bachelor/Master/etc.",
      "startDate": "2016-01-01",
      "endDate": "2020-01-01"
    }
  ],
  "faq": [
    {
      "question": "What are your core skills?",
      "answer": "My core skills include web development, etc..."
    },
    {
      "question": "What projects are you most proud of?",
      "answer": "I'm particularly proud of..."
    }
  ]
}

# Write the JSON file
file_path = 'app/data/personal_data.json'
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(personal_data, f, indent=2)

print(f"Successfully created {file_path}")
print(f"File size: {os.path.getsize(file_path)} bytes")
