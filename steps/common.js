// ============================================================
//  STEP CHALLENGE — shared helpers (dates, formatting, data)
// ============================================================

const isConfigured = () => !/PASTE_/.test(CONFIG.supabaseUrl + CONFIG.supabaseKey);
const db = isConfigured() ? supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey) : null;

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const fmt = (n) => Math.round(n).toLocaleString("en-AU");

// Local date for a challenge day (1-based).
function dayDate(day) {
  const [y, m, d] = CONFIG.startDate.split("-").map(Number);
  return new Date(y, m - 1, d + day - 1);
}
function dayLabel(day, opts = { weekday: "short", day: "numeric", month: "short" }) {
  return dayDate(day).toLocaleDateString("en-AU", opts);
}
// Today's challenge day: 0 before the start, totalDays + 1 after the end.
function todayDay() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((today - dayDate(1)) / 86400000) + 1;
  return Math.max(0, Math.min(CONFIG.totalDays + 1, diff));
}
// Clamped to 1..totalDays for UI that needs a real day.
const currentDay = () => Math.max(1, Math.min(CONFIG.totalDays, todayDay()));

// Supabase returns at most 1000 rows per request, so page through.
async function fetchAll(table, columns) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(columns).range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

async function loadChallenge() {
  const [clients, steps] = await Promise.all([
    fetchAll("clients", "id,name"),
    fetchAll("steps", "client_id,day,steps,updated_at"),
  ]);
  clients.sort((a, b) => a.name.localeCompare(b.name));
  return { clients, steps };
}

// Totals per client, sorted for the leaderboard (ties share a rank).
function standings({ clients, steps }) {
  const byId = new Map(clients.map((c) => [c.id, { ...c, total: 0, days: 0, best: 0 }]));
  for (const s of steps) {
    const c = byId.get(s.client_id);
    if (!c) continue;
    c.total += s.steps; c.days += 1; c.best = Math.max(c.best, s.steps);
  }
  const list = [...byId.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  list.forEach((c, i) => { c.rank = i > 0 && c.total === list[i - 1].total ? list[i - 1].rank : i + 1; });
  return list;
}
