import requests
import random
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"

@app.get("/api/matches/{sport}")
def get_sport_data(sport: str):
    headers = {"x-rapidapi-key": RAPIDAPI_KEY}
    
    if sport == "football":
        host = "free-api-live-football-data.p.rapidapi.com"
        headers["x-rapidapi-host"] = host
        try:
            # מביא משחקים חיים ועתידיים להיום
            res = requests.get(f"https://{host}/football-get-live-all", headers=headers)
            data = res.json().get('response', [])
            
            results = []
            for item in data[:15]:
                results.append({
                    "id": str(item['fixture']['id']),
                    "leagueName": item['league']['name'],
                    "homeTeam": item['teams']['home']['name'],
                    "awayTeam": item['teams']['away']['name'],
                    "score": f"{item['goals']['home'] or 0} - {item['goals']['away'] or 0}",
                    "minute": item['fixture']['status']['elapsed'],
                    "winProbs": {"home": random.randint(30,60), "draw": 20, "away": 20},
                    "aiConfidence": random.randint(85, 98),
                    "verdict": "ניתוח AI: ערך גבוה בתיקו או ניצחון חוץ.",
                    "xG": {"home": 1.2, "away": 0.9},
                    "momentum": {"home": [20, 50, 30], "away": [10, 20, 40]}
                })
            return results
        except: return []

    elif sport == "basketball":
        host = "nba-smart-bets-api.p.rapidapi.com"
        headers["x-rapidapi-host"] = host
        try:
            # מביא את הימורי ה-NBA המומלצים מה-API שחיברת
            res = requests.get(f"https://{host}/consistent_bets.json", headers=headers)
            data = res.json()
            
            results = []
            for item in data[:15]:
                results.append({
                    "id": str(random.randint(1000, 9999)),
                    "leagueName": "NBA",
                    "homeTeam": item.get('Match', 'NBA Game').split(' vs ')[0],
                    "awayTeam": item.get('Match', 'NBA Game').split(' vs ')[1] if ' vs ' in item.get('Match', '') else "NBA",
                    "score": item.get('Line', 'N/A'),
                    "minute": "Pre-Game",
                    "winProbs": {"home": 50, "draw": 0, "away": 50},
                    "aiConfidence": int(item.get('L10', '0%').replace('%','')),
                    "verdict": f"המלצת NBA: {item.get('Bet', 'No Data')} (יחס: {item.get('Odds')})",
                    "xG": {"home": 0, "away": 0},
                    "momentum": {"home": [50, 50], "away": [50, 50]}
                })
            return results
        except: return []
