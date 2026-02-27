from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI(title="SportIQ Ultra Pro API")

# מאפשר לאתר שלך ב-GitHub Pages לדבר עם השרת
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# מנוע חישוב Value Bet בסיסי
def calculate_value_bet(home_prob, draw_prob, away_prob):
    if home_prob > 55:
        return f"💡 זיהוי AI: שליטה מובהקת של המארחת. מומלץ לשקול הימור על ניצחון בית (1) עם ערך גבוה. הסתברות: {home_prob}%"
    elif away_prob > 55:
        return f"💡 זיהוי AI: קבוצת החוץ שולטת בקצב. מומלץ לשקול הימור על ניצחון חוץ (2). הסתברות: {away_prob}%"
    else:
        return "⚖️ זיהוי AI: משחק שקול וצמוד. אין ערך (Value) ברור בניצחון ישיר. ההמלצה היא הימור כפול (1X / X2) או הימור על כמות שערים."

@app.get("/api/matches/live")
def get_live_matches():
    """
    נקודת הקצה שמספקת נתונים לאתר שלך.
    בעתיד, כאן נוסיף את הקריאה האמיתית ל-API של הכדורגל וה-NBA.
    כרגע, המערכת מחזירה מבנה נתונים מדויק כדי להפעיל את הדשבורד.
    """
    
    match_data = [
        {
            "id": "m1",
            "leagueId": "champions",
            "leagueName": "ליגת האלופות",
            "homeTeam": "ריאל מדריד",
            "awayTeam": "מנצ'סטר סיטי",
            "score": "1 - 1",
            "minute": 65,
            "xG": {"home": 1.2, "away": 1.8},
            "possession": {"home": 42, "away": 58},
            "shotsOnTarget": {"home": 4, "away": 7},
            "dangerousAttacks": {"home": 45, "away": 60},
            "winProbs": {"home": 25, "draw": 40, "away": 35},
            "aiConfidence": 88,
            "verdict": calculate_value_bet(25, 40, 35),
            "momentum": {"home": [30, 40, 20, 60, 50, 40], "away": [50, 60, 70, 40, 60, 80]},
            "injuries": [{"player": "קווין דה בראונה", "team": "סיטי", "reason": "פציעה בשריר הירך (בספק)"}]
        },
        {
            "id": "m2",
            "leagueId": "premier",
            "leagueName": "פרמייר ליג",
            "homeTeam": "ארסנל",
            "awayTeam": "ליברפול",
            "score": "2 - 0",
            "minute": 32,
            "xG": {"home": 1.5, "away": 0.4},
            "possession": {"home": 55, "away": 45},
            "shotsOnTarget": {"home": 5, "away": 1},
            "dangerousAttacks": {"home": 30, "away": 15},
            "winProbs": {"home": 75, "draw": 15, "away": 10},
            "aiConfidence": 92,
            "verdict": calculate_value_bet(75, 15, 10),
            "momentum": {"home": [60, 70, 80, 0, 0, 0], "away": [40, 30, 20, 0, 0, 0]},
            "injuries": [{"player": "בוקאיו סאקה", "team": "ארסנל", "reason": "מתיחה קלה"}]
        }
    ]
    
    return match_data

@app.get("/")
def root():
    return {"status": "SportIQ API is Live!", "message": "Server is running perfectly."}
