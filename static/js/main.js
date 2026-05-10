const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
const tickColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';

const COLORS = {
  coral:  { bg: '#D85A3099', bd: '#D85A30' },
  blue:   { bg: '#185FA599', bd: '#185FA5' },
  teal:   { bg: '#0F6E5699', bd: '#0F6E56' },
  purple: { bg: '#534AB799', bd: '#534AB7' },
  amber:  { bg: '#BA751799', bd: '#BA7517' },
  red:    { bg: '#A32D2D99', bd: '#A32D2D' },
  pink:   { bg: '#99355699', bd: '#993556' },
};

function baseOpts(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: {
      label: ctx => ' ' + Number(ctx.parsed.x ?? ctx.parsed.y).toLocaleString()
    }}},
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 }, autoSkip: false, maxRotation: 40 } },
      y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } }
    },
    ...extra
  };
}

function makeBar(id, labels, data, colorKey) {
  const c = COLORS[colorKey];
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: c.bg, borderColor: c.bd, borderWidth: 1, borderRadius: 4 }] },
    options: baseOpts()
  });
}

function makeHorizBar(id, labels, data, colorKey) {
  const c = COLORS[colorKey];
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: c.bg, borderColor: c.bd, borderWidth: 1, borderRadius: 4 }] },
    options: {
      ...baseOpts(),
      indexAxis: 'y',
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } }
      }
    }
  });
}

async function fetchAndRender(url, fn) {
  try {
    const res = await fetch(url);
    const d = await res.json();
    fn(d.labels, d.values);
  } catch(e) { console.error(url, e); }
}

async function loadSummary() {
  try {
    const res = await fetch('/api/summary');
    const d = await res.json();
    document.getElementById('stat-matches').textContent = d.total_matches.toLocaleString();
    document.getElementById('stat-wins').textContent = d.most_wins;
    document.getElementById('stat-batter').textContent = d.top_batter;
    document.getElementById('stat-venue').textContent = d.top_venue;
  } catch(e) {}
}

loadSummary();
fetchAndRender('/api/wins',            (l,v) => makeBar('chartWins', l, v, 'coral'));
fetchAndRender('/api/toss',            (l,v) => makeBar('chartToss', l, v, 'amber'));
fetchAndRender('/api/player_of_match', (l,v) => makeHorizBar('chartPotm', l, v, 'teal'));
fetchAndRender('/api/team_runs',       (l,v) => makeBar('chartRuns', l, v, 'purple'));
fetchAndRender('/api/batsmen',         (l,v) => makeHorizBar('chartBat', l, v, 'blue'));
fetchAndRender('/api/bowlers',         (l,v) => makeHorizBar('chartBowl', l, v, 'red'));
fetchAndRender('/api/venues',          (l,v) => makeBar('chartVenues', l, v, 'pink'));
