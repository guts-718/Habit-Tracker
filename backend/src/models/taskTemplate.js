import db from "../db/index.js";
import { randomUUID } from "crypto";

export function createTaskTemplate({
  name,
  planned_minutes,
  weight,
  days_of_week,
  type,
  difficulty,
  strictness
}) {
  const stmt = db.prepare(`
    INSERT INTO task_templates (
      id,
      name,
      planned_minutes,
      weight,
      days_of_week,
      type,
      difficulty,
      strictness,
      active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  return stmt.run(
    randomUUID(),
    name,
    planned_minutes,
    weight,
    JSON.stringify(days_of_week),
    type,
    difficulty,
    strictness
  );
}
