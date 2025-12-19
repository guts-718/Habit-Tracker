import db from "../db/index.js";
import { getCurrentWeekRange } from "./weekUtils.js";

export function getWeeklySummary() {
  const { start, end } = getCurrentWeekRange();

  const rows = db.prepare(`
    SELECT date, score
    FROM daily_summary
    WHERE date BETWEEN ? AND ?
    ORDER BY date
  `).all(start, end);

  if (rows.length === 0) {
    return {
      avg_score: 0,
      trend: "FLAT",
      days: []
    };
  }

  const avg =
    Math.round(
      rows.reduce((s, r) => s + r.score, 0) / rows.length
    );

  const trend =
    rows.length >= 2
      ? rows[rows.length - 1].score > rows[0].score
        ? "UP"
        : rows[rows.length - 1].score < rows[0].score
        ? "DOWN"
        : "FLAT"
      : "FLAT";

  return {
    avg_score: avg,
    trend,
    days: rows
  };
}
