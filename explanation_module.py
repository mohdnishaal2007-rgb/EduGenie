from functools import lru_cache

from config import settings
from ai_client import generate_text


@lru_cache(maxsize=1)
def _load_local_pipeline():
    # Imported lazily so the normal Gemini-based application does not download
    # a large local model unless LOCAL_EXPLANATION=true is explicitly enabled.
    from transformers import pipeline

    return pipeline(
        "text2text-generation",
        model=settings.local_model,
        device=-1,
    )


def _local_explanation(topic: str) -> str:
    generator = _load_local_pipeline()
    prompt = (
        "Explain the following topic to a beginner in simple language. "
        "Use a short analogy or example if useful. Topic: " + topic
    )
    result = generator(prompt, max_new_tokens=180, do_sample=False)
    return result[0]["generated_text"].strip()


async def explain_topic(topic: str) -> str:
    if settings.local_explanation:
        try:
            return _local_explanation(topic)
        except Exception:
            # A local model may be unavailable on low-resource machines. Falling
            # back to Gemini keeps the feature usable instead of failing silently.
            pass

    prompt = f"""Explain this topic as if teaching a learner who is new to it:

{topic}

Use:
- a simple definition,
- a step-by-step explanation,
- one intuitive example or analogy,
- a short 'remember this' section.
Avoid unnecessary jargon.
"""
    return await generate_text(prompt)
