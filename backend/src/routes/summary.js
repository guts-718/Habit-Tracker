import express from "express";
import { calculateTodayScore } from "../services/scoring.js";
import { runLLM } from "../services/llm.js";
import { buildBrutalPrompt } from "../prompts/brutalPrompt.js";
import { getWeeklySummary } from "../services/weeklySummary.js";
import { generateWeeklyMarkdown } from "../services/weeklyExport.js";
import { getDailyStreak, getTaskStreaks } from "../services/streaks.js";
import { buildWeeklyBrutalPrompt } from "../prompts/weeklyBrutalPrompt.js";
import { getWeeklyTaskStats } from "../services/taskWeeklyStats.js";




const router = express.Router();



router.get("/weekly/tasks", (req, res) => {
  const data = getWeeklyTaskStats();
  res.json(data);
});


router.get("/weekly", async (req, res) => {
  const weekly = getWeeklySummary();

  const prompt = buildWeeklyBrutalPrompt({ weekly });
  const feedback = await runLLM({ prompt });

  res.json({
    weekly,
    feedback
  });
});

router.post("/today", async (req, res) => {
  const today = calculateTodayScore();
  const weekly = getWeeklySummary();

  const prompt = buildBrutalPrompt({ today, weekly });
  const feedback = await runLLM({ prompt });

  res.json({
    score: today.score,
    label: today.label,
    feedback
  });
});


router.get("/last7", (req, res) => {
  const rows = db.prepare(`
    SELECT date, score
    FROM daily_summary
    ORDER BY date DESC
    LIMIT 7
  `).all();

  res.json(rows.reverse());
});



router.get("/streaks", (req, res) => {
  res.json({
    daily: getDailyStreak(),
    tasks: getTaskStreaks()
  });
});


router.get("/weekly/export/md", async (req, res) => {
  const md = await generateWeeklyMarkdown();

  res.setHeader("Content-Type", "text/markdown");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=weekly-report.md"
  );

  res.send(md);
});

export default router;
