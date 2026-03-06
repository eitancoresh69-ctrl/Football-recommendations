# ✅ SportIQ ULTRA v3.3 - HEBREW NAMES & BEAUTIFUL UI

## 🎉 מה בדיוק נוסף?

### ✨ **NEW #1: קבוצות בעברית בסרגל צד**
- ✅ קבוצות מוצגות בעברית
- ✅ ליגות בעברית
- ✅ ממשק ידידותי

### ✨ **NEW #2: קופסאות יפות של משחקים**
- ✅ כל משחק הוא קופסה נפרדת
- ✅ מעבר בין משחקים קל
- ✅ ספירה לאחור לכל משחק

### ✨ **NEW #3: סינון מדויק של ליגות**
- ✅ לא יוצגו ליגות זרות
- ✅ רק ה-8 ליגות שלך
- ✅ matching word-boundaries נכון

---

## 🔧 איך זה עובד

### סינון ליגות - מדויק מאוד:
```python
# ✅ רק ליגות שבחרנו
TARGET_LEAGUES = {
    'כדורגל ⚽': {
        'UEFA Champions League': 'ליגת האלופות',
        'Ligat Winner': 'ליגת העל',
        'LaLiga': 'La Liga',
        # ... וכו
    }
}
```

### תרגום קבוצות:
```python
# ✅ אם יש שם בעברית, הצג אותו
home_he = translate_team(home_name)
```

### UI קופסאות:
```python
# ✅ כל משחק בקופסה נפרדת
card_html = f"""
<div style='...'>
    🕐 {time}
    {home_he} ⚔️ {away_he}
    ⏳ {hours_left}h
    📍 {league_he}
</div>
"""
```

---

## 📦 הורד עכשיו

### **`SportIQ-ULTRA-v3.3.zip`** ← **זה הקובץ החדש!**

כולל:
- ✅ api_sofascore.py עם סינון מדויק + תרגום
- ✅ index.html עם UI יפה וקבוצות בעברית
- ✅ תיעוד מלא

---

## 🚀 להתחלה

```bash
unzip SportIQ-ULTRA-v3.3.zip
cd SportIQ-ULTRA-v3.3
pip install -r requirements.txt
streamlit run index.html
```

---

## ✅ מה הסתיים

1. ✅ משחקים שהתחילו - מוסתרים
2. ✅ רק 8 הליגות שלך
3. ✅ קבוצות בעברית
4. ✅ UI יפה עם קופסאות
5. ✅ סינון מדויק (ללא Australian leagues וכו')

---

**Version:** 3.3 - HEBREW UI  
**Status:** ✅ READY  
**Date:** 2026-03-06
