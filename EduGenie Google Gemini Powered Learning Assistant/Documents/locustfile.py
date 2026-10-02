"""Load test for EduGenie (Locust).

Install:  pip install locust
Run UI :  locust -f locustfile.py --host http://127.0.0.1:8000     (then open http://localhost:8089)
Headless: locust -f locustfile.py --host http://127.0.0.1:8000 --headless -u 10 -r 2 -t 60s --csv results

Note: every AI request uses your Gemini API quota. Keep the number of users small
(5-10) on a free key, or you will see HTTP 429 (rate limit) errors that come from
Google, not from EduGenie.
"""
from locust import HttpUser, between, task

PASSAGE = (
    "The Industrial Revolution began in the late 18th century and shifted society from farming to "
    "factory work. New machines such as the steam engine made goods faster and cheaper to produce, "
    "but it also brought crowded cities, pollution and harsh working conditions."
)


class EduGenieUser(HttpUser):
    wait_time = between(1, 3)

    @task(1)
    def home(self):
        self.client.get("/", name="/ (home page)")

    @task(3)
    def ask_question(self):
        self.client.get("/qa", params={"question": "Which is the largest ocean?"}, name="/qa")

    @task(2)
    def generate_quiz(self):
        self.client.post("/quiz", json={"text": "Pythagoras theorem"}, name="/quiz")

    @task(2)
    def summarize(self):
        self.client.post("/summarize", json={"text": PASSAGE}, name="/summarize")

    @task(1)
    def learning_path(self):
        self.client.get("/learn/recommendations", params={"topic": "SQL"}, name="/learn/recommendations")
