const AI = {
  /* חישוב הסתברויות מסיכויים + מצב משחק */
  calcProbs(h, a, minute, sport) {
    const isLive = minute > 0;
    let hP, dP, aP;

    if (sport === 'soccer') {
      const goalDiff = (h || 0) - (a || 0);
      const timeLeft = isLive ? Math.max(0, 90 - (minute || 45)) : 90;
      const momentum = Math.exp(-timeLeft * 0.04);

      hP = 38 + goalDiff * 18 + (timeLeft < 15 ? goalDiff * 8 : 0) + momentum * 5;
      aP = 30 + (-goalDiff) * 18 + (timeLeft < 15 ? (-goalDiff) * 8 : 0) + momentum * 5;
      dP = 100 - hP - aP;

      // normalize
      const tot = hP + aP + dP;
      hP = Math.round((hP/tot)*100);
      aP = Math.round((aP/tot)*100);
      dP = 100 - hP - aP;
    } else {
      const ptDiff = (h || 0) - (a || 0);
      hP = 50 + ptDiff * 2;
      aP = 50 - ptDiff * 2;
      dP = 0;
      hP = Math.min(Math.max(hP, 10), 90);
      aP = 100 - hP;
    }

    return {
      h: Math.min(Math.max(hP, 5), 90),
      d: Math.min(Math.max(dP, 0), 40),
      a: Math.min(Math.max(aP, 5), 90)
    };
  },

  /* המרת הסתברות ל-odds */
  probToOdds(prob, margin = 0.94) {
    if (!prob || prob <= 0) return '—';
    return (100 / prob * margin).toFixed(2);
  },

  /* Kelly Criterion */
  kelly(prob, odds) {
    const p = prob / 100;
    const b = parseFloat(odds) - 1;
    const k = (b * p - (1 - p)) / b;
    return Math.max(0, Math.min(k * 100, 25)).toFixed(1);
  },

  /* ניתוח טקסטואלי */
  verdict(probs, homeTeam, awayTeam, isLive) {
    const conf = Math.max(probs.h, probs.a, probs.d);
    const leader = probs.h > probs.a && probs.h > probs.d ? homeTeam
                 : probs.a > probs.d ? awayTeam : 'תיקו';

    const confColor = conf >= 65 ? 'var(--green)' : conf >= 52 ? 'var(--gold)' : 'var(--dim)';
    let text = '';

    if (conf >= 65) {
      text = `מנוע ה-AI מזהה <span class="rec-highlight">יתרון ברור</span> ל<span class="rec-highlight">${leader}</span> עם ביטחון ${conf}%. `;
      if (probs.h >= 65) text += `קבוצת הבית שולטת — שקול <span style="color:var(--green)">1</span>.`;
      else if (probs.a >= 65) text += `קבוצת החוץ עדיפה — שקול <span style="color:var(--green)">2</span>.`;
    } else if (conf >= 52) {
      text = `משחק <span class="rec-highlight">פתוח</span> עם עדיפות קלה ל${leader}. `;
      text += isLive ? `עקוב אחר דינמיקת המשחק לפני כניסה.` : `מומלץ לחכות לסימני לחץ חיים.`;
    } else {
      text = `<span class="rec-highlight">משחק לא ניתן לחיזוי</span> — הסיכויים מאוזנים. `;
      text += `הימנע ממניות 1X2 בודדת. שקול Double Chance.`;
    }
    return { text, conf, confColor };
  },

  /* יצירת מומנטום */
  momentum(h, a, minute) {
    const base = 50 + (h - a) * 8;
    return Array.from({ length: 12 }, (_, i) => {
      const t = (i / 11) * (minute || 90);
      const noise = (Math.random() - 0.5) * 25;
      return Math.round(Math.min(Math.max(base + noise + i * 1.5, 5), 95));
    });
  },

  /* H2H מדומה ריאליסטי */
  fakeH2H(home, away) {
    const results = [];
    for (let i = 0; i < 5; i++) {
      const r = Math.random();
      const gh = Math.floor(Math.random() * 4);
      const ga = Math.floor(Math.random() * 3);
      results.push({
        date: `${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}/${String(Math.floor(Math.random()*10)+1).padStart(2,'0')}/2024`,
        home, away,
        score: `${gh}:${ga}`,
        winner: gh > ga ? 'home' : ga > gh ? 'away' : 'draw'
      });
    }
    return results;
  },

  /* שחקנים חסרים */
  fakePlayers(team, count = 3) {
    const names = ['מ. ג\'ונסון','ר. סילבה','כ. מולר','ל. מסי','ר. מדריד','נ. קנטה','פ. דיבלה','ז. הנדרסון'];
    const reasons = ['פציעת שריר','עם ספק','התאוששות','כרטיסים','מנוחה מניתוח'];
    const statuses = ['injured','doubt','injured','doubt','injured'];
    return Array.from({length: count}, () => {
      const idx = Math.floor(Math.random()*names.length);
      const st = Math.floor(Math.random()*statuses.length);
      return { name: names[idx], reason: reasons[st], status: statuses[st] };
    });
  }
};