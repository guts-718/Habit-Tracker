import express from "express";
import db from "../db/index.js";
import { recomputeDailyTask } from "../services/sessionUtils.js";
import { getTodayTimeline } from "../services/sessionTimeline.js";

const router = express.Router();


router.get("/timeline/today", (req, res) => {
  const data = getTodayTimeline();
  res.json(data);
});

router.post("/manual", (req, res) => {
  const { dailyTaskId, minutes } = req.body;

  if (!dailyTaskId || !minutes || minutes <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  db.prepare(`
    INSERT INTO task_sessions
      (daily_task_id, duration_minutes, source)
    VALUES (?, ?, 'MANUAL')
  `).run(dailyTaskId, minutes);

  recomputeDailyTask(dailyTaskId);

  res.json({ status: "ok" });
});


router.post("/start", (req, res) => {
  const { dailyTaskId } = req.body;

  const now = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO task_sessions
      (daily_task_id, start_time, duration_minutes, source)
    VALUES (?, ?, 0, 'STOPWATCH')
  `).run(dailyTaskId, now);

  res.json({ sessionId: result.lastInsertRowid });
});



router.post("/stop", (req, res) => {
  const { sessionId } = req.body;

  const session = db.prepare(`
    SELECT daily_task_id, start_time
    FROM task_sessions
    WHERE id = ?
  `).get(sessionId);

  if (!session) {
    return res.status(402).json({ message: "Session not found" });
  }

  const end = new Date();
  const start = new Date(session.start_time);
  const minutes = Math.max(
    1,
    Math.round((end - start) / 60000)
  );

  db.prepare(`
    UPDATE task_sessions
    SET end_time = ?, duration_minutes = ?
    WHERE id = ?
  `).run(end.toISOString(), minutes, sessionId);

  recomputeDailyTask(session.daily_task_id);

  res.json({ minutes });
});

export default router;
