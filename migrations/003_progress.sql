
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tunnel_plan_days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  tunnel_line_id TEXT NOT NULL
    REFERENCES tunnel_lines(id)
    ON DELETE CASCADE,

  work_date TEXT NOT NULL,

  plan_ring_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (tunnel_line_id, work_date)
);

-- CREATE TABLE IF NOT EXISTS tunnel_daily_progress (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,

--   tunnel_line_id INTEGER NOT NULL
--     REFERENCES tunnel_lines(id)
--     ON DELETE CASCADE,

--   work_date TEXT NOT NULL,

--   ring_end INTEGER NOT NULL,
--   chainage_end REAL,

--   UNIQUE (tunnel_line_id, work_date)
-- );

-- CREATE INDEX IF NOT EXISTS idx_tunnel_daily_progress_tunnel_date
-- ON tunnel_daily_progress(tunnel_line_id, work_date);



CREATE TABLE IF NOT EXISTS tunnel_ring_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  tunnel_line_id INTEGER NOT NULL
    REFERENCES tunnel_lines(id)
    ON DELETE CASCADE,

  ring_no INTEGER NOT NULL,

  start_at TEXT,
  end_at TEXT,

  jue_duration INTEGER,
  pin_duration INTEGER,
  stop_duration INTEGER,

  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'in_progress', 'completed')),

  source TEXT NOT NULL DEFAULT 'auto'
    CHECK (source IN ('auto', 'manual')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (tunnel_line_id, ring_no)
);

CREATE TABLE IF NOT EXISTS tunnel_ring_phase_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  tunnel_line_id INTEGER NOT NULL
    REFERENCES tunnel_lines(id)
    ON DELETE CASCADE,

  ring_no INTEGER NOT NULL,

  tbm_phase TEXT NOT NULL
    CHECK (tbm_phase IN ('jue', 'pin', 'stop')),

  start_at TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'auto'
    CHECK (source IN ('auto', 'manual'))
);