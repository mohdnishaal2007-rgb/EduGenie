import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "EduGenie")

    # Gemini configuration
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv(
        "GEMINI_MODEL",
        "gemini-3.5-flash-lite"
    )

    # Optional local AI configuration
    local_explanation: bool = (
        os.getenv("LOCAL_EXPLANATION", "false").lower() == "true"
    )

    local_model: str = os.getenv(
        "LOCAL_MODEL",
        "MBZUAI/LaMini-Flan-T5-783M"
    )
    # Server configuration
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    @property
    def gemini_configured(self) -> bool:
        return bool(self.gemini_api_key)
settings = Settings()