const CONFIG = {
    apiUrl: 'https://football-recommendations.onrender.com/api'
};

const state = {
    matches: [],
    currentSport: 'football',
    selectedMatchId: null,
    // הליגות שביקשת
    allowedLeagues: [
        'Ligat Ha\'al', 'Premier League', 'La Liga', 'Ligue 1', 
        'Champions League', 'NBA', 'Winner League', 'Israel'
    ]
};

async function fetchMatchesData() {
    const statusEl = document.getElementById('system-status');
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p class="muted" style="font-size:1.2rem;">סורק משחקים ל-7 ימים קרובים...</p>';

    try {
        const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}`);
        const data = await res.json();
        
        // סינון רק לפי הליגות שביקשת
        state.matches = data.filter(m => {
            const league = m.league?.name || m.leagueName || "";
            return state.allowedLeagues.some(l => league.toLowerCase().includes(l.toLowerCase()));
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
        container.innerHTML = '<p class="muted">אין משחקים קרובים בליגות אלו.</p>';
        return;
    }

    container.innerHTML = state.matches.map(m => `
        <div class="match-card" onclick="selectMatch('${m.id || m.fixture?.id}')">
            <div class="card-league">${m.league?.name || m.leagueName}</div>
            <div class="card-teams">
                <span class="team-name">${m.teams?.home?.name || m.homeTeam}</span>
                <span class="team-name">${m.teams?.away?.name || m.awayTeam}</span>
            </div>
            <span class="match-score">${m.score || 'VS'}</span>
        </div>
    `).join('');
}
