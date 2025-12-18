const fn = (db) => {
  // 1. Task templates (recurring intent)
  db.exec(`
    CREATE TABLE IF NOT EXISTS task_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,

      planned_minutes INTEGER NOT NULL,
      weight REAL NOT NULL,

      days_of_week TEXT NOT NULL,      -- JSON array
      type TEXT NOT NULL,              -- MENTAL | PHYSICAL | SKILL
      difficulty INTEGER NOT NULL,     -- 1–5
      strictness TEXT NOT NULL,        -- LOW | MEDIUM | HIGH

      active INTEGER DEFAULT 1
    );
  `);

  // 2. Daily tasks (actual execution)
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_tasks (
      id TEXT PRIMARY KEY,
      task_template_id TEXT NOT NULL,

      date TEXT NOT NULL,              -- YYYY-MM-DD (IST)
      planned_minutes INTEGER NOT NULL,
      actual_minutes INTEGER DEFAULT 0,

      completion_ratio REAL DEFAULT 0,
      status TEXT NOT NULL,            -- PENDING | DONE | SKIPPED

      created_at TEXT NOT NULL,

      FOREIGN KEY (task_template_id) REFERENCES task_templates(id)
    );
  `);

  // 3. Daily summary (cached score)
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_summary (
      date TEXT PRIMARY KEY,

      total_planned INTEGER NOT NULL,
      total_actual INTEGER NOT NULL,

      score REAL NOT NULL,
      label TEXT NOT NULL,             -- SUCCESS | FAILURE_DAY | COLLAPSE

      penalties TEXT,                  -- JSON
      bonuses TEXT                    -- JSON
    );
  `);

  // 4. Streaks
  db.exec(`
    CREATE TABLE IF NOT EXISTS streaks (
      task_template_id TEXT PRIMARY KEY,

      current_streak INTEGER DEFAULT 0,
      best_streak INTEGER DEFAULT 0,
      last_completed_date TEXT,

      FOREIGN KEY (task_template_id) REFERENCES task_templates(id)
    );
  `);

  // 5. Weekly summary (LLM input)
  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_summary (
      week_start TEXT PRIMARY KEY,     -- Monday date
      avg_score REAL NOT NULL,
      trend TEXT NOT NULL,             -- UP | DOWN | FLAT

      serialized_data TEXT NOT NULL    -- JSON
    );
  `);

  console.log("✅ Database migration completed");
};

export default fn;