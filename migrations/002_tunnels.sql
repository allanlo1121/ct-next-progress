
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tunnels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- 项目信息
  project_name TEXT,

  -- 基本信息
  name TEXT NOT NULL,
  full_name TEXT,

  line_mode TEXT NOT NULL DEFAULT 'double'
    CHECK (line_mode IN ('single', 'double')),

  description TEXT, -- 项目描述

  sort_order INTEGER NOT NULL DEFAULT 0

);


CREATE TABLE IF NOT EXISTS tunnel_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- 关联区间
  tunnel_id INTEGER NOT NULL REFERENCES tunnels(id) ON DELETE CASCADE,


  -- 基本信息
  name TEXT NOT NULL,  
  start_ring INTEGER NOT NULL DEFAULT 0,
  end_ring INTEGER,

  --进度信息时间
  actual_start_date TEXT, -- 实际开工日期，格式 YYYY-MM-DD
  actual_end_date TEXT,   -- 实际竣工日期，格式 YYYY-MM-DD

  scheduled_start_date TEXT, -- 计划开工日期，格式 YYYY-MM-DD
  scheduled_end_date TEXT,   -- 计划竣工日期，格式 YYYY-MM-DD

  sort_order INTEGER NOT NULL DEFAULT 0,
  
  UNIQUE (tunnel_id, name)

);
