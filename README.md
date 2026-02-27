# ⚽ SportIQ ULTRA — AI Betting Intelligence

מנוע ניתוח ספורט בזמן אמת עם AI לזיהוי Value Bets.

## 🚀 הפעלה

פתח את `index.html` בדפדפן. לא נדרש שרת.

## 📁 מבנה הפרויקט

```
├── index.html        — מבנה הממשק
├── style.css         — עיצוב מלא (dark theme)
├── api-service.js    — חיבור ל-SportAPI (RapidAPI)
├── logic-engine.js   — מנוע AI: הסתברויות, odds, Kelly
└── app.js            — לוגיקה ראשית + UI
```

## ⚙️ הגדרות

ב-`app.js` עדכן:
```js
tgToken: 'YOUR_BOT_TOKEN',   // טוקן מ-BotFather
chatId:  'YOUR_CHAT_ID',     // ID מ-UserInfoBot
```

ב-`api-service.js` עדכן (אם צריך):
```js
key: 'YOUR_RAPIDAPI_KEY',
```

## 🎯 פיצ'רים

- **נתונים חיים** — שידורים חיים + משחקים עתידיים (אוטומטי)
- **AI Value Bet** — זיהוי יתרון סטטיסטי בכל משחק
- **Kelly Criterion** — חישוב גודל הימור אופטימלי
- **H2H** — היסטוריית מפגשים ישירים
- **הרכב** — פצועים ונבדלים
- **טלגרם** — שליחת ניתוח מלא לבוט

## 🔌 API

משתמש ב-[SportAPI7 על RapidAPI](https://rapidapi.com/sportapi7/api/sportapi7).
