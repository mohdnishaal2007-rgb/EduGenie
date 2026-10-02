# EduGenie - Gemini Powered Learning Assistant

EduGenie is a lightweight AI learning assistant for students and self-learners. It answers questions,
explains concepts in simple words, generates 3-question quizzes, summarizes long text and builds
beginner-to-advanced learning paths. The backend is FastAPI; the frontend is a single HTML/CSS/JS page.

- Live app: https://edugenie-theta.vercel.app/
- Team ID: SWTID-2026-7957

## Features

| Feature | Endpoint | Powered by |
|---|---|---|
| Question answering | `GET /qa?question=...` | Google Gemini |
| Concept explanation | `POST /explain` `{"topic": "..."}` | Local LaMini-Flan-T5-783M (falls back to Gemini) |
| Quiz (3 MCQs, 4 options each) | `POST /quiz` `{"text": "..."}` | Google Gemini |
| Summarization | `POST /summarize` `{"text": "..."}` | Google Gemini |
| Learning path | `GET /learn/recommendations?topic=...` | Google Gemini |

## Project structure

```
EduGenie/
├── main.py                # FastAPI app and endpoints
├── gemini_client.py       # shared Gemini helper (API key, model name)
├── explanation_module.py  # local LaMini-Flan-T5 explanation (lazy loaded)
├── qna.py                 # question answering
├── quiz_module.py         # quiz generation, JSON cleaning and validation
├── summary_module.py      # summarization
├── learning_path.py       # learning recommendations
├── templates/index.html   # web page
├── static/style.css       # styles
├── requirements.txt
├── .env.example           # copy to .env
└── locustfile.py          # load test (optional)
```

## Run locally

1. Install Python 3.10 or newer.
2. Create and activate a virtual environment:
   - Windows: `python -m venv .venv` then `.venv\Scripts\activate`
     (if PowerShell blocks it: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)
   - macOS / Linux: `python3 -m venv .venv && source .venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` (create one at https://aistudio.google.com/apikey).
   `GEMINI_MODEL` selects the Gemini model and can be changed without editing code.
5. Start the server: `uvicorn main:app --reload`
6. Open http://127.0.0.1:8000

The first concept explanation downloads the LaMini model (about 3 GB) once. If it cannot be loaded
(or `torch` / `transformers` are not installed), EduGenie answers explanations with Gemini instead.

## Deploying (Vercel)

Set `GEMINI_API_KEY` and `GEMINI_MODEL` as environment variables in the Vercel project settings.
Never commit `.env`. Serverless hosting cannot hold the 3 GB local model, so deploy without
`torch` / `transformers` and explanations will use Gemini automatically.

## Load testing

`pip install locust`, then `locust -f locustfile.py --host http://127.0.0.1:8000` and open
http://localhost:8089. Use small user counts on a free Gemini key (rate limits apply).

## Known limitations

- No login or saved history (stateless).
- AI answers can be wrong; verify important facts.
- Gemini features need internet access and are subject to API quota.
