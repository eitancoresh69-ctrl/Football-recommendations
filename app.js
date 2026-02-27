const state = {
    matches: [],
    currentSport: 'football',
    selectedMatchId: null,
    // הליגות שביקשת להוסיף
    allowedLeagues: [
        'Premier League', 'La Liga', 'Ligue 1', 
        'UEFA Champions League', 'Bundesliga', 'Serie A', 'NBA'
    ]
};

async function fetchMatchesData() {
    const statusEl = document.getElementById('system-status');
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p class="muted">טוען משחקים ל-5 ימים הקרובים...</p>';

    try {
        const res = await fetch(`https://football-recommendations.onrender.com/api/matches/${state.currentSport}`);
        const data = await res.json();
        
        // סינון רק לפי הליגות המאושרות ורק משחקים שטרם הסתיימו
        state.matches = data.filter(m => {
            const league = m.league?.name || m.leagueName || "";
            const status = m.fixture?.status?.short || "";
            return state.allowedLeagues.some(l => league.includes(l)) && status !== 'FT';
        });

        renderMatchList();
        statusEl.innerText = 'SYSTEM ONLINE';
    } catch (error) {
        statusEl.innerText = 'CONNECTION ERROR';
    }
}

function renderMatchList() {
    const container = document.getElementById('matches-container');
    if (state.matches.length === 0) {
        container.innerHTML = '<p class="muted">אין משחקים קרובים בליגות שנבחרו.</p>';
        return;
    }

    container.innerHTML = state.matches.map(m => `
        <div class="match-card ${state.selectedMatchId === m.fixture?.id ? 'active' : ''}" onclick="selectMatch('${m.fixture?.id}')">
            <div class="card-league">${m.league?.name || m.leagueName}</div>
            <div class="card-teams">
                <span class="team-name">${m.teams?.home?.name || m.homeTeam}</span>
                <span class="team-name">${m.teams?.away?.name || m.awayTeam}</span>
            </div>
            <div class="card-meta">
                <span class="match-time">${m.fixture?.date ? new Date(m.fixture.date).toLocaleDateString('he-IL') : ''}</span>
                <span class="match-score">vs</span>
            </div>
        </div>
    `).join('');
}
