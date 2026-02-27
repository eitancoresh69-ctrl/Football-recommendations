import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"
FOOTBALL_HOST = "free-api-live-football-data.p.rapidapi.com"

@app.get("/api/matches/{sport}")
def get_winner_style_data(sport: str):
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": FOOTBALL_HOST if sport == "football" else "nba-smart-bets-api.p.rapidapi.com"
    }
    
    all_results = []
    # סריקה של 5 ימים קדימה (כמו בווינר)
    for i in range(5):
        date_str = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
        url = f"https://{headers['x-rapidapi-host']}/football-get-fixtures-by-date" if sport == "football" else f"https://{headers['x-rapidapi-host']}/consistent_bets.json"
        
        try:
            res = requests.get(url, headers=headers, params={"date": date_str} if sport == "football" else {}, timeout=7)
            raw_data = res.json()
            
            # תיקון קריטי: NBA מחזיר רשימה ישירה, כדורגל מחזיר אובייקט עם 'response'
            if isinstance(raw_data, list):
                all_results.extend(raw_data)
                if sport == "basketball": break # ב-NBA מספיקה קריאה אחת
            else:
                all_results.extend(raw_data.get('response', []))
        except:
            continue
            
    return all_results
