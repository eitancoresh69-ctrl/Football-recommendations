const App = {
  sport:   'soccer',
  matches: [],
  sel:     null,
  isLive:  true,
  mChart:  null,
  tgToken: 'YOUR_BOT_TOKEN',
  chatId:  'YOUR_CHAT_ID',

  // רשימת הליגות המבוקשות
  TARGET_LEAGUES: [
    'Premier League', 'LaLiga', 'Ligue 1', 'Serie A', // כדורגל אירופה
    'Ligat HaAl', 'State Cup', 'Toto Cup', // כדורגל ישראלי
    'NBA', 'Super League', 'National League' // כדורסל (כולל ישראלי)
  ],

  // פונקציית עזר לסינון ליגות
  isTargetLeague(ev) {
    const leagueName = ev.tournament?.name || ev.league?.name || '';
    const countryName = ev.tournament?.category?.name || '';
    
    const isTarget = this.TARGET_LEAGUES.some(l => leagueName.includes(l));
    const isIsrael = countryName.toLowerCase() === 'israel'; // תופס את כל המשחקים מישראל
    
    return isTarget || isIsrael;
  },

  async init() {
    this.startClock();
    await this.refresh();
    setInterval(() => this.refresh(), 30000);
  },

  async refresh() {
    this.setStatus('SYNCING', false);
    try {
      const data = await ApiService.getLive(this.sport);
      // סינון רק למשחקים החיים מהליגות שלנו
      const evs = (data?.events || []).filter(e => this.isTargetLeague(e));

      if (evs.length > 0) {
        this.isLive = true;
        this.matches = evs.map(e => this.processEvent(e, true));
        this.setListMode(true);
        this.setStatus('LIVE', true);
      } else {
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
    if (this.sel !== null && this.sel < this.matches.length) this.selectMatch(this.sel, true);
  },

  async loadUpcoming() {
    const today = new Date();
    let loaded = false;
    let allFutureEvents = [];

    // סורק 7 ימים קדימה (כמו בווינר) במקום 3
    for (let offset = 0; offset <= 7 && !loaded; offset++) {
      const d = new Date(today);
      d.setDate(d.getDate() + offset);
      const dateStr = d.toISOString().split('T')[0];

      try {
        const data = await ApiService.getScheduled(this.sport, dateStr);
        // סינון ליגות
        const evs = (data?.events || []).filter(e => this.isTargetLeague(e));
        
        if (evs.length > 0) {
          allFutureEvents = allFutureEvents.concat(evs);
          // אם מצאנו מספיק משחקים (לפחות 5), נעצור פה כדי להציג אותם
          if (allFutureEvents.length >= 5) {
             this.isLive = false;
             this.matches = allFutureEvents.slice(0, 30).map(e => this.processEvent(e, false));
             this.setListMode(false);
             this.setStatus(`UPCOMING ${offset === 0 ? 'TODAY' : '+'+offset+'D'}`, true);
             loaded = true;
          }
        }
      } catch(e) { /* ממשיך ליום הבא אם יש שגיאה */ }
    }

    // אם סיימנו את הלולאה ויש משחקים אבל פחות מ-5, נציג אותם בכל זאת
    if (!loaded && allFutureEvents.length > 0) {
       this.isLive = false;
       this.matches = allFutureEvents.slice(0, 30).map(e => this.processEvent(e, false));
       this.setListMode(false);
       this.setStatus('UPCOMING SOON', true);
       loaded = true;
    }

    if (!loaded) throw new Error('no events found for target leagues');
  },

  // ... כאן ממשיך השאר הקוד המקורי שלך (processEvent, renderList וכו') ...
