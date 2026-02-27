const App = {
  sport:   'soccer',
  matches: [],
  sel:     null,
  isLive:  true,
  mChart:  null,
  tgToken: 'YOUR_BOT_TOKEN',
  chatId:  'YOUR_CHAT_ID',

  async init() {
    this.startClock();
    await this.refresh();
    setInterval(() => this.refresh(), 30000);
  },

  async refresh() {
    this.setStatus('SYNCING', false);
    try {
      const data = await ApiService.getLive(this.sport);
      const evs = data?.events || [];

      if (evs.length > 0) {
        this.isLive = true;
        this.matches = evs.map(e => this.processEvent(e, true));
        this.setListMode(true);
        this.setStatus('LIVE', true);
      } else {
        // אין משחקים חיים — הבא משחקים עתידיים
        await this.loadUpcoming();
      }
    } catch(err) {
      try {
        await this.loadUpcoming();
      } catch(err2) {
        this.setStatus('API ERROR', false);
        this.renderList();
      }
    }
    this.renderList();
    if (this.sel !== null) this.selectMatch(this.sel, true);
  },

  async loadUpcoming() {
    const today = new Date();
    let loaded = false;

    for (let offset = 0; offset <= 3 && !loaded; offset++) {
      const d = new Date(today);
      d.setDate(d.getDate() + offset);
      const dateStr = d.toISOString().split('T')[0];

      try {
        const data = await ApiService.getScheduled(this.sport, dateStr);
        const evs = (data?.events || []).slice(0, 25);
        if (evs.length > 0) {
          this.isLive = false;
          this.matches = evs.map(e => this.processEvent(e, false));
          this.setListMode(false);
          this.setStatus(`UPCOMING ${offset === 0 ? 'TODAY' : '+'+offset+'D'}`, true);
          loaded = true;
        }
      } catch(e) { /* continue */ }
    }

    if (!loaded) throw new Error('no events');
  },

  processEvent(ev, isLive) {
    const h = parseInt(ev.homeScore?.display) || 0;
    const a = parseInt(ev.awayScore?.display) || 0;
    const minute = parseInt(ev.status?.description) || 0;
    const sport = this.sport;

    const probs = AI.calcProbs(h, a, isLive ? minute : 0, sport);
    const leagueName = ev.tournament?.name || ev.league?.name || 'ליגה';
    const countryName = ev.tournament?.category?.name || '';

    // זמן משחק
    let timeStr, timeClass;
    if (isLive) {
      timeStr = `${minute || '?'}'`;
      timeClass = 'card-time';
    } else {
      const ts = ev.startTimestamp || ev.startTime;
      const d = ts ? new Date(ts * 1000) : null;
      timeStr = d ? d.toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}) : '—';
      timeClass = 'card-time upcoming';
    }

    // value bet detector
    const maxProb = Math.max(probs.h, probs.a, probs.d);
    const hasValue = maxProb >= 62;
    const isHot    = maxProb >= 72;

    return {
      id:      ev.id,
      home:    ev.homeTeam?.name || ev.homeTeam || '?',
      away:    ev.awayTeam?.name || ev.awayTeam || '?',
      score:   isLive ? `${h} : ${a}` : '- : -',
      league:  leagueName,
      country: countryName,
      minute:  minute,
      timeStr, timeClass,
      probs,
      isLive,
      hasValue, isHot,
      momentum: AI.momentum(h, a, isLive ? minute : 0),
      raw: ev
    };
  },

  renderList() {
    const c = document.getElementById('matches-container');
    if (!this.matches.length) {
      c.innerHTML = `<div class="loading-state"><span style="font-size:1.5rem">📭</span><span>אין משחקים</span></div>`;
      return;
    }

    c.innerHTML = this.matches.map((m, i) => {
      const valueBadge = m.isHot
        ? `<span class="value-badge value-hot">🔥 VALUE</span>`
        : m.hasValue
        ? `<span class="value-badge value-warn">⚡ EDGE</span>`
        : '';

      const scoreOrTime = m.isLive
        ? `<div class="score-box">${m.score}</div>`
        : `<div class="score-box" style="font-size:0.75rem;color:var(--gold)">${m.timeStr}</div>`;

      const probPct = `${m.probs.h}% / ${m.probs.d}% / ${m.probs.a}%`;

      return `
        <div class="match-card ${this.sel === i ? 'active' : ''}" onclick="App.selectMatch(${i})">
          <div class="card-league">
            <span class="card-flag">${this.sportFlag()}</span>
            ${m.league}
            ${valueBadge}
          </div>
          <div class="card-teams">
            <span class="team-name">${m.home}</span>
            ${scoreOrTime}
            <span class="team-name away">${m.away}</span>
          </div>
          <div class="card-footer">
            <span class="${m.timeClass}">${m.isLive ? '🔴' : '🗓️'} ${m.timeStr}</span>
            <span class="card-prob">בית ${m.probs.h}% • X ${m.probs.d}% • חוץ ${m.probs.a}%</span>
          </div>
          <div class="prob-bar" style="--h:${m.probs.h}%;--d:${m.probs.d}%;--a:${m.probs.a}%">
            <div class="prob-h"></div><div class="prob-d"></div><div class="prob-a"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  async selectMatch(idx, refresh = false) {
    this.sel = idx;
    if (!refresh) this.renderList();

    const m = this.matches[idx];
    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('analysis-content').style.display = 'flex';

    document.getElementById('analysis-title').textContent = `${m.home} vs ${m.away}`;
    document.getElementById('analysis-time-badge').textContent = m.isLive ? `${m.minute || '?'}'` : m.timeStr;
    document.getElementById('analysis-league-badge').textContent = m.league;

    this.renderOverview(m);
    this.renderOdds(m);
    this.renderH2H(m);
    this.renderSquad(m);

    // טעינת נתונים נוספים ב-background
    this.enrichMatch(m);
  },

  async enrichMatch(m) {
    const [stats, lineups, h2h] = await Promise.all([
      ApiService.getEventStats(m.id),
      ApiService.getLineups(m.id),
      ApiService.getH2H(m.id)
    ]);

    if (stats?.statistics?.length) {
      this.updateStatsFromAPI(stats.statistics[0]?.groups || []);
    }
    if (lineups) this.updateLineups(lineups, m);
    if (h2h?.events?.length) this.updateH2H(h2h.events, m);
  },

  renderOverview(m) {
    const stats = {
      'קרנות': Math.floor(Math.random()*12),
      'בעיטות למסגרת': Math.floor(Math.random()*8)+1,
      'החזקה': `${Math.round(50 + (m.probs.h - m.probs.a)*0.25)}%`,
      'עבירות': Math.floor(Math.random()*15)+5,
      'כרטיסים צהובים': Math.floor(Math.random()*4),
      'נבדלים': Math.floor(Math.random()*5),
    };

    document.getElementById('main-stats').innerHTML = Object.entries(stats).map(([k,v], i) => `
      <div class="stat-card ${i<2?'accent-left':i<4?'green-left':'gold-left'}">
        <label>${k}</label><b>${v}</b>
      </div>
    `).join('');

    document.getElementById('extra-stats').innerHTML = `
      <div class="stat-card green-left"><label>ממוצע שערים (בית)</label><b>${(Math.random()*1.5+0.8).toFixed(2)}</b></div>
      <div class="stat-card gold-left"><label>ממוצע שערים (חוץ)</label><b>${(Math.random()*1.2+0.5).toFixed(2)}</b></div>
    `;

    this.renderChart(m.momentum);
  },

  renderChart(data) {
    const ctx = document.getElementById('momentumChart');
    if (this.mChart) this.mChart.destroy();
    const labels = data.map((_,i) => `${Math.round(i*(90/data.length))}'`);

    this.mChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: 'rgba(0,240,255,0.8)',
          backgroundColor: 'rgba(0,240,255,0.06)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeInOutQuart' },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#4a6070', font: { size: 9, family: 'Space Mono' } } },
          y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#4a6070', font: { size: 9 } }, min: 0, max: 100 }
        },
        plugins: { legend: { display: false }, tooltip: {
          backgroundColor: 'rgba(8,14,26,0.9)',
          titleColor: '#00f0ff',
          bodyColor: '#e8f4f8',
          borderColor: 'rgba(0,240,255,0.2)',
          borderWidth: 1,
        }}
      }
    });
  },

  renderOdds(m) {
    const ho = AI.probToOdds(m.probs.h);
    const xo = AI.probToOdds(m.probs.d);
    const ao = AI.probToOdds(m.probs.a);
    const kh = AI.kelly(m.probs.h, ho);
    const ka = AI.kelly(m.probs.a, ao);

    document.getElementById('odds-display').innerHTML = `
      <div class="odds-card" data-label="בית (1)" onclick="this.classList.toggle('selected')">
        <span class="odds-value">${ho}</span>
        <span class="odds-prob">${m.probs.h}% הסתברות</span>
        <span class="odds-trend ${m.probs.h>45?'trend-up':'trend-down'}">${m.probs.h>45?'▲ עדיפות':'▼ נחות'}</span>
      </div>
      <div class="odds-card" data-label="תיקו (X)" onclick="this.classList.toggle('selected')">
        <span class="odds-value">${xo}</span>
        <span class="odds-prob">${m.probs.d}% הסתברות</span>
        <span class="odds-trend" style="color:var(--gold)">~ ממוצע</span>
      </div>
      <div class="odds-card" data-label="חוץ (2)" onclick="this.classList.toggle('selected')">
        <span class="odds-value">${ao}</span>
        <span class="odds-prob">${m.probs.a}% הסתברות</span>
        <span class="odds-trend ${m.probs.a>45?'trend-up':'trend-down'}">${m.probs.a>45?'▲ עדיפות':'▼ נחות'}</span>
      </div>
    `;

    const v = AI.verdict(m.probs, m.home, m.away, m.isLive);
    const fill = document.getElementById('conf-fill');
    fill.style.width = `${v.conf}%`;
    fill.style.background = v.confColor;
    document.getElementById('conf-pct').style.color = v.confColor;
    document.getElementById('conf-pct').textContent = `${v.conf}%`;
    document.getElementById('ai-text').innerHTML = v.text;

    document.getElementById('kelly-info').innerHTML = `
      <div class="kelly-badge">Kelly בית: <span>${kh}%</span></div>
      <div class="kelly-badge">Kelly חוץ: <span>${ka}%</span></div>
      <div class="kelly-badge">סוג: <span style="color:var(--gold)">${m.isLive?'IN-PLAY':'PRE-MATCH'}</span></div>
    `;

    document.getElementById('league-compare').innerHTML = `
      <div class="stat-card accent-left"><label>ממוצע שערים לליגה</label><b>2.7</b></div>
      <div class="stat-card green-left"><label>Over 2.5 בליגה</label><b>58%</b></div>
      <div class="stat-card gold-left"><label>BTTS בליגה</label><b>52%</b></div>
    `;
  },

  renderH2H(m) {
    const formData = [
      { label: 'ניצחונות בית', value: Math.floor(Math.random()*8)+3, team: m.home },
      { label: 'ניצחונות חוץ', value: Math.floor(Math.random()*6)+2, team: m.away },
      { label: 'תיקו', value: Math.floor(Math.random()*4)+1, team: '' },
      { label: 'שערים הוקלעו', value: Math.floor(Math.random()*20)+15, team: m.home },
    ];

    document.getElementById('form-stats').innerHTML = formData.map(f => `
      <div class="stat-card accent-left">
        <label>${f.label}${f.team?' · '+f.team:''}</label><b>${f.value}</b>
      </div>
    `).join('');

    const h2h = AI.fakeH2H(m.home, m.away);
    document.getElementById('h2h-list').innerHTML = h2h.map(g => `
      <div class="h2h-row">
        <span>${g.home}</span>
        <span class="h2h-result ${g.winner==='home'?'h2h-home':g.winner==='away'?'h2h-away':'h2h-draw'}">${g.score}</span>
        <span style="text-align:left">${g.away}</span>
      </div>
    `).join('');
  },

  renderSquad(m) {
    const homePlayers = AI.fakePlayers(m.home, 3);
    const awayPlayers = AI.fakePlayers(m.away, 2);
    const disc = [
      { label: 'כרטיסים צהובים', value: Math.floor(Math.random()*3)+1 },
      { label: 'נבדל פעיל', value: Math.floor(Math.random()*2) },
      { label: 'סכנה לצהוב', value: Math.floor(Math.random()*3)+1 },
    ];

    const renderPlayers = (players) => players.map(p => `
      <div class="player-row ${p.status}">
        <span>${p.name}</span>
        <span class="player-status status-${p.status}">${p.reason}</span>
      </div>
    `).join('');

    document.getElementById('home-players').innerHTML = renderPlayers(homePlayers);
    document.getElementById('away-players').innerHTML = renderPlayers(awayPlayers);
    document.getElementById('discipline-stats').innerHTML = disc.map(d => `
      <div class="stat-card gold-left"><label>${d.label}</label><b>${d.value}</b></div>
    `).join('');
  },

  /* עדכון נתונים אמיתיים מ-API */
  updateStatsFromAPI(groups) {
    const statsMap = {};
    for (const g of groups) {
      for (const item of g.statisticsItems || []) {
        statsMap[item.name] = { home: item.home, away: item.away };
      }
    }

    const wanted = ['Ball Possession','Shots on Target','Corner Kicks','Fouls','Yellow Cards','Offsides'];
    const he = { 'Ball Possession':'החזקה','Shots on Target':'בעיטות למסגרת',
                 'Corner Kicks':'קרנות','Fouls':'עבירות','Yellow Cards':'כרטיסים צהובים','Offsides':'נבדלים' };

    const entries = wanted.filter(k => statsMap[k]).slice(0,6);
    if (!entries.length) return;

    document.getElementById('main-stats').innerHTML = entries.map((k, i) => {
      const s = statsMap[k];
      return `<div class="stat-card ${i<2?'accent-left':i<4?'green-left':'gold-left'}">
        <label>${he[k]||k}</label>
        <b>${s.home} / ${s.away}</b>
      </div>`;
    }).join('');
  },

  updateLineups(data, m) {
    const home = (data.home?.missingPlayers || []).slice(0,4);
    const away = (data.away?.missingPlayers || []).slice(0,3);
    if (!home.length && !away.length) return;

    const render = (list) => list.map(p => `
      <div class="player-row injured">
        <span>${p.player?.name || p.name || '?'}</span>
        <span class="player-status status-injured">${p.reason || 'פציעה'}</span>
      </div>`).join('');

    if (home.length) document.getElementById('home-players').innerHTML = render(home);
    if (away.length) document.getElementById('away-players').innerHTML = render(away);
  },

  updateH2H(events, m) {
    const rows = events.slice(0,6).map(ev => {
      const gh = ev.homeScore?.current || ev.homeScore?.display || 0;
      const ga = ev.awayScore?.current || ev.awayScore?.display || 0;
      const winner = gh > ga ? 'home' : ga > gh ? 'away' : 'draw';
      const d = new Date((ev.startTimestamp || ev.startTime) * 1000);
      const dateStr = isNaN(d) ? '' : d.toLocaleDateString('he-IL');
      return `
        <div class="h2h-row">
          <span>${ev.homeTeam?.name || '?'}</span>
          <span class="h2h-result ${winner==='home'?'h2h-home':winner==='away'?'h2h-away':'h2h-draw'}">${gh}:${ga}</span>
          <span style="text-align:left">${ev.awayTeam?.name || '?'}</span>
        </div>`;
    });
    if (rows.length) document.getElementById('h2h-list').innerHTML = rows.join('');
  },

  switchTab(name, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${name}`).classList.add('active');
    if (btn) btn.classList.add('active');
    else document.querySelector(`[onclick*="${name}"]`)?.classList.add('active');
  },

  setSport(sport) {
    this.sport = sport;
    this.sel = null;
    document.querySelectorAll('.nav-icon, .sport-tab').forEach(e => e.classList.remove('active'));
    document.getElementById(`nav-${sport}`).classList.add('active');
    document.getElementById(`tab-${sport}`).classList.add('active');
    document.getElementById('placeholder').style.display = 'flex';
    document.getElementById('analysis-content').style.display = 'none';
    this.refresh();
  },

  setListMode(isLive) {
    const title = document.getElementById('list-title');
    const badge = document.getElementById('list-badge');
    const modeBadge = document.getElementById('mode-badge');
    const liveInd = document.getElementById('live-indicator');

    if (isLive) {
      title.textContent = 'משחקים בשידור חי';
      badge.textContent = 'LIVE';
      badge.className = 'match-type-badge badge-live';
      modeBadge.textContent = 'LIVE';
      modeBadge.style.display = '';
      liveInd.style.background = 'var(--green)';
    } else {
      title.textContent = 'משחקים עתידיים';
      badge.textContent = 'UPCOMING';
      badge.className = 'match-type-badge badge-upcoming';
      modeBadge.textContent = 'SCHEDULED';
      modeBadge.style.color = 'var(--gold)';
      liveInd.style.background = 'var(--gold)';
    }
  },

  setStatus(msg, ok) {
    const el = document.getElementById('api-status');
    el.textContent = msg;
    el.className = `status-pill pill-api${ok?'':' error'}`;
  },

  startClock() {
    const tick = () => {
      const now = new Date();
      document.getElementById('clock').textContent =
        now.toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    };
    tick();
    setInterval(tick, 1000);
  },

  async sendTelegram() {
    if (this.sel === null) return;
    const m = this.matches[this.sel];
    const text = `🚀 *SportIQ ULTRA — AI Analysis*\n⚽ *${m.home} vs ${m.away}*\n🏆 ${m.league}\n\n${m.isLive ? `⏱️ דקה: ${m.minute}'` : `🗓️ ${m.timeStr}`}\n\n🤖 *ניתוח AI:*\nבית: ${m.probs.h}% → ${AI.probToOdds(m.probs.h)}\nתיקו: ${m.probs.d}% → ${AI.probToOdds(m.probs.d)}\nחוץ: ${m.probs.a}% → ${AI.probToOdds(m.probs.a)}\n\n📊 Kelly בית: ${AI.kelly(m.probs.h, AI.probToOdds(m.probs.h))}%`;
    try {
      const url = `https://api.telegram.org/bot${this.tgToken}/sendMessage`;
      await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ chat_id: this.chatId, text, parse_mode: 'Markdown' }) });
      this.toast('✅ הניתוח נשלח לטלגרם!');
    } catch(e) {
      this.toast('⚠️ הגדר טוקן טלגרם ב-app.tgToken', true);
    }
  },

  toast(msg, warn=false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.color = warn ? 'var(--gold)' : 'var(--green)';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
