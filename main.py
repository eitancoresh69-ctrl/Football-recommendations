import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"

@app.get("/api/matches/{sport}")
def get_winner_style_data(sport: str):
    is_football = sport == "football"
    host = "free-api-live-football-data.p.rapidapi.com" if is_football else "nba-smart-bets-api.p.rapidapi.com"
    headers = {"x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": host}
    
    all_results = []
    # סריקה של 7 ימים קדימה (כמו בווינר)
    for i in range(7):
        date_str = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
        url = f"https://{host}/football-get-fixtures-by-date" if is_football else f"https://{host}/consistent_bets.json"
        
        try:
            params = {"date": date_str} if is_football else {}
            res = requests.get(url, headers=headers, params=params, timeout=8)
            data = res.json().get('response', [])
            if data: all_results.extend(data)
            if not is_football: break # ה-NBA מחזיר הכל במכה
        except: continue
            
    return all_results
