const CONFIG = { apiUrl: 'https://football-recommendations.onrender.com/api' };
const state = {
    matches: [],
    currentSport: 'football',
    allowedLeagues: ['Ligat Ha\'al', 'Premier League', 'La Liga', 'NBA', 'Winner League', 'Israeli', 'Champions League']
};

async function fetchMatchesData() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p class="loading">סורק משחקים...</p>';
    try {
        const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}`);
        const data = await res.json();
        state.matches = data.filter(m => {
            const league = m.league?.name || m.leagueName || "";
            return state.allowedLeagues.some(l => league.toLowerCase().includes(l.toLowerCase()));
        });
        renderMatchList();
    } catch (e) { container.innerHTML = 'שגיאת תקשורת עם השרת'; }
}

function renderMatchList() {
    const container = document.getElementById('matches-container');
    container.innerHTML = state.matches.map(m => `
        <div class="match-card" onclick="selectMatch('${m.id || m.fixture?.id}')">
            <div class="card-league">${m.league?.name || m.leagueName}</div>
            <span class="team-name">${m.teams?.home?.name || m.homeTeam}</span>
            <span class="team-name">${m.teams?.away?.name || m.awayTeam}</span>
            <span class="match-score">VS</span>
        </div>
    `).join('');
}

function selectMatch(id) {
    const m = state.matches.find(match => (match.id || match.fixture?.id) == id);
    if (!m) return;
    document.getElementById('placeholder-text').style.display = 'none';
    document.getElementById('analysis-content').style.display = 'block';
    document.getElementById('match-title').innerText = `${m.teams?.home?.name || m.homeTeam} vs ${m.teams?.away?.name || m.awayTeam}`;
    
    // שימוש במנועי העזר שטענו ב-HTML
    const probs = AI.calcProbs(0, 0, 0, state.currentSport);
    const verdict = AI.verdict(probs, m.homeTeam, m.awayTeam, false);
    document.getElementById('ai-verdict-text').innerHTML = verdict.text;
    
    // מילוי השטחים הלבנים שסימנת
    UIManager.renderDeepAnalysis({
        deep: { 
            corners: Math.floor(Math.random()*12), 
            offsides: Math.floor(Math.random()*5),
            homeGoalsAvg: 1.8, awayGoalsAvg: 1.2,
            threePointers: "12/30", rebounds: 42, timeouts: 3,
            missing: AI.fakePlayers('Home')
        }
    });
    
    const h2h = AI.fakeH2H(m.homeTeam, m.awayTeam);
    document.getElementById('h2h-list').innerHTML = h2h.map(item => `<div class="stat-card">${item.date}: ${item.score}</div>`).join('');
}

document.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentSport = btn.dataset.sport;
        fetchMatchesData();
    });
});

window.onload = fetchMatchesData;
