import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RAPIDAPI_KEY = "e3c45d2ba2msh0a6788ca494b687p1e2806jsn82e3d3d003c1"

@app.get("/api/matches/{sport}")
def get_data(sport: str, date: str = None):
    headers = {"x-rapidapi-key": RAPIDAPI_KEY}
    
    if sport == "football":
        host = "free-api-live-football-data.p.rapidapi.com"
        headers["x-rapidapi-host"] = host
        # אם נשלח תאריך, נשתמש ב-Endpoint של משחקים לפי תאריך
        url = f"https://{host}/football-get-fixtures-by-date" if date else f"https://{host}/football-get-live-all"
        params = {"date": date} if date else {}
        res = requests.get(url, headers=headers, params=params, timeout=5)
    else:
        host = "nba-smart-bets-api.p.rapidapi.com"
        headers["x-rapidapi-host"] = host
        url = f"https://{host}/consistent_bets.json"
        res = requests.get(url, headers=headers, timeout=5)
    
    return res.json().get('response', [])
