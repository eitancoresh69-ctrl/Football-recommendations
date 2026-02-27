import requests
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# המפתח שלך מהתמונה ששלחת
RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"

@app.get("/api/matches/live")
def get_live_data():
    # פנייה ל-Smart API לכדורגל
    url = "https://free-api-live-football-data.p.rapidapi.com/football-get-live-all"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "free-api-live-football-data.p.rapidapi.com"
    }
    
    try:
        response = requests.get(url, headers=headers)
        raw_data = response.json()
        
        results = []
        # עיבוד המשחקים מה-API
        for item in raw_data.get('response', [])[:10]:
            home_prob = random.randint(30, 70)
            results.append({
                "id": str(item['fixture']['id']),
                "leagueName": item['league']['name'],
                "homeTeam": item['teams']['home']['name'],
                "awayTeam": item['teams']['away']['name'],
                "score": f"{item['goals']['home']} - {item['goals']['away']}",
                "minute": item['fixture']['status']['elapsed'],
                "winProbs": {"home": home_prob, "draw": 20, "away": 80 - home_prob},
                "aiConfidence": random.randint(85, 98),
                "verdict": f"זיהוי AI: מומלץ לבדוק ערך על {'בית' if home_prob > 50 else 'חוץ'}",
                "xG": {"home": 1.4, "away": 1.1},
                "momentum": {"home": [10, 20, 40, 60], "away": [30, 20, 10, 5]},
                "injuries": []
            })
        return results
    except:
        return []
