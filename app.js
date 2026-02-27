// תצורת האפליקציה - מצפה לקבל נתונים משרת ה-Backend שלך, לא ישירות מ-RapidAPI
const CONFIG = {
    // apiUrl: 'http://localhost:5000/api', // כאן יהיה השרת העתידי שלך
    pollInterval: 30000 
};

const state = {
    matches: [],
    selectedMatchId: null,
    currentLeagueFilter: 'all',
    momentumChartInstance: null
};

// אתחול המערכת
async function initApp() {
    startClock();
    setupEventListeners();
async function fetchMatchesData() {
    const statusEl = document.getElementById('system-status');
    statusEl.innerText = 'SYNCING...';
    statusEl.classList.remove('error');

    try {
        // קריאה לשרת הפייתון האמיתי שלנו!
        const res = await fetch('http://127.0.0.1:8000/api/matches/live');
        const data = await res.json();
        
        state.matches = data; 
        renderMatchList();
        statusEl.innerText = 'SYSTEM ONLINE';
    } catch (error) {
        console.error("Error fetching data:", error);
        statusEl.innerText = 'CONNECTION ERROR';
        statusEl.classList.add('error');
    }
}    
    // רענון אוטומטי
    setInterval(fetchMatchesData, CONFIG.pollInterval);
}

// מאזינים לאירועים
function setupEventListeners() {
    document.getElementById('refresh-btn').addEventListener('click', fetchMatchesData);
    
    // פילטר ליגות
    document.querySelectorAll('.filter-pills .pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-pills .pill').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.currentLeagueFilter = e.target.dataset.league;
            renderMatchList();
        });
    });

    // ניווט טאבים באנליזה
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            e.target.classList.add('active');
            document.getElementById(`tab-${e.target.dataset.target}`).classList.add('active');
        });
    });

    document.getElementById('tg-share-btn').addEventListener('click', sendToTelegram);
}

// פונקציית דמי (Mock) עד שתבנה את השרת
async function fetchMatchesData() {
    const statusEl = document.getElementById('system-status');
    statusEl.innerText = 'SYNCING...';
    statusEl.classList.remove('error');

    try {
        // בגרסה האמיתית: const res = await fetch(`${CONFIG.apiUrl}/matches/live`);
        // כרגע נייצר נתוני דמי ברמה גבוהה כדי לדמות שרת
        state.matches = generateMockServerData(); 
        renderMatchList();
        statusEl.innerText = 'SYSTEM ONLINE';
    } catch (error) {
        statusEl.innerText = 'CONNECTION ERROR';
        statusEl.classList.add('error');
    }
}

// רינדור רשימת המשחקים
function renderMatchList() {
    const container = document.getElementById('matches-container');
    const filteredMatches = state.matches.filter(m => 
        state.currentLeagueFilter === 'all' || m.leagueId === state.currentLeagueFilter
    );

    if (filteredMatches.length === 0) {
        container.innerHTML = '<p class="muted">אין משחקים חיים כרגע בליגה זו.</p>';
        return;
    }

    container.innerHTML = filteredMatches.map(m => `
        <div class="match-card ${state.selectedMatchId === m.id ? 'active' : ''}" onclick="selectMatch('${m.id}')">
            <div style="font-size:0.75rem; color:var(--accent)">${m.leagueName} | דקה: ${m.minute}'</div>
            <div style="display:flex; justify-content:space-between; margin:8px 0; font-size:1.1rem;">
                <b>${m.homeTeam}</b> <span style="background:#000; padding:2px 8px; border-radius:5px;">${m.score}</span> <b>${m.awayTeam}</b>
            </div>
            <div style="font-size:0.75rem; color:var(--dim); display:flex; justify-content:space-between;">
                <span>AI Confidence: ${m.aiConfidence}%</span>
                <span>${m.xG.home} xG ${m.xG.away}</span>
            </div>
        </div>
    `).join('');
}

