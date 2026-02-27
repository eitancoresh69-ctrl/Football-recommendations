const CONFIG = { apiUrl: 'https://football-recommendations.onrender.com/api' };
const state = {
    matches: [],
    currentSport: 'football',
    allowedKeywords: ['ligat', 'israel', 'premier', 'la liga', 'ligue 1', 'nba', 'winner', 'champions']
};

async function fetchMatchesData() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p style="font-size:1.5rem; padding:20px;">סורק משחקים מהשבוע הקרוב...</p>';
    
    try {
        const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}`);
        const data = await res.json();
        
        // סינון חכם לפי מילות מפתח
        state.matches = data.filter(m => {
            const league = (m.league?.name || m.leagueName || m.Match || "").toLowerCase();
            return state.allowedKeywords.some(key => league.includes(key));
        });
        
        renderList();
    } catch (e) { container.innerHTML = 'שגיאת API - וודא ששרת ה-Render רץ'; }
}

function renderList() {
    const container = document.getElementById('matches-container');
    if (state.matches.length === 0) {
        container.innerHTML = '<p style="padding:20px;">אין משחקים קרובים בליגות אלו.</p>';
        return;
    }
    container.innerHTML = state.matches.map(m => `
        <div class="match-card" onclick="selectMatch('${m.id || m.fixture?.id || Math.random()}')">
            <div class="card-league">${m.league?.name || m.leagueName || (state.currentSport==='basketball'?'NBA':'')}</div>
            <span class="team-name">${m.teams?.home?.name || m.homeTeam || m.Match?.split(' vs ')[0] || 'Home'}</span>
            <span class="team-name">${m.teams?.away?.name || m.awayTeam || m.Match?.split(' vs ')[1] || 'Away'}</span>
            <div class="match-score">פרטים ➔</div>
        </div>
    `).join('');
}

// מעבר בין ספורט
document.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentSport = btn.dataset.sport;
        fetchMatchesData();
    });
});

window.onload = fetchMatchesData;
