const ApiService = {
  key:  '480d7b8455mshb4ee5606f0a42a1p10a646jsn64b65efdb148',
  host: 'sportapi7.p.rapidapi.com',

  async get(path) {
    const r = await fetch(`https://${this.host}${path}`, {
      headers: { 'x-rapidapi-key': this.key, 'x-rapidapi-host': this.host }
    });
    if (!r.ok) throw new Error(r.status);
    return r.json();
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