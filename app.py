import streamlit as st
import api_sofascore as api
from datetime import datetime, timedelta

st.set_page_config(page_title="SportIQ ULTRA", layout="wide", initial_sidebar_state="expanded")

# Dark theme styling
st.markdown("""
<style>
    [data-testid="stSidebar"] {
        background: linear-gradient(135deg, #0a1825 0%, #0d1f2d 100%);
    }
    .stTabs [data-baseweb="tab-list"] button {
        color: #00f0ff;
        font-weight: 600;
    }
</style>
""", unsafe_allow_html=True)

st.title("🏆 SportIQ ULTRA v2")
st.markdown("**Advanced Sports Analytics & AI-Powered Betting Analysis**")

with st.sidebar:
    st.markdown("<h2 style='text-align:center; color: #00f0ff;'>🎯 בחר משחק</h2>", unsafe_allow_html=True)
    st.divider()
    
    # Sport selection
    col1, col2 = st.columns(2)
    with col1:
        if st.button("⚽ כדורגל", use_container_width=True, key="btn_football"):
            st.session_state.selected_sport = "כדורגל ⚽"
    with col2:
        if st.button("🏀 כדורסל", use_container_width=True, key="btn_basketball"):
            st.session_state.selected_sport = "כדורסל 🏀"
    
    sport_choice = st.session_state.get("selected_sport", "כדורגל ⚽")
    
    st.divider()
    
    # Load games
    with st.spinner("🔄 טוען משחקים..."):
        games_by_date = api.fetch_games_for_dates(sport=sport_choice, days=7)
    
    if not games_by_date:
        st.error("❌ לא נמצאו משחקים בליגות המטרה")
        st.stop()
    
    # Date selection
    dates_list = sorted(list(games_by_date.keys()))
    col_start, col_end = st.columns(2)
    
    with col_start:
        start_date = st.selectbox("מ:", dates_list, index=0, key="start_date", label_visibility="collapsed")
    with col_end:
        end_date = st.selectbox("עד:", dates_list, index=min(2, len(dates_list)-1), key="end_date", label_visibility="collapsed")
    
    st.divider()
    
    # Filter games
    filtered_games = []
    for date_str in dates_list:
        if start_date <= date_str <= end_date:
            for game in games_by_date[date_str]:
                if not api.game_has_started(game.get('start_timestamp', 0)):
                    filtered_games.append(game)
    
    if not filtered_games:
        st.warning("⚠️ אין משחקים בתאריכים הנבחרים")
        st.stop()
    
    st.markdown(f"**📅 {len(filtered_games)} משחקים זמינים**")
    st.divider()
    
    # Game cards
    selected_game = None
    
    for i, g in enumerate(filtered_games):
        game_time = api.get_israel_time(g.get('start_timestamp', 0))
        utc_now = datetime.utcnow()
        is_dst = (utc_now.month in [3,4,5,6,7,8,9,10]) and utc_now.day > 20
        israel_offset = 3 if is_dst else 2
        now_israel = utc_now + timedelta(hours=israel_offset)
        time_diff = game_time - now_israel
        hours_left = time_diff.total_seconds() / 3600
        
        time_str = g['time']
        home_he = g.get('home_he', g['home'])
        away_he = g.get('away_he', g['away'])
        league_he = g.get('league_he', g['league'][:15])
        
        card_html = f"""
        <div style='
            background: linear-gradient(135deg, rgba(0,60,100,0.4) 0%, rgba(0,240,255,0.1) 100%);
            border: 2px solid rgba(0,240,255,0.4);
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 8px;
        '>
            <div style='display: flex; justify-content: space-between; margin-bottom: 8px;'>
                <span style='color: #ffd94a; font-weight: 700; font-size: 0.85rem;'>🕐 {time_str}</span>
                <span style='color: #00ff88; font-weight: 600; font-size: 0.7rem;'>⏳ {hours_left:.1f}h</span>
            </div>
            <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;'>
                <span style='color: #e8f4f8; font-weight: 600; font-size: 0.9rem; flex: 1; text-align: right; margin-right: 6px;'>{home_he}</span>
                <span style='color: #00f0ff; font-weight: 700;'>⚔️</span>
                <span style='color: #e8f4f8; font-weight: 600; font-size: 0.9rem; flex: 1; text-align: left; margin-left: 6px;'>{away_he}</span>
            </div>
            <div style='color: #a8b2c1; font-size: 0.7rem; border-top: 1px solid rgba(0,240,255,0.2); padding-top: 6px;'>📍 {league_he}</div>
        </div>
        """
        
        st.markdown(card_html, unsafe_allow_html=True)
        
        if st.button(f"בחר", key=f"game_{g['id']}_{i}", use_container_width=True):
            selected_game = g
    
    # Default selection
    if selected_game is None:
        selected_game = filtered_games[0]
    
    st.divider()
    
    # Selected game info
    time_until = api.get_israel_time(selected_game.get('start_timestamp', 0))
    utc_now = datetime.utcnow()
    is_dst = (utc_now.month in [3,4,5,6,7,8,9,10]) and utc_now.day > 20
    israel_offset = 3 if is_dst else 2
    now_israel = utc_now + timedelta(hours=israel_offset)
    time_diff = time_until - now_israel
    hours = time_diff.total_seconds() / 3600
    
    home_he = selected_game.get('home_he', selected_game['home'])
    away_he = selected_game.get('away_he', selected_game['away'])
    league_he = selected_game.get('league_he', selected_game['league'])
    
    st.markdown(f"""
        <div style='
            background: linear-gradient(135deg, rgba(0,240,255,0.2) 0%, rgba(0,255,136,0.1) 100%);
            border: 2px solid #00f0ff;
            border-radius: 10px;
            padding: 12px;
        '>
            <div style='font-size: 0.8rem; color: #a8b2c1; margin-bottom: 8px;'>🎯 משחק נבחר</div>
            <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;'>
                <span style='color: #e8f4f8; font-weight: 700; font-size: 1rem;'>{home_he}</span>
                <span style='color: #00f0ff; font-weight: 700;'>⚔️</span>
                <span style='color: #e8f4f8; font-weight: 700; font-size: 1rem;'>{away_he}</span>
            </div>
            <div style='color: #a8b2c1; font-size: 0.75rem; margin-bottom: 6px;'>📍 {league_he}</div>
            <div style='color: #00ff88; font-size: 0.75rem; font-weight: 700;'>⏰ בעוד {hours:.1f} שעות</div>
        </div>
    """, unsafe_allow_html=True)

