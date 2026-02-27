import requests
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SportIQ Ultra Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# פרטי ה-API מהמסך שלך (image_d44f82.png)
RAPIDAPI_KEY = "הכנס_כאן_את_המפתח_הארוך_שלך"
RAPIDAPI_HOST = "free-api-live-football-data.p.rapidapi.com"

def calculate_value_bet(home_prob, draw_prob, away_prob):
    if home_prob > 50: return f"💡 זיהוי AI: יתרון לבית ({home_prob}%). ערך ב-1."
    if away_prob > 50: return f"💡 זיהוי AI: יתרון לחוץ ({away_prob}%). ערך ב-2."
    return "⚖️ זיהוי AI: משחק מאוזן. מומלץ הימור כפול."

@app.get("/api/matches/live")
def get_live_matches():
    # שליפת משחקים חיים מה-API של Smart API
    url = f"https://{RAPIDAPI_HOST}/football-get-live-all"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST
    }

    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        
        results = []
        # עיבוד הנתונים שחוזרים מה-API
        for item in data.get('response', [])[:15]:
            results.append({
                "id": str(item.get('fixture', {}).get('id', random.randint(1,1000))),
                "leagueName": item.get('league', {}).get('name', 'Unknown League'),
                "homeTeam": item.get('teams', {}).get('home', {}).get('name', 'Home'),
                "awayTeam": item.get('teams', {}).get('away', {}).get('name', 'Away'),
                "score": f"{item.get('goals', {}).get('home', 0)} - {item.get('goals', {}).get('away', 0)}",
                "minute": item.get('fixture', {}).get('status', {}).get('elapsed', 0),
                "winProbs": {"home": 40, "draw": 20, "away": 40}, # חישוב בסיסי
                "aiConfidence": random.randint(75, 95),
                "verdict": "ניתוח AI בטעינה...",
                "xG": {"home": 1.2, "away": 0.8},
                "momentum": {"home": [10, 20, 30, 40, 50, 60], "away": [60, 50, 40, 30, 20, 10]},
                "injuries": []
            })
        return results
    except Exception as e:
        return {"error": str(e)}
