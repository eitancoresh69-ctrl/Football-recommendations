const API_URL = 'https://football-recommendations.onrender.com/api';
let currentSport = 'football';

async function loadMatches() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p style="font-size:1.5rem;">טוען נתונים מה-API... (5 ימים קדימה)</p>';

    try {
        const res = await fetch(`${API_URL}/matches/${currentSport}`);
        const data = await res.json();

        // סינון ליגות רחב כדי שלא נפספס כלום
        const allowed = ['ligat', 'israel', 'nba', 'winner', 'premier', 'la liga', 'ligue 1', 'champions'];
        const filtered = data.filter(m => {
            const league = (m.league?.name || m.leagueName || m.Match || "").toLowerCase();
            return allowed.some(key => league.includes(key));
        });

        if (filtered.length === 0) {
            container.innerHTML = '<p>לא נמצאו משחקים בליגות אלו ב-5 הימים הקרובים.</p>';
            return;
        }

        container.innerHTML = filtered.map(m => `
            <div class="match-card" onclick="showMatch('${m.id || m.fixture?.id}')">
                <div class="card-league">${m.league?.name || m.leagueName || 'NBA'}</div>
                <span class="team-name">${m.teams?.home?.name || m.homeTeam || m.Match?.split(' vs ')[0]}</span>
                <span class="team-name">${m.teams?.away?.name || m.awayTeam || m.Match?.split(' vs ')[1]}</span>
            </div>
        `).join('');
        
        window.allMatches = filtered; // שמירה לניתוח
    } catch (e) {
        container.innerHTML = 'שגיאה בחיבור לשרת ה-Render. וודא שהשרת רץ.';
    }
}

function changeSport(sport) {
    currentSport = sport;
    loadMatches();
}

function showMatch(id) {
    const m = window.allMatches.find(match => (match.id || match.fixture?.id) == id);
    if (!m) return;
    document.getElementById('match-title').innerText = `${m.teams?.home?.name || m.homeTeam} vs ${m.teams?.away?.name || m.awayTeam}`;
    document.getElementById('ai-verdict').innerHTML = `ניתוח AI: יתרון קל לקבוצה המארחת. צפוי משחק התקפי.`;
}

window.onload = loadMatches;
