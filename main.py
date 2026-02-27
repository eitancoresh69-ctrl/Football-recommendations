# ... (בתוך הפונקציה get_sport_data)
        live_res = requests.get(f"https://{host}/football-get-live-all", headers=headers)
        live_data = live_res.json().get('response', [])
        
        # אם הרשימה ריקה, נוסיף משחק "בדיקה" כדי לראות שהכל עובד
        if not live_data:
            return [{
                "id": "test1",
                "leagueName": "בדיקת מערכת",
                "homeTeam": "ממתין לנתונים",
                "awayTeam": "מה-API",
                "score": "0 - 0",
                "minute": "בדיקה",
                "winProbs": {"home": 50, "draw": 50, "away": 0},
                "aiConfidence": 100,
                "verdict": "המערכת מחוברת, אך ה-API לא החזיר משחקים פעילים כרגע.",
                "xG": {"home": 0, "away": 0},
                "momentum": {"home": [0], "away": [0]}
            }]
        # ... השאר כרגיל
