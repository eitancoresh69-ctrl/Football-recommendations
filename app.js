// ... (בתוך פונקציית selectMatch)
function selectMatch(id) {
    const match = state.matches.find(m => m.id === id);
    if (!match) return;

    document.getElementById('analysis-content').style.display = 'block';
    document.getElementById('match-title').innerText = `${match.homeTeam} vs ${match.awayTeam}`;
    
    // הצגת קרנות וסטטיסטיקות
    document.getElementById('deep-stats-grid').innerHTML = `
        <div class="stat-card"><span>🚩 קרנות חזויות</span><strong>${match.deep.corners}</strong></div>
        <div class="stat-card"><span>📈 מומנטום</span><strong>גבוה</strong></div>
    `;

    // הצגת פצועים
    document.getElementById('missing-players-list').innerHTML = match.deep.missing.map(p => 
        `<div style="color:#ef4444;">• ${p}</div>`).join('');

    // הצגת H2H
    document.getElementById('h2h-list').innerHTML = match.deep.h2h.map(res => 
        `<div class="stat-card">${res}</div>`).join('');
}
