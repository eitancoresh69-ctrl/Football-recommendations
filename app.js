// תצורת המערכת - חיבור לשרת ב-Render
const CONFIG = {
    apiUrl: 'https://football-recommendations.onrender.com/api',
    pollInterval: 30000 // רענון אוטומטי כל 30 שניות
};

// ניהול מצב האפליקציה
const state = {
    matches: [],
    currentSport: 'football', // ברירת מחדל: כדורגל
    selectedMatchId: null
};

/**
 * משיכת נתונים מהשרת לפי סוג הספורט הנבחר
 */
async function fetchMatchesData() {
    const statusEl = document.getElementById('system-status');
    if (statusEl) {
        statusEl.innerText = 'SYNCING...';
        statusEl.classList.remove('error');
    }
    
    try {
        // פנייה לכתובת הדינמית בשרת (football או basketball)
        const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}`);
        const data = await res.json();
        
        // עדכון המצב ורינדור הרשימה
        state.matches = Array.isArray(data) ? data : [];
        renderMatchList();
        
        if (statusEl) statusEl.innerText = 'SYSTEM ONLINE';
    } catch (error) {
        console.error("Fetch Error:", error);
        if (statusEl) {
            statusEl.innerText = 'CONNECTION ERROR';
            statusEl.classList.add('error');
        }
    }
}

/**
 * הצגת רשימת המשחקים בלוח הראדאר
 */
function renderMatchList() {
    const container = document.getElementById('matches-container');
    if (!container) return;

    if (state.matches.length === 0) {
        container.innerHTML = `
            <div class="placeholder">
                <p class="muted">אין משחקים זמינים כרגע ב-${state.currentSport === 'football' ? 'כדורגל' : 'NBA'}.</p>
                <p class="muted">נסה לסנכרן שוב בעוד מספר דקות.</p>
            </div>`;
        return;
    }

    container.innerHTML = state.matches.map(m => `
        <div class="match-card ${state.selectedMatchId === m.id ? 'active' : ''}" onclick="selectMatch('${m.id}')">
            <div class="match-meta">
                <span class="league-name">${m.leagueName}</span>
                <span class="match-time">${m.minute}</span>
            </div>
            <div class="match-teams">
                <span class="team-name">${m.homeTeam}</span>
                <span class="match-score">${m.score}</span>
                <span class="team-name">${m.awayTeam}</span>
            </div>
            <div class="match-stats-preview">
                <span>AI Confidence: ${m.aiConfidence}%</span>
            </div>
        </div>
    `).join('');
}

/**
 * בחירת משחק והצגת ניתוח ה-AI
 */
function selectMatch(id) {
    state.selectedMatchId = id;
    const match = state.matches.find(m => m.id === id);
    if (!match) return;

    // עדכון ויזואלי של הרשימה
    renderMatchList();

    // הצגת פאנל הניתוח
    document.getElementById('placeholder-text').style.display = 'none';
    document.getElementById('analysis-content').style.display = 'block';
    
    document.getElementById('match-title').innerText = `${match.homeTeam} vs ${match.awayTeam}`;
    
    // הצגת הסתברויות ניצחון
    const probsContainer = document.getElementById('ai-predictions');
    if (probsContainer) {
        probsContainer.innerHTML = `
            <div class="odds-box"><label>1 (בית)</label><h4>${match.winProbs.home}%</h4></div>
            <div class="odds-box"><label>X (תיקו)</label><h4>${match.winProbs.draw}%</h4></div>
            <div class="odds-box"><label>2 (חוץ)</label><h4>${match.winProbs.away}%</h4></div>
        `;
    }

    document.getElementById('ai-verdict-text').innerHTML = match.verdict;
}

/**
 * הגדרת מאזינים לאירועים (כפתורים)
 */
function setupEventListeners() {
    // כפתור רענון ידני
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchMatchesData);
    }

    // מעבר בין כדורגל לכדורסל בסרגל הצד
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // עדכון עיצוב הכפתורים
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // עדכון הסוג וטעינה מחדש
            state.currentSport = btn.dataset.sport;
            state.selectedMatchId = null; // איפוס בחירה
            
            // איפוס תצוגת האנליזה
            document.getElementById('placeholder-text').style.display = 'block';
            document.getElementById('analysis-content').style.display = 'none';
            
            fetchMatchesData();
        });
    });
}

/**
 * שעון זמן אמת
 */
function startClock() {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        setInterval(() => {
            clockEl.innerText = new Date().toLocaleTimeString('he-IL');
        }, 1000);
    }
}

// הפעלה ראשונית
window.onload = () => {
    startClock();
    setupEventListeners();
    fetchMatchesData(); // טעינה ראשונה של נתונים
};
