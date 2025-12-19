import { getWeeklySummary } from "./weeklySummary.js";
import { getDailyStreak, getTaskStreaks } from "./streaks.js";
import { runLLM } from "./llm.js";
import { buildWeeklyBrutalPrompt } from "../prompts/weeklyBrutalPrompt.js";

export async function generateWeeklyMarkdown() {
  const weekly = getWeeklySummary();
  const dailyStreak = getDailyStreak();
  const taskStreaks = getTaskStreaks();

  const prompt = buildWeeklyBrutalPrompt({ weekly });
  const feedback = await runLLM({ prompt });

  const md = `
# Weekly Discipline Report

## Overview
- Average Score: **${weekly.avg_score}**
- Trend: **${weekly.trend}**
- Daily Streak: **${dailyStreak} days**

## Daily Scores
${weekly.days.map(d => `- ${d.date}: ${d.score}`).join("\n")}

## Task Streaks
${taskStreaks.map(t => `- ${t.name}: ${t.streak}`).join("\n")}

## Weekly Verdict
${feedback}
`;

  return md.trim();
}
