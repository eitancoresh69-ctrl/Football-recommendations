import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"

@app.get("/api/matches/{sport}")
def get_winner_data(sport: str):
    is_fb = sport == "football"
    host = "free-api-live-football-data.p.rapidapi.com" if is_fb else "nba-smart-bets-api.p.rapidapi.com"
    headers = {"x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": host}
    
    all_results = []
    # סריקה של 5 ימים קדימה
    for i in range(5):
        date_str = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
        url = f"https://{host}/football-get-fixtures-by-date" if is_fb else f"https://{host}/consistent_bets.json"
        
        try:
            res = requests.get(url, headers=headers, params={"date": date_str} if is_fb else {}, timeout=10)
            data = res.json()
            # טיפול במבנה נתונים משתנה (רשימה מול אובייקט)
            items = data if isinstance(data, list) else data.get('response', [])
            all_results.extend(items)
            if not is_fb: break # NBA מחזיר הכל במכה
        except: continue
    return all_results
