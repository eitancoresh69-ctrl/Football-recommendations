import requests
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"

@app.get("/api/matches/{sport}")
def get_data(sport: str):
    headers = {"x-rapidapi-key": RAPIDAPI_KEY}
    host = "free-api-live-football-data.p.rapidapi.com" if sport == "football" else "nba-smart-bets-api.p.rapidapi.com"
    headers["x-rapidapi-host"] = host
    
    try:
        # ניסיון משיכה מה-API
        url = f"https://{host}/football-get-live-all" if sport == "football" else f"https://{host}/consistent_bets.json"
        res = requests.get(url, headers=headers, timeout=5)
        data = res.json().get('response', [])
        
        # אם אין משחקים חיים, נחזיר "משחקי עומק" לדוגמה כדי שהעיצוב יופיע
        if not data:
            return [{
                "id": "demo1",
                "leagueName": "ליגת האלופות" if sport == "football" else "NBA",
                "homeTeam": "ריאל מדריד" if sport == "football" else "Lakers",
                "awayTeam": "מנצ'סטר סיטי" if sport == "football" else "Warriors",
                "score": "0 - 0",
                "minute": "NS",
                "winProbs": {"home": 42, "draw": 28, "away": 30},
                "aiConfidence": 91,
                "verdict": "ערך גבוה בתיקו (X) מבוסס על 5 מפגשים אחרונים שהסתיימו בשוויון.",
                "deep": {
                    "corners": "9.5",
                    "h2h": ["ריאל 1-1 סיטי", "סיטי 2-2 ריאל", "ריאל 3-1 סיטי"],
                    "missing": ["אמבפה (פצוע)", "רודרי (מורחק)"]
                }
            }]
        return data
    except:
        return []
