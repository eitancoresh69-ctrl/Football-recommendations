const state = {
    matches: [],
    currentSport: 'football',
    // הוספת מילות מפתח רחבות יותר לזיהוי
    allowedLeagues: [
        'Ligat', 'Israel', 'Premier', 'La Liga', 'Ligue 1', 
        'Champions', 'NBA', 'Winner', 'Spain', 'England', 'France'
    ]
};

async function fetchMatchesData() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '<p style="font-size:1.5rem; padding:20px;">סורק משחקים מהשבוע הקרוב...</p>';

    try {
        const res = await fetch(`${CONFIG.apiUrl}/matches/${state.currentSport}`);
        const data = await res.json();
        
        // סינון חכם: מחפש אם שם הליגה מכיל את אחת ממילות המפתח
        state.matches = data.filter(m => {
            const league = (m.league?.name || m.leagueName || m.Match || "").toLowerCase();
            return state.allowedLeagues.some(l => league.includes(l.toLowerCase()));
        });

        renderMatchList();
    } catch (error) {
        container.innerHTML = 'שגיאת תקשורת עם השרת';
    }
}
