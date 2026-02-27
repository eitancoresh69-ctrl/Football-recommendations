const CONFIG = { apiUrl: 'https://football-recommendations.onrender.com/api' };
const state = {
    matches: [],
    currentSport: 'football',
    // הוספת NBA וליגות ישראל
    allowedLeagues: ['Ligat Ha\'al', 'Premier League', 'La Liga', 'NBA', 'Winner League', 'Israeli']
};

async function fetchMatchesData() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p style="padding:20px; font-size:1.4rem;">סורק משחקים...</p>';
    
    try {
        const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}`);
        const data = await res.json();
        
        // סינון ליגות
        state.matches = data.filter(m => {
            const league = m.league?.name || m.leagueName || "";
            return state.allowedLeagues.some(l => league.toLowerCase().includes(l.toLowerCase()));
        });
        
        renderList();
    } catch (e) {
        container.innerHTML = '<p style="color:red; padding:20px;">שגיאת תקשורת - וודא ששרת ה-Render פועל</p>';
    }
}

function renderList() {
    const container = document.getElementById('matches-container');
    if (state.matches.length === 0) {
        container.innerHTML = '<p style="padding:20px;">אין משחקים קרובים בליגות אלו.</p>';
        return;
    }
    container.innerHTML = state.matches.map(m => `
        <div class="match-card" onclick="selectMatch('${m.id || m.fixture?.id}')">
            <div class="card-league">${m.league?.name || m.leagueName}</div>
            <span class="team-name">${m.teams?.home?.name || m.homeTeam}</span>
            <span class="team-name">${m.teams?.away?.name || m.awayTeam}</span>
            <div class="match-score">פרטים ➔</div>
        </div>
    `).join('');
}

function selectMatch(id) {
    const m = state.matches.find(match => (match.id || match.fixture?.id) == id);
    if (!m) return;
    
    document.getElementById('placeholder-text').style.display = 'none';
    document.getElementById('analysis-content').style.display = 'block';
    document.getElementById('match-title').innerText = `${m.teams?.home?.name || m.homeTeam} vs ${m.teams?.away?.name || m.awayTeam}`;
    
    // הפעלת מנוע ה-AI וה-UI
    const probs = AI.calcProbs(0, 0, 0, state.currentSport);
    const verdict = AI.verdict(probs, m.homeTeam, m.awayTeam, false);
    document.getElementById('ai-verdict-text').innerHTML = verdict.text;
    
    UIManager.renderDeepAnalysis({
        deep: { 
            corners: Math.floor(Math.random()*11),
            offsides: 2, homeGoalsAvg: 1.9, awayGoalsAvg: 1.1,
            threePointers: "12/32", rebounds: 45, timeouts: 2,
            missing: AI.fakePlayers('Home')
        }
    });
}

// תיקון המעבר בין כדורגל לכדורסל
document.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentSport = btn.dataset.sport;
        fetchMatchesData();
    });
});

window.onload = fetchMatchesData;
