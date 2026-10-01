from pathlib import Path
from typing import Literal

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field, field_validator

from config import settings
from explanation_module import explain_topic
from learning_path import get_learning_recommendations
from qna import answer_question
from quiz_module import generate_quiz
from summary_module import summarize_text


BASE_DIR = Path(__file__).resolve().parent


app = FastAPI(
    title="EduGenie",
    description="Google Gemini powered learning assistant",
    version="1.0.0",
)


app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static",
)

templates = Jinja2Templates(
    directory=BASE_DIR / "templates"
)


# ---------------------------------------------------------
# Request Models
# ---------------------------------------------------------

class TextRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=30000
    )

    @field_validator("text")
    @classmethod
    def validate_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Text cannot be empty.")

        return value


class QuestionRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=10000
    )

    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Question cannot be empty.")

        return value


class ExplainRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=1,
        max_length=10000
    )

    @field_validator("topic")
    @classmethod
    def validate_topic(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Topic cannot be empty.")

        return value


class QuizRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=20000
    )

    @field_validator("text")
    @classmethod
    def validate_quiz_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Quiz topic cannot be empty.")

        return value


class LearningPathRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=1,
        max_length=5000
    )

    level: Literal[
        "beginner",
        "intermediate",
        "advanced"
    ] = "beginner"

    @field_validator("topic")
    @classmethod
    def validate_learning_topic(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Learning topic cannot be empty.")

        return value


# ---------------------------------------------------------
# Frontend
# ---------------------------------------------------------

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"app_name": settings.app_name},
    )


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "gemini_configured": settings.gemini_configured,
    }


# ---------------------------------------------------------
# AI Endpoints
# ---------------------------------------------------------

@app.post("/qa")
async def qa(payload: QuestionRequest):
    return {
        "answer": await answer_question(payload.question)
    }


@app.post("/explain")
async def explain(payload: ExplainRequest):
    return {
        "explanation": await explain_topic(payload.topic)
    }


@app.post("/quiz")
async def quiz(payload: QuizRequest):
    return {
        "quiz": await generate_quiz(payload.text)
    }


@app.post("/summarize")
async def summarize(payload: TextRequest):
    return {
        "summary": await summarize_text(payload.text)
    }


@app.post("/learn/recommendations")
async def learning_recommendations(
    payload: LearningPathRequest
):
    return {
        "recommendations": await get_learning_recommendations(
            payload.topic,
            payload.level,
        )
    }