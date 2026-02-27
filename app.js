const CONFIG = {
    apiUrl: 'https://football-recommendations.onrender.com/api'
};

async function fetchMatchesData() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p class="loading">טוען משחקים ל-5 ימים הקרובים...</p>';

    try {
        const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}`);
        const data = await res.json();
        
        // סינון ליגות רלוונטיות בלבד (ליגת האלופות, פרמייר ליג וכו')
        state.matches = data.filter(m => {
            const league = m.league?.name || m.leagueName || "";
            return ['Champions League', 'Premier League', 'La Liga', 'NBA'].some(l => league.includes(l));
        });

        renderMatchList();
    } catch (error) {
        document.getElementById('system-status').innerText = 'CONNECTION ERROR';
    }
}
