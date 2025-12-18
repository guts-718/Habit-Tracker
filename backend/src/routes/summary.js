import express from "express";
import { calculateTodayScore } from "../services/scoring.js";
import { runLLM } from "../services/llm.js";
import { buildBrutalPrompt } from "../prompts/brutalPrompt.js";
import { getWeeklySummary } from "../services/weeklySummary.js";

const router = express.Router();

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

export default router;
