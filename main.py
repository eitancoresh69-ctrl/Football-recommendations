import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# מאפשר לאתר שלך למשוך מידע מהשרת בלי שגיאות אבטחה (CORS)
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

SOFASCORE_BASE = "https://api.sofascore.com/api/v1"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Origin": "https://www.sofascore.com",
    "Referer": "https://www.sofascore.com/",
    "Accept-Language": "en-US,en;q=0.9"
}

@app.get("/api/v1/{path:path}")
def proxy_sofascore(path: str):
    url = f"{SOFASCORE_BASE}/{path}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            return {}
        return response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {}
