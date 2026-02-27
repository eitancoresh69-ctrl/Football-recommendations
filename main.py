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

# המפתח שלך מהתמונה ששלחת
RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"
FOOTBALL_HOST = "free-api-live-football-data.p.rapidapi.com"

@app.get("/api/matches/live")
def get_combined_data():
    today = datetime.now().strftime('%Y-%m-%d')
    results = []
    
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": FOOTBALL_HOST
    }

    try:
        # 1. ניסיון להביא משחקי לייב
        live_res = requests.get(f"https://{FOOTBALL_HOST}/football-get-live-all", headers=headers)
        live_data = live_res.json().get('response', [])
        
        # 2. ניסיון להביא משחקים של היום (כולל כאלו שטרם התחילו)
        fix_res = requests.get(f"https://{FOOTBALL_HOST}/football-get-fixtures-by-date", 
                               headers=headers, params={"date": today})
        fix_data = fix_res.json().get('response', [])

        # איחוד הנתונים - קודם לייב, אחר כך עתידיים
        all_games = live_data + [g for g in fix_data if g['fixture']['status']['short'] == 'NS']
        
        for item in all_games[:20]: # הצגת 20 משחקים מובילים
            status = item['fixture']['status']['short']
            minute = item['fixture']['status']['elapsed'] if status != 'NS' else "טרם החל"
            
            results.append({
                "id": str(item['fixture']['id']),
                "leagueName": item['league']['name'],
                "homeTeam": item['teams']['home']['name'],
                "awayTeam": item['teams']['away']['name'],
                "score": f"{item['goals']['home'] or 0} - {item['goals']['away'] or 0}",
                "minute": minute,
                "winProbs": {"home": random.randint(20,70), "draw": 20, "away": 10}, # כאן נכניס בעתיד את ה-AI האמיתי
                "aiConfidence": random.randint(85, 98),
                "verdict": "ניתוח AI: בבדיקת ערך (Value)...",
                "xG": {"home": 1.5, "away": 0.9},
                "momentum": {"home": [20, 40, 60], "away": [10, 20, 10]},
                "injuries": []
            })
        return results
    except Exception as e:
        return {"error": str(e)}
