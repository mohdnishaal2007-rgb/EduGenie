from locust import HttpUser, between, task


PASSAGE = (
    "The Industrial Revolution began in the late 18th century and shifted society "
    "from farming to factory work. New machines such as the steam engine made "
    "goods faster and cheaper to produce, but it also brought crowded cities, "
    "pollution and harsh working conditions."
)


class EduGenieUser(HttpUser):
    wait_time = between(1, 3)

    @task(1)
    def home(self):
        self.client.get("/", name="Home")

    @task(3)
    def ask_question(self):
        self.client.post(
            "/qa",
            json={"question": "Which is the largest ocean?"},
            name="/qa",
        )

    @task(2)
    def generate_quiz(self):
        self.client.post(
            "/quiz",
            json={"text": "Pythagoras theorem"},
            name="/quiz",
        )

    @task(2)
    def summarize(self):
        self.client.post(
            "/summarize",
            json={"text": PASSAGE},
            name="/summarize",
        )

    @task(2)
    def learning_recommendations(self):
        self.client.post(
            "/learn/recommendations",
            json={
                "topic": "SQL",
                "level": "beginner",
            },
            name="/learn/recommendations",
        )

    @task(1)
    def explain(self):
        self.client.post(
            "/explain",
            json={"topic": "Photosynthesis"},
            name="/explain",
        )