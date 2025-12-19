import express from "express";
import { generateTodayTasks } from "../services/dailyGenerator.js";
import { logTaskMinutes, skipTask } from "../models/dailyTask.js";

const router = express.Router();

/**
 * GET /api/daily/today
 * Generates (if needed) and returns today's tasks
 */
router.get("/today", (req, res) => {
  const tasks = generateTodayTasks();
  res.json(tasks);
});

/**
 * POST /api/daily/:id/log
 * Body: { minutes: number }
 */
router.post("/:id/log", (req, res) => {
  const { minutes } = req.body;

  if (typeof minutes !== "number" || minutes <= 0) {
    return res.status(400).json({ error: "Invalid minutes" });
  }

  try {
    const result = logTaskMinutes({
      dailyTaskId: req.params.id,
      minutes
    });

    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * POST /api/daily/:id/skip
 */
router.post("/:id/skip", (req, res) => {
  try {
    skipTask(req.params.id);
    res.json({ status: "SKIPPED" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.get("/today/stats", (req, res) => {
  const { date } = getTodayIST();

  const rows = db.prepare(`
    SELECT planned_minutes, actual_minutes
    FROM daily_tasks
    WHERE date = ?
  `).all(date);

  const planned = rows.reduce((s, r) => s + r.planned_minutes, 0);
  const actual = rows.reduce((s, r) => s + r.actual_minutes, 0);

  res.json({ planned, actual });
});


export default router;
