import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# מאפשר ל-HTML המקומי שלך לדבר עם השרת ללא שגיאות CORS
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

@app.get("/api/v1/sport/{sport}/scheduled-events/{date}")
def get_scheduled_matches(sport: str, date: str):
    # כאן אנחנו נבנה את הלוגיקה ששואבת נתונים מאתרים אמיתיים במקום API
    # כדוגמה, בניתי מבנה שאתה יכול להתאים לאתרים כמו Flashscore או Winner
    
    events = []
    
    # --- דוגמה רעיונית לשאיבת נתונים (Web Scraping) ---
    # headers = {'User-Agent': 'Mozilla/5.0'}
    # url = f"https://some-sports-site.com/fixtures/{date}"
    # response = requests.get(url, headers=headers)
    # soup = BeautifulSoup(response.text, 'html.parser')
    # ... כתיבת קוד לחילוץ הליגות ושמות הקבוצות באנגלית ...
    
    # בינתיים, כדי שהעיצוב והקוד יעבדו לך חלק, הנה מבנה הנתונים 
    # שהסקרייפר יצטרך לייצר ולהחזיר ל-app.js:
    if sport == "football":
        events.append({
            "id": "match_1",
            "tournament": {"name": "Premier League"},
            "homeTeam": {"name": "Arsenal"},
            "awayTeam": {"name": "Liverpool"},
            "startTime": 1700000000, # Unix Timestamp
            "status": {"description": "Not started"}
        })
    elif sport == "basketball":
        events.append({
            "id": "match_2",
            "tournament": {"name": "NBA"},
            "homeTeam": {"name": "Lakers"},
            "awayTeam": {"name": "Celtics"},
            "startTime": 1700000000,
            "status": {"description": "Not started"}
        })
        
    return {"events": events}

@app.get("/api/v1/sport/{sport}/events/live")
def get_live_matches(sport: str):
    # לוגיקת סקרייפר למשחקים חיים
    return {"events": []}
