const CONFIG = { apiUrl: 'https://football-recommendations.onrender.com/api' };
const state = {
    matches: [],
    currentSport: 'football',
    allowedLeagues: ['Ligat Ha\'al', 'Premier League', 'La Liga', 'Ligue 1', 'NBA', 'Winner League', 'Israel', 'Basketball']
};

async function fetchMatchesData() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p style="font-size:1.4rem; padding:15px;">סורק 5 ימים קדימה...</p>';
    
    try {
        const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}`);
        const data = await res.json();
        
        // סינון חכם שמוצא את הליגות שביקשת
        state.matches = data.filter(m => {
            const league = (m.league?.name || m.leagueName || m.Match || "").toLowerCase();
            return state.allowedLeagues.some(l => league.includes(l.toLowerCase()));
        });
        
        renderList();
    } catch (e) { container.innerHTML = 'שגיאה בטעינה'; }
}

function renderList() {
    const container = document.getElementById('matches-container');
    if (state.matches.length === 0) {
        container.innerHTML = '<p style="padding:15px;">לא נמצאו משחקים קרובים בליגות אלו.</p>';
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
