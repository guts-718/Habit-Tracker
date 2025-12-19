import db from "../db/index.js";

export function getDailyStreak() {
  const rows = db.prepare(`
    SELECT date, score
    FROM daily_summary
    ORDER BY date DESC
  `).all();

  let streak = 0;

  for (const r of rows) {
    if (r.score >= 60) streak++;
    else break;
  }

  return streak;
}


export function getTaskStreaks() {
  const rows = db.prepare(`
    SELECT
      t.name,
      d.date,
      d.status
    FROM daily_tasks d
    JOIN task_templates t
      ON d.task_template_id = t.id
    ORDER BY d.date DESC
  `).all();

  const map = {};

  for (const r of rows) {
    if (!map[r.name]) map[r.name] = { streak: 0, broken: false };

    if (map[r.name].broken) continue;

    if (r.status === "DONE") {
      map[r.name].streak++;
    } else {
      map[r.name].broken = true;
    }
  }

  return Object.entries(map).map(([name, v]) => ({
    name,
    streak: v.streak
  }));
}
