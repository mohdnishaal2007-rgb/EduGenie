# EduGenie 🎓

EduGenie is an AI-powered learning assistant designed to help students understand, practice, and revise educational topics using Google Gemini.

## 🚀 Features

EduGenie provides five core learning modes:

- 💬 **Q&A** – Ask questions and receive clear educational answers.
- 📖 **Explain** – Get beginner-friendly explanations with examples.
- 🧠 **Quiz** – Generate three multiple-choice questions from study material.
- 📝 **Summarize** – Convert long educational content into concise revision notes.
- 🗺️ **Learning Path** – Generate personalized learning plans based on topic and difficulty level.

### Additional Features

- Google Gemini AI integration
- Beginner, intermediate, and advanced learning levels
- Markdown-formatted AI responses
- Quiz scoring and explanations
- Copy response functionality
- Regenerate response functionality
- Recent learning history
- Dark and light themes
- Responsive design
- Keyboard shortcuts
- Loading and AI processing indicators
- Backend request validation
- Secure API-key handling

---

## 🛠️ Technology Stack

### Backend
- Python
- FastAPI
- Pydantic
- Google Gemini API
- Uvicorn

### Frontend
- HTML
- CSS
- JavaScript
- Markdown rendering

### Development & Testing
- pytest
- pytest-asyncio
- Python virtual environment

---

## 📁 Project Structure

```text
EduGenie/
│
├── static/
│   ├── app.js
│   └── style.css
│
├── templates/
│   └── index.html
│
├── tests/
│   └── test_app.py
│
├── ai_client.py
├── config.py
├── explanation_module.py
├── learning_path.py
├── main.py
├── qna.py
├── quiz_module.py
├── summary_module.py
│
├── .env.example
├── .gitignore
├── README.md
├── requirements.txt
└── requirements-minimal.txt