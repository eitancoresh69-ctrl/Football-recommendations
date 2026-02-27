# ... (שמור על הגדרות ה-FastAPI וה-CORS הקיימות)

@app.get("/api/matches/{sport}")
def get_sport_data(sport: str):
    # נתוני הדמיה מורחבים הכוללים את כל מה שביקשת
    demo_data = [{
        "id": "m1",
        "leagueName": "ליגת האלופות" if sport == "football" else "NBA",
        "homeTeam": "ריאל מדריד" if sport == "football" else "LA Lakers",
        "awayTeam": "מנצ'סטר סיטי" if sport == "football" else "GS Warriors",
        "score": "0 - 0",
        "minute": "NS",
        "winProbs": {"home": 45, "draw": 25, "away": 30},
        "aiConfidence": 94,
        "verdict": "ערך גבוה בניצחון ביתי מבוסס על היסטוריית מפגשים.",
        "deep": {
            "corners": "8.5 (ממוצע)",
            "missing": ["קיליאן אמבפה (פצוע)", "רודרי (מושעה)"],
            "h2h": ["ריאל 2-1 סיטי", "סיטי 1-1 ריאל", "ריאל 3-1 סיטי"],
            "last5_home": ["W", "W", "D", "W", "L"],
            "last5_away": ["D", "W", "W", "L", "W"]
        }
    }]
    return demo_data
