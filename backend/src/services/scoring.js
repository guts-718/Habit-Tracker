import db from "../db/index.js";
import { getTodayIST } from "../config/timezone.js";

export function calculateTodayScore() {
  const { date } = getTodayIST();

  const rows = db.prepare(`
    SELECT
      d.id,
      d.planned_minutes,
      d.actual_minutes,
      d.completion_ratio,
      d.status,
      t.weight,
      t.difficulty,
      t.strictness,
      t.name
    FROM daily_tasks d
    JOIN task_templates t
      ON d.task_template_id = t.id
    WHERE d.date = ?
  `).all(date);

  if (rows.length === 0) {
    throw new Error("No daily tasks found");
  }

  const totalWeight = rows.reduce((s, r) => s + r.weight, 0);

  let rawScore = 0;
  const negatives = [];
  const positives = [];

  for (const r of rows) {
    const normWeight = r.weight / totalWeight;

    const perf = performanceMultiplier(r.completion_ratio);
    const diffMod = difficultyModifier(r.difficulty);
    const strictMod = strictnessPenalty(r.strictness, r.completion_ratio);

    const taskScore = normWeight * perf * diffMod * strictMod;
    rawScore += taskScore;

    // Collect signals for LLM later
    if (r.completion_ratio >= 1) positives.push(r.name);
    if (r.completion_ratio < 0.5) negatives.push(r.name);
  }

  // Normalize to 0–100
  let finalScore = Math.round(rawScore * 100);

  let label = "SUCCESS";
  if (finalScore < 60) label = "FAILURE_DAY";
  if (finalScore < 40) label = "COLLAPSE";

  // Persist summary
  db.prepare(`
    INSERT OR REPLACE INTO daily_summary (
      date,
      total_planned,
      total_actual,
      score,
      label,
      penalties,
      bonuses
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    date,
    rows.reduce((s, r) => s + r.planned_minutes, 0),
    rows.reduce((s, r) => s + r.actual_minutes, 0),
    finalScore,
    label,
    JSON.stringify(negatives),
    JSON.stringify(positives)
  );

  return {
    date,
    score: finalScore,
    label,
    positives,
    negatives
  };
}





function performanceMultiplier(ratio) {
  if (ratio === 0) return 0.0;
  if (ratio < 0.4) return 0.25;
  if (ratio < 0.6) return 0.5;
  if (ratio < 0.8) return 0.75;
  if (ratio < 1.0) return 1.0;
  if (ratio < 1.2) return 1.15;
  if (ratio < 1.5) return 1.30;
  if (ratio < 1.8) return 1.5;
  if (ratio < 2.0) return 1.8;
  return 2.5;
}



function normalizeWeights(tasks) {
  const total = tasks.reduce((s, t) => s + t.weight, 0);
  return tasks.map(t => ({
    ...t,
    normWeight: t.weight / total
  }));
}



function difficultyModifier(difficulty) {
  return 1 + (difficulty - 3) * 0.05; // difficulty: 1–5
}

function strictnessPenalty(strictness, ratio) {
  if (ratio >= 1) return 1;
  if (strictness === "HIGH") return 0.88;
  if (strictness === "MEDIUM") return 0.95;
  return 1;
}

