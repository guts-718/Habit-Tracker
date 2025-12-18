import db from "../db/index.js";
import { randomUUID } from "crypto";
import { getTodayIST } from "../config/timezone.js";

export function generateTodayTasks() {
  const { date, day } = getTodayIST();

  const existing = db.prepare(`
    SELECT COUNT(*) as count
    FROM daily_tasks
    WHERE date = ?
  `).get(date);

  if (existing.count > 0) {
    return db.prepare(`
      SELECT * FROM daily_tasks WHERE date = ?
    `).all(date);
  }


  const templates = db.prepare(`
    SELECT *
    FROM task_templates
    WHERE active = 1
  `).all();

  const insertStmt = db.prepare(`
    INSERT INTO daily_tasks (
      id,
      task_template_id,
      date,
      planned_minutes,
      actual_minutes,
      completion_ratio,
      status,
      created_at
    )
    VALUES (?, ?, ?, ?, 0, 0, 'PENDING', ?)
  `);

  const now = new Date().toISOString();

  for (const t of templates) {
    const days = JSON.parse(t.days_of_week);

    if (days.includes(day)) {
      insertStmt.run(
        randomUUID(),
        t.id,
        date,
        t.planned_minutes,
        now
      );
    }
  }

  return db.prepare(`
    SELECT * FROM daily_tasks WHERE date = ?
  `).all(date);
}