// בחירת משחק והצגת האנליזה
function selectMatch(id) {
    state.selectedMatchId = id;
    const match = state.matches.find(m => m.id === id);
    if (!match) return;

    renderMatchList(); // לעדכון הכרטיסייה הפעילה

    document.getElementById('placeholder-text').style.display = 'none';
    document.getElementById('analysis-content').style.display = 'block';
    
    document.getElementById('match-title').innerText = `${match.homeTeam} vs ${match.awayTeam}`;
    document.getElementById('match-league').innerText = match.leagueName;

    renderOverview(match);
    renderDeepStats(match);
    renderRoster(match);
}

function renderOverview(m) {
    // רינדור יחסים וסיכויים
    document.getElementById('ai-predictions').innerHTML = `
        <div class="odds-box"><label>1 (בית)</label><h4>${m.winProbs.home}%</h4><small>יחס הוגן: ${(100/m.winProbs.home).toFixed(2)}</small></div>
        <div class="odds-box"><label>X (תיקו)</label><h4>${m.winProbs.draw}%</h4><small>יחס הוגן: ${(100/m.winProbs.draw).toFixed(2)}</small></div>
        <div class="odds-box"><label>2 (חוץ)</label><h4>${m.winProbs.away}%</h4><small>יחס הוגן: ${(100/m.winProbs.away).toFixed(2)}</small></div>
    `;

    document.getElementById('ai-verdict-text').innerHTML = m.verdict;

    // גרף מומנטום
    const ctx = document.getElementById('momentumChart').getContext('2d');
    if (state.momentumChartInstance) state.momentumChartInstance.destroy();
    
    state.momentumChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['15','30','45','60','75','90'],
            datasets: [
                { label: m.homeTeam, data: m.momentum.home, borderColor: '#00f2ff', tension: 0.4 },
                { label: m.awayTeam, data: m.momentum.away, borderColor: '#ff4d4d', tension: 0.4 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false } }
    });
}

function renderDeepStats(m) {
    document.getElementById('deep-stats-grid').innerHTML = `
        <div class="stat-card"><label>שערים צפויים (xG)</label><b>${m.xG.home} - ${m.xG.away}</b></div>
        <div class="stat-card"><label>החזקת כדור</label><b>${m.possession.home}% - ${m.possession.away}%</b></div>
        <div class="stat-card"><label>בעיטות למסגרת</label><b>${m.shotsOnTarget.home} - ${m.shotsOnTarget.away}</b></div>
        <div class="stat-card"><label>התקפות מסוכנות</label><b>${m.dangerousAttacks.home} - ${m.dangerousAttacks.away}</b></div>
    `;
}

function renderRoster(m) {
    document.getElementById('missing-list').innerHTML = m.injuries.length ? 
        m.injuries.map(i => `<div class="player-row"><strong>${i.player}</strong> (${i.team}) - ${i.reason}</div>`).join('') :
        '<p class="muted">אין חיסורים משמעותיים דווחו.</p>';
}

function sendToTelegram() {
    alert("בגרסת הייצור, פונקציה זו תיקרא לשרת שלך, והשרת ישלח את ההודעה לטלגרם בצורה מאובטחת בלי לחשוף את הטוקן.");
}

function startClock() {
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString('he-IL');
    }, 1000);
}

// נתוני דמי לדוגמה - מדמה את מה שהשרת יחזיר
function generateMockServerData() {
    return [
        {
            id: 'm1', leagueId: 'champions', leagueName: 'ליגת האלופות',
            homeTeam: 'ריאל מדריד', awayTeam: 'מנצ\'סטר סיטי', score: '1 - 1', minute: 65,
            xG: { home: 1.2, away: 1.8 }, possession: { home: 42, away: 58 },
            shotsOnTarget: { home: 4, away: 7 }, dangerousAttacks: { home: 45, away: 60 },
            winProbs: { home: 25, draw: 40, away: 35 }, aiConfidence: 88,
            verdict: "משחק צמוד מאוד. מנצ'סטר סיטי שולטת ב-xG, יש ערך (Value) בהימור על <strong>תיקו או ניצחון חוץ (X2)</strong>.",
            momentum: { home: [30, 40, 20, 60, 50, 40], away: [50, 60, 70, 40, 60, 80] },
            injuries: [{ player: 'קווין דה בראונה', team: 'סיטי', reason: 'פציעה בשריר הירך (בספק)' }]
        }
    ];
}

// הפעלה
window.onload = initApp;
