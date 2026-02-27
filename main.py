import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"
FOOTBALL_HOST = "free-api-live-football-data.p.rapidapi.com"

@app.get("/api/matches/{sport}")
def get_upcoming_matches(sport: str):
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": FOOTBALL_HOST if sport == "football" else "nba-smart-bets-api.p.rapidapi.com"
    }
    
    all_results = []
    # סריקה של 5 הימים הקרובים (היום + 4)
    for i in range(5):
        date_str = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
        url = f"https://{headers['x-rapidapi-host']}/football-get-fixtures-by-date" if sport == "football" else f"https://{headers['x-rapidapi-host']}/consistent_bets.json"
        
        try:
            # ב-NBA ה-API מחזיר רשימה כללית, בכדורגל לפי תאריך
            params = {"date": date_str} if sport == "football" else {}
            res = requests.get(url, headers=headers, params=params, timeout=5)
            data = res.json().get('response', [])
            if data:
                all_results.extend(data)
            # אם זה NBA, אין צורך בלולאת תאריכים
            if sport == "basketball": break
        except:
            continue
            
    return all_results

@app.get("/api/match-details")
def get_match_details(match_id: str):
    # כאן נוסיף בעתיד את השליפה הפרטנית של קרנות, פצועים ו-H2H מה-API
    return {"status": "success", "id": match_id}
