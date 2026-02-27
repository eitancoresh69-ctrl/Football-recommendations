const CONFIG = { apiUrl: 'https://football-recommendations.onrender.com/api' };
const state = {
    matches: [],
    currentSport: 'football',
    // הליגות שביקשת
    allowedLeagues: ['Ligat Ha\'al', 'Premier League', 'La Liga', 'Ligue 1', 'NBA', 'Winner League', 'Israel']
};

async function fetchMatchesData() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p style="font-size:1.5rem;">סורק משחקים ל-7 ימים קרובים...</p>';
    try {
        const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}`);
        const data = await res.json();
        state.matches = data.filter(m => {
            const league = m.league?.name || m.leagueName || "";
            return state.allowedLeagues.some(l => league.toLowerCase().includes(l.toLowerCase()));
        });
        renderList();
    } catch (e) { container.innerHTML = 'שגיאת API - וודא ששרת ה-Render פעיל'; }
}

function renderList() {
    const container = document.getElementById('matches-container');
    container.innerHTML = state.matches.map(m => `
        <div class="match-card" onclick="selectMatch('${m.id || m.fixture?.id}')">
            <div class="card-league">${m.league?.name || m.leagueName}</div>
            <span class="team-name">${m.teams?.home?.name || m.homeTeam}</span>
            <span class="team-name">${m.teams?.away?.name || m.awayTeam}</span>
            <span class="match-score">לפרטים ➔</span>
        </div>
    `).join('');
}
// הוסף את פונקציית selectMatch שמשתמשת ב-AI וב-UIManager
