import db from "../db/index.js";
import { getCurrentWeekRange } from "./weekUtils.js";

export function getWeeklyTaskStats() {
  const { start, end } = getCurrentWeekRange();

  const rows = db.prepare(`
    SELECT
      t.name AS task,
      SUM(d.planned_minutes) AS planned,
      SUM(d.actual_minutes) AS actual
    FROM daily_tasks d
    JOIN task_templates t
      ON d.task_template_id = t.id
    WHERE d.date BETWEEN ? AND ?
    GROUP BY t.id
    ORDER BY t.name
  `).all(start, end);

  return rows.map(r => ({
    task: r.task,
    planned: r.planned || 0,
    actual: r.actual || 0,
    ratio:
      r.planned > 0
        ? Number((r.actual / r.planned).toFixed(2))
        : 0
  }));
}
