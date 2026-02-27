const state = {
    matches: [],
    currentSport: 'football',
    // הוספת הליגות הישראליות ובקשות המשתמש
    allowedLeagues: [
        'Ligat Ha\'al', 'Israeli Premier League', 'Premier League', 
        'La Liga', 'Ligue 1', 'Champions League', 'NBA', 'Winner League'
    ]
};

async function fetchMatchesData() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p class="muted">סורק משחקים ל-7 הימים הקרובים...</p>';

    try {
        const res = await fetch(`https://football-recommendations.onrender.com/api/matches/${state.currentSport}`);
        const data = await res.json();
        
        // סינון רק לפי הליגות המאושרות ומשחקים עתידיים
        state.matches = data.filter(m => {
            const league = m.league?.name || m.leagueName || "";
            return state.allowedLeagues.some(l => league.includes(l));
        });

        renderMatchList();
    } catch (error) {
        console.error("Connection error");
    }
}
