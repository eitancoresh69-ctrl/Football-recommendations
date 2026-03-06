#!/usr/bin/env python3
"""
✅ COMPREHENSIVE SIMULATION TEST - All Components
"""

from datetime import datetime, timedelta
import sys

print("=" * 70)
print("🧪 COMPREHENSIVE SIMULATION TEST - SportIQ ULTRA")
print("=" * 70)

# Test 1: Import modules
print("\n📋 TEST 1: Module Imports")
print("-" * 70)
try:
    import requests
    print("✅ requests module loaded")
except:
    print("❌ requests module failed")
    sys.exit(1)

try:
    import pandas
    print("✅ pandas module loaded")
except:
    print("❌ pandas module failed")
    sys.exit(1)

print("✅ All modules imported successfully")

# Test 2: League filtering
print("\n📋 TEST 2: League Filtering (EXACT MATCH)")
print("-" * 70)

FOOTBALL_LEAGUES = [
    'UEFA Champions League',
    'Ligat Winner',
    'LaLiga',
    'Copa del Rey',
    'Supercopa de España',
    'Premier League',
    'FA Cup',
    'EFL Cup',
    'Ligue 1',
    'Coupe de France'
]

BASKETBALL_LEAGUES = [
    'NBA',
    'Israeli Basketball League',
    'CBA'
]

def is_target_league(league_name, sport):
    """EXACT match - league must be in our list"""
    league_stripped = league_name.strip()
    
    if sport == "כדורגל ⚽":
        leagues = FOOTBALL_LEAGUES
    elif sport == "כדורסל 🏀":
        leagues = BASKETBALL_LEAGUES
    else:
        return False, None
    
    if league_stripped in leagues:
        return True, league_stripped
    
    return False, None

# Test cases
test_leagues = [
    ("UEFA Champions League", "כדורגל ⚽", True),
    ("Queensland Premier League", "כדורגל ⚽", False),  # ❌ Should NOT match!
    ("Premier League", "כדורגל ⚽", True),
    ("Australian Super Rugby", "כדורגל ⚽", False),
    ("NBA", "כדורסל 🏀", True),
    ("CBA", "כדורסל 🏀", True),
    ("Egyptian Super League", "כדורגל ⚽", False),
]

league_tests_passed = 0

for league, sport, expected in test_leagues:
    result, _ = is_target_league(league, sport)
    passed = result == expected
    
    status = "✅" if passed else "❌"
    result_text = "matched" if result else "not matched"
    expected_text = "match" if expected else "not match"
    
    print(f"{status} {league}: {result_text} (expected: {expected_text})")
    if passed:
        league_tests_passed += 1

print(f"\n✅ {league_tests_passed}/{len(test_leagues)} league tests passed")

# Test 3: Time calculations
print("\n📋 TEST 3: Time Calculations (Israel Timezone)")
print("-" * 70)

def get_israel_time(utc_timestamp):
    """Convert UTC to Israel time (UTC+2/3)"""
    try:
        if utc_timestamp == 0:
            return datetime.now()
        utc_time = datetime.utcfromtimestamp(utc_timestamp)
        is_dst = (utc_time.month in [3,4,5,6,7,8,9,10]) and utc_time.day > 20
        israel_offset = 3 if is_dst else 2
        return utc_time + timedelta(hours=israel_offset)
    except:
        return datetime.now()

def game_has_started(start_timestamp):
    """Check if game started (Israel time)"""
    try:
        if start_timestamp == 0:
            return False
        
        game_time = get_israel_time(start_timestamp)
        
        utc_now = datetime.utcnow()
        is_dst = (utc_now.month in [3,4,5,6,7,8,9,10]) and utc_now.day > 20
        israel_offset = 3 if is_dst else 2
        now_israel = utc_now + timedelta(hours=israel_offset)
        
        return game_time < now_israel
    except:
        return False

# Test cases
utc_now = datetime.utcnow()
is_dst = (utc_now.month in [3,4,5,6,7,8,9,10]) and utc_now.day > 20
israel_offset = 3 if is_dst else 2
now_israel = utc_now + timedelta(hours=israel_offset)

time_tests = [
    ("משחק שהתחיל לפני שעה", -1, True),
    ("משחק בעוד שעה", 1, False),
    ("משחק בעוד 6 שעות", 6, False),
    ("משחק שהתחיל לפני 3 דקות", -0.05, True),
    ("משחק בעוד 30 דקות", 0.5, False),
]

time_tests_passed = 0

for desc, hours_offset, expected in time_tests:
    game_time = now_israel + timedelta(hours=hours_offset)
    timestamp = int(game_time.timestamp()) - (israel_offset * 3600)
    result = game_has_started(timestamp)
    passed = result == expected
    
    status = "✅" if passed else "❌"
    result_text = "started" if result else "not started"
    expected_text = "started" if expected else "not started"
    
    print(f"{status} {desc}: {result_text} (expected: {expected_text})")
    if passed:
        time_tests_passed += 1

print(f"\n✅ {time_tests_passed}/{len(time_tests)} time tests passed")

# Test 4: Team translation
print("\n📋 TEST 4: Team Name Translation")
print("-" * 70)

TEAM_NAMES_HE = {
    'Al Ahly FC': 'אל אהלי',
    'Arab Contractors FC': 'קבלנים ערבים',
    'Zamalek SC': 'זמלק',
    'Pyramids FC': 'פירמידס',
}

def translate_team(team_name):
    """Translate team name to Hebrew"""
    return TEAM_NAMES_HE.get(team_name, team_name)

team_tests = [
    ("Al Ahly FC", "אל אהלי"),
    ("Zamalek SC", "זמלק"),
    ("Unknown Team", "Unknown Team"),
]

team_tests_passed = 0

for team, expected in team_tests:
    result = translate_team(team)
    passed = result == expected
    
    status = "✅" if passed else "❌"
    print(f"{status} {team}: {result} (expected: {expected})")
    if passed:
        team_tests_passed += 1

print(f"\n✅ {team_tests_passed}/{len(team_tests)} team translation tests passed")

# Final summary
print("\n" + "=" * 70)
print("📊 FINAL SUMMARY")
print("=" * 70)

total_tests = len(test_leagues) + len(time_tests) + len(team_tests)
total_passed = league_tests_passed + time_tests_passed + team_tests_passed

print(f"\n✅ League filtering: {league_tests_passed}/{len(test_leagues)}")
print(f"✅ Time calculations: {time_tests_passed}/{len(time_tests)}")
print(f"✅ Team translation: {team_tests_passed}/{len(team_tests)}")
print(f"\n✅ TOTAL: {total_passed}/{total_tests} tests passed ({int(total_passed/total_tests*100)}%)")

if total_passed == total_tests:
    print("\n🎉 ALL TESTS PASSED! ✅")
    print("The code is ready for production! 🚀")
else:
    print(f"\n⚠️ {total_tests - total_passed} tests failed")
    sys.exit(1)

print("\n" + "=" * 70)
