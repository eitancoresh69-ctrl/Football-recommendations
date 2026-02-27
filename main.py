import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# המפתח והמארח הנכונים מהחשבון שלך
RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"
FOOTBALL_HOST = "free-api-live-football-data.p.rapidapi.com"

@app.get("/api/matches/{sport}")
def get_winner_style_data(sport: str):
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": FOOTBALL_HOST if sport == "football" else "nba-smart-bets-api.p.rapidapi.com"
    }
    
    all_results = []
    # סריקה של 7 ימים קדימה כמו בווינר
    days_to_scan = 7
    for i in range(days_to_scan):
        date_str = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
        
        if sport == "football":
            url = f"https://{FOOTBALL_HOST}/football-get-fixtures-by-date"
            params = {"date": date_str}
        else:
            url = f"https://nba-smart-bets-api.p.rapidapi.com/consistent_bets.json"
            params = {}

        try:
            res = requests.get(url, headers=headers, params=params, timeout=7)
            data = res.json().get('response', [])
            if data:
                all_results.extend(data)
            if sport == "basketball": break # ה-API של ה-NBA מחזיר הכל ברשימה אחת
        except:
            continue
            
    # אם ה-API נכשל או ריק, נחזיר משחק בדיקה אחד כדי שלא יקפוץ לדמו
    if not all_results:
        return [{"id": "check", "leagueName": "בדיקה", "homeTeam": "ממתין לנתוני API", "awayTeam": "נסה לרענן", "score": "VS", "minute": "NS"}]
        
    return all_results
