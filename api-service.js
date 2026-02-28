const ApiService = {
  // מפנה לשרת הפייתון המקומי שלך
  host: 'http://localhost:8000',

  async get(path) {
    try {
      const r = await fetch(`${this.host}${path}`);
      if (!r.ok) throw new Error(r.status);
      return r.json();
    } catch (err) {
      console.error("Scraper Proxy Error:", err);
      throw err;
    }
  },

  async getLive(sport) {
    const ep = sport === 'soccer' ? 'football' : 'basketball';
    return this.get(`/api/v1/sport/${ep}/events/live`);
  },

  async getScheduled(sport, date) {
    const ep = sport === 'soccer' ? 'football' : 'basketball';
    return this.get(`/api/v1/sport/${ep}/scheduled-events/${date}`);
  },

  async getEventStats(id) {
    return this.get(`/api/v1/event/${id}/statistics`).catch(() => null);
  },

  async getLineups(id) {
    return this.get(`/api/v1/event/${id}/lineups`).catch(() => null);
  },

  async getH2H(id) {
    return this.get(`/api/v1/event/${id}/h2h`).catch(() => null);
  }
};