# Main content
col1, col2 = st.columns([2, 1])

with col1:
    st.markdown(f"### {selected_game['home_he']} vs {selected_game['away_he']}")
    st.markdown(f"**{selected_game['league']}** | {selected_game['time']}")
    
    st.divider()
    
    tab1, tab2, tab3, tab4 = st.tabs(["📊 Data", "⚔️ H2H", "🧠 AI", "📈 Stats"])
    
    with tab1:
        st.markdown("#### Odds")
        st.write(f"1: {selected_game.get('odds_1', 'Loading...')}")
        st.write(f"Draw: {selected_game.get('odds_x', 'Loading...')}")
        st.write(f"2: {selected_game.get('odds_2', 'Loading...')}")
    
    with tab2:
        st.markdown("#### Head to Head")
        st.write("Loading H2H data...")
    
    with tab3:
        st.markdown("#### AI Analysis")
        st.write("AI analysis coming soon...")
    
    with tab4:
        st.markdown("#### Team Statistics")
        st.write("Statistics coming soon...")

with col2:
    st.markdown("### 🎮 ליגות זמינות")
    st.caption("Football Leagues")
    st.write("""
    - ⚽ ליגת האלופות
    - ⚽ ליגת העל
    - ⚽ La Liga
    - ⚽ פרימיר ליג
    - ⚽ ליג 1
    """)
    
    st.caption("Basketball Leagues")
    st.write("""
    - 🏀 NBA
    - 🏀 ליגה בישראל
    - 🏀 ליגה סינית
    """)

st.divider()
st.caption("SportIQ ULTRA v2 | Data from SofaScore | Made with ❤️")
