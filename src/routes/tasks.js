import express from "express";
import db from "../db/index.js";

const router = express.Router();

/**
 * GET /api/tasks
 * Returns all active task templates
 */
router.get("/", (req, res) => {
  const tasks = db.prepare(`
    SELECT *
    FROM task_templates
    WHERE active = 1
  `).all();

  // Parse JSON fields
  const parsed = tasks.map(t => ({
    ...t,
    days_of_week: JSON.parse(t.days_of_week)
  }));

  res.json(parsed);
});

export default router;
