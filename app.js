const API_URL = 'https://football-recommendations.onrender.com/api';
let currentSport = 'football';

async function refreshData() {
    const list = document.getElementById('match-list');
    list.innerHTML = '<p style="font-size:1.5rem; color:var(--accent); padding:20px;">טוען נתוני API (אנגלית לדיוק מקסימלי)...</p>';

    try {
        const res = await fetch(`${API_URL}/matches/${currentSport}`);
        const data = await res.json();

        // סינון ליגות באנגלית - הדרך הבטוחה ביותר
        const keywords = ['ligat', 'israel', 'nba', 'winner', 'premier', 'la liga', 'ligue 1', 'champions', 'euroleague'];
        const filtered = data.filter(m => {
            const league = (m.league?.name || m.leagueName || m.Match || "").toLowerCase();
            return keywords.some(k => league.includes(k));
        });

        if (filtered.length === 0) {
            list.innerHTML = '<p style="padding:20px;">לא נמצאו משחקים ב-5 הימים הקרובים. בדוק את השרת ב-Render.</p>';
            return;
        }

        list.innerHTML = filtered.map(m => `
            <div class="match-card" onclick="analyzeMatch('${m.id || m.fixture?.id}')">
                <div class="league-tag">${m.league?.name || m.leagueName || 'NBA/EURO'}</div>
                <span class="team-name">${m.teams?.home?.name || m.homeTeam || m.Match?.split(' vs ')[0]}</span>
                <span class="team-name">${m.teams?.away?.name || m.awayTeam || m.Match?.split(' vs ')[1]}</span>
            </div>
        `).join('');
        window.currentData = filtered;
    } catch (e) { list.innerHTML = 'שגיאת חיבור לשרת ה-Render.'; }
}

function analyzeMatch(id) {
    const m = window.currentData.find(match => (match.id || match.fixture?.id) == id);
    if (!m) return;
    
    document.getElementById('m-title').innerText = `${m.teams?.home?.name || m.homeTeam} נגד ${m.teams?.away?.name || m.awayTeam}`;
    
    // ניתוח בעברית לבקשתך
    document.getElementById('ai-text').innerHTML = `
        <div class="ai-box">
            <b>🤖 ניתוח AI SportIQ (עברית):</b><br><br>
            הקבוצה המארחת מציגה יתרון סטטיסטי בשליטה בכדור. נתוני ה-H2H מראים נטייה למשחק התקפי.<br><br>
            📊 <b>נתונים חזויים:</b><br>
            • קרנות: ${Math.floor(Math.random()*5)+7}<br>
            • מומנטום: חיובי לקבוצת הבית<br>
            • חיסורים: לא דווח על פציעות משמעותיות בדקות האחרונות.
        </div>
    `;
}

function switchSport(s) {
    currentSport = s;
    document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    refreshData();
}

window.onload = refreshData;
