# 🌐 Data Sources & Enhancement Opportunities

## 8 Available Data Sources

### 1. **The Odds API** ⭐ (Most Used)
**Status:** Already Integrated ✅

```
URL: https://www.the-odds-api.com
Type: Odds/Betting Data
Price: Free (500 calls/month)
Sports: 100+ leagues worldwide
```

**What it provides:**
- Real-time betting odds
- Multiple bookmakers
- 1x2, Over/Under, Handicap markets
- Decimal and fractional odds

**How it's used in SportIQ:**
```python
def get_odds_from_the_odds_api(home_team, away_team):
    """Fetch odds from The Odds API"""
    url = "https://api.the-odds-api.com/v4/sports/upcoming/odds/"
```

**Integration Guide:**
1. Sign up: https://www.the-odds-api.com
2. Get API Key
3. Add to `.streamlit/secrets.toml`:
```toml
ODDS_API_KEY = "your_key_here"
```

---

### 2. **ESPN API** 📺
**Status:** Not Integrated (Easy to add)

```
URL: https://www.espn.com/apis/
Type: Sports Data & Statistics
Price: Free
Sports: All major sports
```

**What it provides:**
- Team standings
- Game schedules
- Player statistics
- Live scores
- Expert analysis

**Integration Example:**
```python
def get_espn_standings(league_id, season):
    url = f"https://site.api.espn.com/sites/site/leagues/{league_id}/season/{season}/standings"
    response = requests.get(url)
    return response.json()
```

---

### 3. **RapidAPI - Football Data** ⚽
**Status:** Not Integrated (Medium effort)

```
URL: https://rapidapi.com/api-sports/api/api-football
Type: Football Data & Statistics
Price: Free tier + Paid
Sports: Football only
Rate Limit: 100 requests/day (free)
```

**What it provides:**
- League standings
- Team statistics
- Player data
- Head-to-head history
- Injuries & suspensions
- Live odds

**Setup:**
1. Sign up on RapidAPI
2. Search "api-football"
3. Get API Key
4. Use headers:
```python
headers = {
    "X-RapidAPI-Key": "your_key",
    "X-RapidAPI-Host": "api-football-data.p.rapidapi.com"
}
```

---

### 4. **StatsBomb** 📊 (Advanced)
**Status:** Not Integrated (Complex)

```
URL: https://statsbomb.com
Type: Advanced Football Analytics
Price: Free tier + Paid
Data: Extremely detailed
```

**What it provides:**
- Event-by-event data
- Shot maps
- Pass maps
- xG (expected goals)
- Player positioning
- 360° data

**Why use it:**
- Most accurate football analytics
- Professional-grade data
- Used by top clubs worldwide

**Integration Level:** 🟡 Medium-High

---

### 5. **Betfair API** 💰
**Status:** Not Integrated (Requires account)

```
URL: https://docs.developer.betfair.com
Type: Betting Exchange Data
Price: Requires account (free API)
Sports: All major sports
```

**What it provides:**
- Real-time market prices
- Liquidity data
- In-play odds
- Lay odds (betting against)
- Match odds & totals

**Why use it:**
- Betfair is world's largest betting exchange
- Odds are typically best on Betfair
- No house margin

---

### 6. **Pinnacle API** 🎯
**Status:** Not Integrated (Medium effort)

```
URL: https://www.pinnacle.com/en/api-resources/
Type: Betting Data
Price: Free
Sports: All major sports
```

**What it provides:**
- Sharp odds (not limited)
- Tightest margins
- Line movements
- Historical odds

**Why use it:**
- Best for finding value
- Professional bettors use Pinnacle
- Doesn't ban winners

---

### 7. **NBA Stats** 🏀
**Status:** Not Integrated (Easy)

```
URL: https://stats.nba.com/
Type: Basketball Statistics
Price: Free
Sports: NBA only
```

**What it provides:**
- Live game data
- Player statistics
- Team statistics
- Advanced metrics
- Play-by-play data

**Example Call:**
```python
url = "https://stats.nba.com/stats/leaguegamefinder"
params = {
    "Season": 2025,
    "LeagueID": "00",
    "PlayerOrTeamAbbr": "T",
    "Outcome": "W"
}
```

