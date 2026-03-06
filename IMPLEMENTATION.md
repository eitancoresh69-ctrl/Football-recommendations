# 🚀 Implementation Guide - v3.1

## What's New?

### ✅ משחקים שהתחילו לא מוצגים בעוד
משחקים שכבר התחילו בשעה נוכחית לא יוצגו בבחירת משחקים בסרגל הצד.

### ✅ רק 8 הליגות שלך
תצוגה מסוננת של רק הליגות שבחרת - פחות בלגוןן, יותר ממוקדות.

### ✅ סטטיסטיקות טובות יותר
- 20 משחקים במקום 15
- טופס 5 משחקים אחרונים
- ממוצע שערים בהשוואות היסטוריות

### ✅ ספירה לאחור 
"בעוד X שעות" בסרגל הצד כדי שתדע כמה זמן עד המשחק

---

## Installation Steps

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Setup API Keys
```bash
mkdir -p .streamlit
```

Create `.streamlit/secrets.toml`:
```toml
GEMINI_API_KEY = "your-gemini-api-key"
ODDS_API_KEY = "your-odds-api-key"  # Optional
```

### 3. Run Application
```bash
streamlit run index.html
```

### 4. Open in Browser
```
http://localhost:8501
```

---

## Files Changed

### 🔴 api_sofascore.py (שונה לגמרי)
- ✅ `game_has_started()` - בדיקה אם משחק התחיל
- ✅ `TARGET_LEAGUES` - דיקשנרי של ליגות לפי ספורט
- ✅ סטטיסטיקות: 20 משחקים (היה 15)
- ✅ תוספת `last_5_form` - טופס קצר טווח
- ✅ תוספת `avg_goals` ב-H2H

### 🔵 index.html (עדכון קל)
- ✅ סינון משחקים שהתחילו (שורה 283-290)
- ✅ ספירה לאחור (שורה 324-329)
- ✅ הוסף `start_timestamp` לתגובה משחק

### ⚪ Other Files
- `app.py` - לא בשימוש
- `ai_analyzer.py` - לא שונה
- `simulation_engine.py` - לא שונה
- `requirements.txt` - לא שונה

---

## Leagues Supported

### ⚽ Football (5 Leagues + Cups)
```
🏆 UEFA Champions League
🇮🇱 Ligat Winner (Israeli Premier League)
🇪🇸 LaLiga + Copa del Rey + Supercopa
🇬🇧 Premier League + FA Cup + EFL Cup
🇫🇷 Ligue 1 + Coupe de France
```

### 🏀 Basketball (3 Leagues)
```
🇺🇸 NBA
🇮🇱 Israeli Basketball League
🇨🇳 CBA (Chinese Basketball Association)
```

---

## Features by Tab

### 📊 Data Tab
- Live odds (1x2, Over/Under 2.5)
- Team form badges (W/D/L)
- Goal statistics
- Missing players

### ⚔️ H2H Tab
- Last 15 head-to-head matches
- Win/Draw/Loss summary
- **NEW:** Average goals per match

### 🧠 AI Tab
- Gemini-powered analysis
- Value betting detection
- Confidence levels

### 📈 Stats Tab
- Team performance metrics
- **NEW:** Last 5 games form
- Home/Away split statistics
- Win rate calculations

---

## Key Functions

### api_sofascore.py

```python
def game_has_started(start_timestamp):
    """Check if game already started"""
    game_time = get_israel_time(start_timestamp)
    return game_time < datetime.now()

def fetch_games_for_dates(sport, days=7):
    """Get upcoming games (filters out started games)"""
    # Returns only future games

def get_team_stats(team_id):
    """Get team statistics from 20 recent games"""
    # Returns: wins, losses, draws, goals, form, last_5_form
```

---

## Troubleshooting

### ❌ "No games found"
**Solution:** Make sure league names match SofaScore exactly

### ❌ "Started games still showing"
**Solution:** Ensure `api.game_has_started()` is called in filtering

### ❌ "Wrong timezone"
**Solution:** System automatically detects Israel timezone (UTC+2/+3)

---

## Performance Tips

- Data caches for 30 minutes
- Caching reduces API calls
- Rerun app to force refresh (Cmd+R)
- First load takes 2-3 seconds

---

## Support

- Check CHANGELOG.md for version history
- See README.md for full documentation
- See IMPROVEMENTS.md for technical details

---

**Version:** 3.1  
**Updated:** 2026-03-06  
**Status:** ✅ Production Ready
