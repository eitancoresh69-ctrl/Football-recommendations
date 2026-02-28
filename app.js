async loadUpcoming() {
    const today = new Date();
    let loaded = false;

    // שינוי ל-7 ימים קדימה (שבוע)
    for (let offset = 0; offset <= 7 && !loaded; offset++) {
      const d = new Date(today);
      d.setDate(d.getDate() + offset);
      const dateStr = d.toISOString().split('T')[0];

      try {
        const data = await ApiService.getScheduled(this.sport, dateStr);
        // סינון ליגות מבוקשות (באנגלית)
        const targetLeagues = [
          'Premier League', 'La Liga', 'Ligue 1', 'Serie A', 'Ligat HaAl', 'State Cup', // רגל
          'NBA', 'Israeli Basketball Super League' // סל
        ];
        
        let evs = (data?.events || []).filter(e => {
            const leagueName = e.tournament?.name || e.league?.name || '';
            return targetLeagues.some(l => leagueName.includes(l));
        }).slice(0, 25);

        if (evs.length > 0) {
          this.isLive = false;
          this.matches = evs.map(e => this.processEvent(e, false));
          this.setListMode(false);
          this.setStatus(`UPCOMING ${offset === 0 ? 'TODAY' : '+'+offset+'D'}`, true);
          loaded = true;
        }
      } catch(e) { /* continue to next day if error or empty */ }
    }

    if (!loaded) throw new Error('no events');
  },
