from ai_client import generate_text


async def get_learning_recommendations(topic: str, level: str = "beginner") -> str:
    prompt = f"""Create a personalized learning path for the topic: {topic}

Learner level: {level}

Return a practical plan from the learner's current level toward advanced understanding.
Include:
1. Prerequisites
2. Ordered topics from easier to harder
3. A suggested timeline
4. Practice/project ideas
5. How to check understanding
6. Useful resource TYPES (for example, documentation, courses, videos, books), without inventing specific URLs
7. A next-step recommendation

Keep the plan realistic and easy to follow.
"""
    return await generate_text(prompt)
