const App = {
  // רשימת הליגות המאושרות מהקוד שלך
  allowedLeagues: ['Champions League', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'NBA'],

  async refresh() {
    this.setStatus('SYNCING', false);
    this.matches = [];
    
    try {
      // 1. קודם כל מנסים להביא משחקי לייב
      const liveData = await fetch(`${CONFIG.apiUrl}/matches/${this.sport}`).then(r => r.json());
      if (liveData && liveData.length > 0) {
          this.processAndAddMatches(liveData, true);
      }

      // 2. מביאים שבוע קדימה (7 ימים)
      const today = new Date();
      for (let i = 0; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        const scheduledData = await fetch(`${CONFIG.apiUrl}/matches/${this.sport}?date=${dateStr}`).then(r => r.json());
        if (scheduledData && scheduledData.length > 0) {
            this.processAndAddMatches(scheduledData, false);
        }
      }
      
      this.renderList();
      this.setStatus('SYSTEM ONLINE', true);
    } catch(err) {
      this.setStatus('API ERROR', false);
    }
  },

  processAndAddMatches(events, isLive) {
    events.forEach(ev => {
        const leagueName = ev.league?.name || ev.tournament?.name || "";
        // סינון ליגות: רק מה שמופיע ברשימת המאושרות
        const isAllowed = this.allowedLeagues.some(l => leagueName.includes(l));
        
        if (isAllowed) {
            const processed = this.processEvent(ev, isLive);
            // מניעת כפילויות
            if (!this.matches.find(m => m.id === processed.id)) {
                this.matches.push(processed);
            }
        }
    });
  }
};
