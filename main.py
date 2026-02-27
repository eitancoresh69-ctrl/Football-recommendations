import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"

@app.get("/api/matches/{sport}")
def get_winner_style_matches(sport: str):
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "free-api-live-football-data.p.rapidapi.com" if sport == "football" else "nba-smart-bets-api.p.rapidapi.com"
    }
    
    all_results = []
    # סריקה של 7 ימים קדימה כמו בווינר
    for i in range(7):
        date_str = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
        url = f"https://{headers['x-rapidapi-host']}/football-get-fixtures-by-date" if sport == "football" else f"https://{headers['x-rapidapi-host']}/consistent_bets.json"
        
        try:
            params = {"date": date_str} if sport == "football" else {}
            res = requests.get(url, headers=headers, params=params, timeout=5)
            data = res.json().get('response', [])
            if data:
                all_results.extend(data)
            if sport == "basketball": break # ה-API של ה-NBA מחזיר הכל ברשימה אחת
        except: continue
            
    return all_results
