import db from "../db/index.js";
import { getTodayIST } from "../config/timezone.js";

export function getTodayTimeline() {
  const { date } = getTodayIST();

  return db.prepare(`
    SELECT
      s.id,
      t.name AS task,
      s.start_time,
      s.end_time,
      s.duration_minutes,
      s.source
    FROM task_sessions s
    JOIN daily_tasks d ON s.daily_task_id = d.id
    JOIN task_templates t ON d.task_template_id = t.id
    WHERE d.date = ?
      AND s.start_time IS NOT NULL
    ORDER BY s.start_time
  `).all(date);
}
