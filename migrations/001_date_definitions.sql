PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS date_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,

  day_start_offset INTEGER NOT NULL DEFAULT -1
    CHECK (day_start_offset IN (-1, 0)),
  day_start_time INTEGER NOT NULL DEFAULT 19
    CHECK (day_start_time BETWEEN 0 AND 23),

  week_start_offset INTEGER NOT NULL DEFAULT -1
    CHECK (week_start_offset IN (-1, 0)),
  week_start_dow INTEGER NOT NULL DEFAULT 5
    CHECK (week_start_dow BETWEEN 1 AND 7),

  month_start_offset INTEGER NOT NULL DEFAULT -1
    CHECK (month_start_offset IN (-1, 0)),
  month_start_day INTEGER NOT NULL DEFAULT 25
    CHECK (month_start_day BETWEEN 1 AND 31),

  year_start_offset INTEGER NOT NULL DEFAULT -1
    CHECK (year_start_offset IN (-1, 0)),
  year_start_month INTEGER NOT NULL DEFAULT 12
    CHECK (year_start_month BETWEEN 1 AND 12),
  year_start_day INTEGER NOT NULL DEFAULT 26
    CHECK (year_start_day BETWEEN 1 AND 31),

  is_default BOOLEAN NOT NULL DEFAULT 1
    CHECK (is_default IN (0, 1)),

  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);