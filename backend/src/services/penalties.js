import db from "../db/index.js";
import { getDailyStreak } from "./streaks.js";
import { getCurrentWeekRange } from "./weekUtils.js";

export function evaluatePenalties(todayScore) {
  // 1️⃣ Severity
  let severity = "NONE";
  if (todayScore < 35) severity = "COLLAPSE";
  else if (todayScore < 50) severity = "FAILURE";
  else if (todayScore < 70) severity = "WARNING";

  // 2️⃣ Streak damage
  const streak = getDailyStreak();
  let streakPenalty = "NONE";

  if (streak === 0) streakPenalty = "MAJOR";
  else if (streak < 3) streakPenalty = "MEDIUM";
  else if (streak < 5) streakPenalty = "MINOR";

  // 3️⃣ Failure repetition (last 7 days)
  const { start, end } = getCurrentWeekRange();
  const failures = db.prepare(`
    SELECT COUNT(*) AS count
    FROM daily_summary
    WHERE date BETWEEN ? AND ?
      AND score < 60
  `).get(start, end).count;

  let escalation = "NORMAL";
  if (failures >= 5) escalation = "RUTHLESS";
  else if (failures >= 3) escalation = "HARSH";

  return {
    severity,
    streakPenalty,
    escalation,
    failures
  };
}
