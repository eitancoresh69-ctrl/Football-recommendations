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

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"

@app.get("/api/matches/{sport}")
def get_sport_data(sport: str):
    headers = {"x-rapidapi-key": RAPIDAPI_KEY}
    
    # לוגיקה למשיכת נתונים לפי סוג הספורט
    endpoint = "football-get-live-all" if sport == "football" else "basketball-get-live"
    host = "free-api-live-football-data.p.rapidapi.com" if sport == "football" else "nba-smart-bets-api.p.rapidapi.com"
    headers["x-rapidapi-host"] = host

    try:
        # כאן השרת פונה ל-API החיצוני
        res = requests.get(f"https://{host}/{endpoint}", headers=headers, timeout=5)
        data = res.json().get('response', [])
        
        # אם אין נתונים חיים כרגע, נחזיר משחק דמי כדי שתוכל לראות את העיצוב עובד
        if not data:
            return [{
                "id": "demo-1",
                "leagueName": "ליגת בדיקה",
                "homeTeam": "קבוצת בית (הדגמה)",
                "awayTeam": "קבוצת חוץ (הדגמה)",
                "score": "0 - 0",
                "minute": "חי",
                "winProbs": {"home": 45, "draw": 30, "away": 25},
                "aiConfidence": 95,
                "verdict": "המערכת מחוברת בהצלחה. כרגע אין משחקים חיים ב-API, מוצגים נתוני הדמיה.",
                "xG": {"home": 1.2, "away": 0.8}
            }]
        return data # החזרת הנתונים האמיתיים
    except:
        return []
