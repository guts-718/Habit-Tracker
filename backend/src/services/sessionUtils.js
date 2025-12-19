import db from "../db/index.js";

export function recomputeDailyTask(dailyTaskId) {
  const total = db.prepare(`
    SELECT COALESCE(SUM(duration_minutes), 0) AS total
    FROM task_sessions
    WHERE daily_task_id = ?
  `).get(dailyTaskId).total;

  const planned = db.prepare(`
    SELECT planned_minutes
    FROM daily_tasks
    WHERE id = ?
  `).get(dailyTaskId).planned_minutes;

  let status = "PENDING";
  if (total > 0 && total < planned) status = "PARTIAL";
  else if (total >= planned) status = "DONE";

  const ratio = planned > 0 ? total / planned : 0;

  db.prepare(`
    UPDATE daily_tasks
    SET actual_minutes = ?,
        completion_ratio = ?,
        status = ?
    WHERE id = ?
  `).run(total, ratio, status, dailyTaskId);
}
