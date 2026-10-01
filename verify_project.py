"""Quick local verification that imports and routes are wired correctly."""
from main import app

routes = {route.path for route in app.routes}
required = {"/", "/health", "/qa", "/explain", "/quiz", "/summarize", "/learn/recommendations"}
missing = required - routes
if missing:
    raise SystemExit(f"Missing routes: {sorted(missing)}")
print("EduGenie project wiring OK.")
print("Routes:", ", ".join(sorted(routes)))
