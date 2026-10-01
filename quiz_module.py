import json
import re
from typing import Any

from ai_client import generate_text


def clean_json_block(text: str) -> str:
    text = text.strip()

    text = re.sub(
        r"^```(?:json)?\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = re.sub(
        r"\s*```$",
        "",
        text,
    )

    return text.strip()


def _validate_quiz(data: Any) -> list[dict[str, Any]]:
    if isinstance(data, dict):
        data = data.get("questions")

    if not isinstance(data, list) or len(data) != 3:
        raise ValueError(
            "The model did not return exactly three questions."
        )

    cleaned = []

    for index, item in enumerate(data, start=1):

        if not isinstance(item, dict):
            raise ValueError(
                f"Question {index} is not an object."
            )

        question = str(
            item.get("question", "")
        ).strip()

        options = item.get("options")

        answer = str(
            item.get("answer", "")
        ).strip()

        explanation = str(
            item.get("explanation", "")
        ).strip()

        # Validate basic structure
        if (
            not question
            or not isinstance(options, list)
            or len(options) != 4
            or not answer
        ):
            raise ValueError(
                f"Question {index} has an invalid structure."
            )

        # Clean options
        options = [
            str(option).strip()
            for option in options
        ]

        # Make sure no option is empty
        if any(not option for option in options):
            raise ValueError(
                f"Question {index} contains an empty option."
            )

        # Make sure options are unique
        if len(set(options)) != 4:
            raise ValueError(
                f"Question {index} contains duplicate options."
            )

        # Make sure the correct answer exists
        if answer not in options:
            raise ValueError(
                f"Question {index} has an answer "
                f"not present in options."
            )

        cleaned.append(
            {
                "question": question,
                "options": options,
                "answer": answer,
                "explanation": explanation,
            }
        )

    return cleaned


async def generate_quiz(
    text: str
) -> list[dict[str, Any]]:

    prompt = f"""Create exactly 3 multiple-choice questions from the passage below.

PASSAGE:
{text}

Return ONLY valid JSON in this exact shape:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "...",
      "explanation": "..."
    }}
  ]
}}

Rules:
- Exactly 3 questions.
- Exactly 4 options per question.
- Exactly one correct answer.
- The answer must exactly match one option.
- All four options must be unique.
- Questions must be answerable from the passage.
- Make distractors plausible but clearly incorrect.
"""

    raw = await generate_text(prompt)

    try:
        data = json.loads(
            clean_json_block(raw)
        )

        return _validate_quiz(data)

    except (json.JSONDecodeError, ValueError) as exc:
        raise RuntimeError(
            f"Quiz generation returned invalid JSON: {exc}"
        ) from exc