import db from "../db/index.js";

export function logTaskMinutes({ dailyTaskId, minutes }) {
  if (minutes <= 0) {
    throw new Error("Minutes must be positive");
  }

  // 1️⃣ Fetch current task state
  const task = db.prepare(`
    SELECT planned_minutes, actual_minutes
    FROM daily_tasks
    WHERE id = ?
  `).get(dailyTaskId);

  if (!task) {
    throw new Error("Daily task not found");
  }

  // 2️⃣ Increment actual minutes
  const newActual = task.actual_minutes + minutes;

  // 3️⃣ Recalculate completion ratio
  const completionRatio =
    task.planned_minutes === 0
      ? 0
      : newActual / task.planned_minutes;

  // 4️⃣ Determine status
  let status = "PENDING";
  if (newActual > 0 && newActual < task.planned_minutes) {
    status = "PARTIAL";
  } else if (newActual >= task.planned_minutes) {
    status = "DONE";
  }

  // 5️⃣ Persist update
  db.prepare(`
    UPDATE daily_tasks
    SET actual_minutes = ?,
        completion_ratio = ?,
        status = ?
    WHERE id = ?
  `).run(newActual, completionRatio, status, dailyTaskId);

  return {
    actual_minutes: newActual,
    completion_ratio: completionRatio,
    status
  };
}








export function setTaskMinutes({ dailyTaskId, actualMinutes }) {
  if (actualMinutes < 0) {
    throw new Error("Invalid minutes");
  }

  const task = db.prepare(`
    SELECT planned_minutes
    FROM daily_tasks
    WHERE id = ?
  `).get(dailyTaskId);

  if (!task) {
    throw new Error("Daily task not found");
  }

  const completionRatio =
    task.planned_minutes === 0
      ? 0
      : actualMinutes / task.planned_minutes;

  let status = "PENDING";
  if (actualMinutes > 0 && actualMinutes < task.planned_minutes) {
    status = "PARTIAL";
  } else if (actualMinutes >= task.planned_minutes) {
    status = "DONE";
  }

  db.prepare(`
    UPDATE daily_tasks
    SET actual_minutes = ?,
        completion_ratio = ?,
        status = ?
    WHERE id = ?
  `).run(actualMinutes, completionRatio, status, dailyTaskId);
}






export function skipTask(dailyTaskId) {
  db.prepare(`
    UPDATE daily_tasks
    SET status = 'SKIPPED',
        actual_minutes = 0,
        completion_ratio = 0
    WHERE id = ?
  `).run(dailyTaskId);
}
