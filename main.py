from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI(title="SportIQ Ultra Pro API")

# מאפשר ל-Frontend שלך (שפועל בדפדפן) לדבר עם השרת
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # בסביבת ייצור נשנה את זה לדומיין של האתר שלך
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# הגדרות ה-API של הספורט (RapidAPI / API-Football)
RAPIDAPI_KEY = "הכנס_כאן_את_המפתח_שלך_מ_RAPIDAPI"
RAPIDAPI_HOST = "api-football-v1.p.rapidapi.com" # מומלץ לעבור ל-API-Football

def calculate_value_bet(true_probability_percent, bookmaker_odds):
    """
    מנוע חישוב Value Bet.
    בודק האם ההסתברות שהמערכת שלנו חישבה שווה יותר מהיחס שמציע הבוקי.
    """
    true_prob_decimal = true_probability_percent / 100
    expected_value = (true_prob_decimal * bookmaker_odds) - 1
    
    # אם התוצאה חיובית, יש כאן ערך (Value)
    return expected_value > 0.05 # דורשים לפחות 5% יתרון

@app.get("/api/matches/live")
def get_live_matches(league_id: int = None):
    """
    שואב משחקים חיים ומעביר אותם דרך מנוע הניתוח שלנו.
    למשל: league_id=2 עבור ליגת האלופות.
    """
    # כאן תהיה קריאה אמיתית ל-API:
    # url = "https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all"
    # headers = {"X-RapidAPI-Key": RAPIDAPI_KEY, "X-RapidAPI-Host": RAPIDAPI_HOST}
    # response = requests.get(url, headers=headers)
    
    # בינתיים, נייצר מידע דמה מובנה שמדמה תשובה מהשרת לאחר עיבוד
    matches = [
        {
            "id": "match_1",
            "leagueId": 2, # ליגת האלופות
            "leagueName": "ליגת האלופות",
            "homeTeam": "ריאל מדריד",
            "awayTeam": "באיירן מינכן",
            "score": "1 - 1",
            "minute": 72,
            "xG": {"home": 1.8, "away": 0.9},
            "winProbs": {"home": 45, "draw": 35, "away": 20}, # ההסתברות שהמערכת שלנו חישבה
            "bookmakerOdds": {"home": 2.50, "draw": 3.10, "away": 3.80}, # היחסים מאתר ההימורים
            "momentum": {"home": [20, 40, 60, 80], "away": [50, 40, 30, 20]},
            "injuries": [{"player": "ויניסיוס", "team": "ריאל מדריד", "reason": "מתיחה"}]
        }
    ]
    
    # הרצת מנוע האנליזה על כל משחק
    for match in matches:
        # בודק אם יש Value על ניצחון ביתי
        has_home_value = calculate_value_bet(match["winProbs"]["home"], match["bookmakerOdds"]["home"])
        
        if has_home_value:
            match["verdict"] = f"זוהה Value Bet! יחס הבוקי על {match['homeTeam']} הוא {match['bookmakerOdds']['home']}, אבל ההסתברות האמיתית גבוהה יותר."
        else:
            match["verdict"] = "אין ערך מהותי בהימור כרגע. המתן להתפתחות המשחק."
            
    return matches
