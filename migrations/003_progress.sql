
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tunnel_plan_days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  tunnel_line_id TEXT NOT NULL
    REFERENCES tunnel_lines(id)
    ON DELETE CASCADE,

  work_date TEXT NOT NULL,

  plan_ring_count INTEGER NOT NULL DEFAULT 0,

  UNIQUE (tunnel_line_id, work_date)
);

CREATE TABLE IF NOT EXISTS tunnel_daily_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  tunnel_line_id TEXT NOT NULL
    REFERENCES tunnel_lines(id)
    ON DELETE CASCADE,

  work_date TEXT NOT NULL,

  ring_end INTEGER NOT NULL,
  chainage_end REAL,

  UNIQUE (tunnel_line_id, work_date)
);

CREATE INDEX IF NOT EXISTS idx_tunnel_daily_progress_tunnel_date
ON tunnel_daily_progress(tunnel_line_id, work_date);
