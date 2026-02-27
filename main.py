import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"

@app.get("/api/matches/{sport}")
def get_winner_data(sport: str):
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "free-api-live-football-data.p.rapidapi.com" if sport == "football" else "nba-smart-bets-api.p.rapidapi.com"
    }
    
    all_results = []
    # סריקה של 5 ימים קדימה למהירות מקסימלית
    for i in range(5):
        date_str = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
        url = f"https://{headers['x-rapidapi-host']}/football-get-fixtures-by-date" if sport == "football" else f"https://{headers['x-rapidapi-host']}/consistent_bets.json"
        
        try:
            res = requests.get(url, headers=headers, params={"date": date_str} if sport == "football" else {}, timeout=10)
            data = res.json()
            items = data if isinstance(data, list) else data.get('response', [])
            all_results.extend(items)
            if sport == "basketball": break # NBA מחזיר הכל במכה
        except: continue
    return all_results