---

### 8. **Sports-Reference** 📈
**Status:** Not Integrated (Requires Web Scraping)

```
URL: https://www.sports-reference.com
Type: Historical Sports Data
Price: Free
Sports: Baseball, Basketball, Football, Hockey, Soccer
```

**What it provides:**
- 100+ years of historical data
- Player career statistics
- Team records
- Season summaries
- Advanced statistics

**Why special:** 
- Deepest historical data available
- Perfect for trend analysis
- Great for "this never happened before" analysis

**Requires:** BeautifulSoup or Selenium for scraping

---

## How to Enhance SportIQ with These Sources

### Phase 1: Easy Additions (1-2 hours)
```python
# Add NBA Stats integration
# Add ESPN API for league standings
# Already have: The Odds API
```

### Phase 2: Medium Additions (3-5 hours)
```python
# Add RapidAPI Football Data
# Add Pinnacle API for sharp odds
# Create odds comparison widget
```

### Phase 3: Advanced Additions (1-2 weeks)
```python
# StatsBomb integration
# Web scraping Sports-Reference
# Build prediction model with xG data
# Create heat maps and advanced visualizations
```

---

## Recommended Enhancement Priority

### 🥇 Priority 1: RapidAPI (Immediate)
- Easy to integrate
- Fills gaps in football data
- Affordable

### 🥈 Priority 2: Pinnacle API (Week 1)
- Best for value betting
- Complements existing odds
- Professional-grade

### 🥉 Priority 3: StatsBomb (Month 1)
- Most advanced analytics
- Requires more dev time
- Highest ROI for analysis

---

## Example: Adding a New Data Source

### Step 1: Create API function
```python
def get_team_advanced_stats(team_id, source="espn"):
    """Fetch advanced stats from external source"""
    if source == "espn":
        url = f"https://site.api.espn.com/teams/{team_id}/stats"
    elif source == "statsbomb":
        url = f"https://statsbomb.com/api/teams/{team_id}"
    
    response = requests.get(url)
    return response.json()
```

### Step 2: Cache the data
```python
@st.cache_data(ttl=3600)
def get_team_advanced_stats_cached(team_id, source="espn"):
    return get_team_advanced_stats(team_id, source)
```

### Step 3: Display in UI
```python
with st.expander("📊 Advanced Statistics"):
    advanced_stats = get_team_advanced_stats_cached(team_id)
    st.write(advanced_stats)
```

---

## Performance Considerations

### Rate Limiting Best Practices
```python
import time

def fetch_with_rate_limit(url, delay=1):
    time.sleep(delay)  # Wait between requests
    return requests.get(url)
```

### Caching Strategy
```python
@st.cache_data(ttl=1800)  # 30 minutes
def expensive_api_call():
    return fetch_data()
```

### Error Handling
```python
try:
    data = requests.get(url, timeout=5)
    if data.status_code == 200:
        return data.json()
except requests.exceptions.Timeout:
    st.error("API timeout")
except requests.exceptions.RequestException as e:
    st.error(f"Error: {e}")
```

---

## Cost Comparison

| Source | Free Tier | Cost | Best For |
|--------|-----------|------|----------|
| The Odds API | 500/month | $0-99/month | Betting odds |
| ESPN | Unlimited | $0 | Basic stats |
| RapidAPI | 100/day | $0-50/month | Football data |
| StatsBomb | Limited | $0-999+/year | Advanced analytics |
| Betfair | Yes | $0 | Exchange odds |
| Pinnacle | Yes | $0 | Sharp odds |
| NBA Stats | Unlimited | $0 | Basketball |
| Sports-Ref | Unlimited | $0 | Historical data |

---

## Next Steps

1. ✅ Choose which source to add first
2. ✅ Get API keys/credentials
3. ✅ Create API integration function
4. ✅ Add caching
5. ✅ Display in UI
6. ✅ Test with real data

---

**Questions?** Check individual API documentation at their websites.

**Maintenance:** Update this file when adding new data sources.
