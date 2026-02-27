const state = {
    matches: [],
    currentSport: 'football',
    allowedLeagues: ['Champions League', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'NBA']
};

async function fetchMatchesData() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p class="muted">סורק משחקים ל-5 ימים הקרובים...</p>';
    
    state.matches = [];
    const today = new Date();

    try {
        // לולאה ל-5 הימים הקרובים (כמו בווינר)
        for (let i = 0; i <= 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}?date=${dateStr}`);
            const data = await res.json();
            
            if (Array.isArray(data)) {
                data.forEach(m => {
                    const league = m.league?.name || m.leagueName || "";
                    // סינון ליגות מאושרות בלבד
                    if (state.allowedLeagues.some(al => league.includes(al))) {
                        // הוספה רק אם המשחק טרם הסתיים
                        if (m.fixture?.status?.short !== 'FT') {
                            state.matches.push(this.formatMatch(m));
                        }
                    }
                });
            }
        }
        renderMatchList();
    } catch (error) {
        console.error("שגיאה במשיכת משחקים עתידיים");
    }
}
