from ai_client import generate_text


async def answer_question(question: str) -> str:
    prompt = f"""Answer the student's question below.

Question:
{question}

Requirements:
- Give a concise, accurate educational answer.
- Explain important terms in simple language.
- Use a short example when it improves understanding.
- If the question is ambiguous, state the assumption you are making.
- Do not invent sources or facts.
"""
    return await generate_text(
        prompt,
        system_instruction="You are EduGenie, a helpful educational assistant for learners of different levels.",
    )
