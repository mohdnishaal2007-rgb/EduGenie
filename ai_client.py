import asyncio
from functools import lru_cache

from google import genai
from google.genai import types
from google.genai.errors import ClientError, ServerError

from config import settings


class GeminiNotConfiguredError(RuntimeError):
    pass


@lru_cache(maxsize=1)
def get_client() -> genai.Client:
    if not settings.gemini_api_key:
        raise GeminiNotConfiguredError(
            "GEMINI_API_KEY is not configured. "
            "Add it to the .env file and restart the server."
        )

    return genai.Client(api_key=settings.gemini_api_key)


async def generate_text(
    prompt: str,
    *,
    system_instruction: str | None = None
) -> str:

    # Prevent empty requests from reaching Gemini
    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty.")

    client = get_client()

    config = types.GenerateContentConfig(
        temperature=0.4,
        system_instruction=system_instruction,
    )

    max_retries = 5

    for attempt in range(max_retries):
        try:
            response = await client.aio.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=config,
            )

            text = response.text

            if not text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return text.strip()

        # ---------------------------------------------------------
        # 503 - Gemini temporarily unavailable
        # ---------------------------------------------------------
        except ServerError as error:

            if getattr(error, "code", None) == 503:

                if attempt < max_retries - 1:
                    wait_time = 5 * (2 ** attempt)

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_time} seconds..."
                    )

                    await asyncio.sleep(wait_time)
                    continue

                return (
                    "Gemini is temporarily unavailable because the AI "
                    "service is experiencing high demand. Please try "
                    "again in a few moments."
                )

            # Other server-side errors
            print(f"Gemini server error: {error}")

            return (
                "The AI service is currently unavailable. "
                "Please try again in a few moments."
            )

        # ---------------------------------------------------------
        # 429 - API quota / rate limit
        # ---------------------------------------------------------
        except ClientError as error:

            if getattr(error, "code", None) == 429:

                return (
                    "EduGenie has temporarily reached the Gemini API "
                    "usage limit. Please wait a little while and try "
                    "again."
                )

            # Other client/API errors
            print(f"Gemini API error: {error}")

            return (
                "There was a problem communicating with the AI service. "
                "Please check your request and try again."
            )

        # ---------------------------------------------------------
        # Unexpected errors
        # ---------------------------------------------------------
        except Exception as error:

            print(f"Unexpected Gemini error: {error}")

            return (
                "Something went wrong while generating the response. "
                "Please try again."
            )

    return (
        "The AI service could not complete the request. "
        "Please try again later."
    )