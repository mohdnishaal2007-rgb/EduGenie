from ai_client import generate_text


async def summarize_text(text: str) -> str:
    prompt = f"""Summarize the educational passage below for quick revision.

PASSAGE:
{text}

Requirements:
- Preserve the important facts, definitions, relationships, and conclusions.
- Remove repetition and unnecessary detail.
- Use clear headings or bullets where useful.
- Do not add information that is not supported by the passage.
- Aim for roughly 20-30% of the original length when practical.
"""
    return await generate_text(prompt)
