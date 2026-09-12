// import fs from "node:fs"
// import path from "node:path"
// import Database from "better-sqlite3"

// const dataDir = path.join(process.cwd(), "data")

// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir, { recursive: true })
// }

// const dbPath = process.env.SQLITE_PATH ?? path.join(dataDir, "app.db")

// export const db = new Database(dbPath)

// db.pragma("journal_mode = WAL")
// db.pragma("foreign_keys = ON")

// // 执行migrations 语句,插入数据表结构
// function runMigration(fileName: string) {
//   const migrationPath = path.join(
//     process.cwd(),
//     "migrations",
//     fileName
//   )

//   const sql = fs.readFileSync(migrationPath, "utf8")

//   const migrate = db.transaction(() => {
//     db.exec(sql)
//   })

//   migrate()
// }


// function hasColumn(table: string, column: string) {
//   if (!db) return
//   const rows = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{
//     name: string
//   }>
//   return rows.some((row) => row.name === column)
// }

// function addColumnIfMissing(table: string, column: string, definition: string) {
//   if (!db || hasColumn(table, column)) return
//   db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
// }

// function rebuildLegacyDateDefinitions() {
//   if (!db || !hasColumn("date_definitions", "start_rule")) return

//   db.exec(`
//     DROP TABLE IF EXISTS date_definitions_next;

//     CREATE TABLE date_definitions_next (
//       id TEXT PRIMARY KEY,
//       name TEXT NOT NULL,
//       period_type TEXT NOT NULL UNIQUE,
//       day_start_offset INTEGER NOT NULL DEFAULT -1,
//       day_cutoff_time TEXT NOT NULL DEFAULT '19:00:00',
//       week_cutoff_dow INTEGER,
//       month_cutoff_day INTEGER,
//       sort_order INTEGER NOT NULL DEFAULT 0
//     );

//     INSERT INTO date_definitions_next (
//       id, name, period_type, day_start_offset, day_cutoff_time, week_cutoff_dow,
//       month_cutoff_day, sort_order
//     )
//     SELECT
//       id,
//       name,
//       period_type,
//       COALESCE(day_start_offset, -1),
//       COALESCE(day_cutoff_time, '19:00:00'),
//       CASE
//         WHEN period_type = 'week' THEN COALESCE(week_cutoff_dow, 5)
//         ELSE NULL
//       END,
//       CASE
//         WHEN period_type IN ('month', 'quarter') THEN COALESCE(month_cutoff_day, 25)
//         ELSE NULL
//       END,
//       sort_order
//     FROM date_definitions;

//     DROP TABLE date_definitions;
//     ALTER TABLE date_definitions_next RENAME TO date_definitions;
//   `)
// }

// function ensureSchemaCompatibility() {
//   if (!db) return

//   if (!hasColumn("tunnels", "sort_order")) {
//     db.exec(
//       "ALTER TABLE tunnels ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0"
//     )
//   }

//   addColumnIfMissing(
//     "date_definitions",
//     "day_start_offset",
//     "INTEGER NOT NULL DEFAULT -1"
//   )
//   addColumnIfMissing(
//     "date_definitions",
//     "day_cutoff_time",
//     "TEXT NOT NULL DEFAULT '19:00:00'"
//   )
//   addColumnIfMissing("date_definitions", "week_cutoff_dow", "INTEGER")
//   addColumnIfMissing("date_definitions", "month_cutoff_day", "INTEGER")
//   rebuildLegacyDateDefinitions()
// }

// function seedDateDefinitions() {
//   if (!db) return

//   const upsertDateDefinition = db.prepare(`
//     INSERT INTO date_definitions (
//       id, name, period_type, day_start_offset, day_cutoff_time, week_cutoff_dow,
//       month_cutoff_day, sort_order
//     ) VALUES (
//       @id, @name, @period_type, @day_start_offset, @day_cutoff_time, @week_cutoff_dow,
//       @month_cutoff_day, @sort_order
//     )
//     ON CONFLICT(period_type) DO UPDATE SET
//       name = excluded.name,
//       day_start_offset = COALESCE(date_definitions.day_start_offset, excluded.day_start_offset),
//       day_cutoff_time = COALESCE(date_definitions.day_cutoff_time, excluded.day_cutoff_time),
//       week_cutoff_dow = COALESCE(date_definitions.week_cutoff_dow, excluded.week_cutoff_dow),
//       month_cutoff_day = COALESCE(date_definitions.month_cutoff_day, excluded.month_cutoff_day),
//       sort_order = excluded.sort_order
//   `)

//   const definitions = [
//     {
//       id: "company-day",
//       name: "公司统计工作日",
//       day_start_offset: -1,
//       day_cutoff_time: 19,
//       week_cutoff_dow: -5,
//       month_cutoff_day: 25,
//       is_active: 1,
//       sort_order: 1,
//     },
//   ]

//   for (const definition of definitions) {
//     upsertDateDefinition.run(definition)
//   }
// }

// function seedTunnelLines(tunnelId: string) {
//   if (!db) return

//   const insertTunnelLine = db.prepare(`
//     INSERT INTO tunnel_lines (
//       id, tunnel_id, name, prefix, start_chainage, end_chainage, length_adjustment,
//       advance_direction, start_ring, end_ring, actual_start_date, actual_end_date,
//       scheduled_start_date, scheduled_end_date, sort_order
//     ) VALUES (
//       @id, @tunnel_id, @name, @prefix, @start_chainage, @end_chainage, @length_adjustment,
//       @advance_direction, @start_ring, @end_ring, @actual_start_date, @actual_end_date,
//       @scheduled_start_date, @scheduled_end_date, @sort_order
//     )
//   `)

//   const insertPlan = db.prepare(`
//     INSERT INTO tunnel_plan_days (tunnel_line_id, work_date, plan_ring_count)
//     VALUES (@tunnel_line_id, @work_date, @plan_ring_count)
//     ON CONFLICT(tunnel_line_id, work_date)
//     DO UPDATE SET plan_ring_count = excluded.plan_ring_count
//   `)

//   const insertProgress = db.prepare(`
//     INSERT INTO tunnel_daily_progress (tunnel_line_id, work_date, ring_end)
//     VALUES (@tunnel_line_id, @work_date, @ring_end)
//     ON CONFLICT(tunnel_line_id, work_date)
//     DO UPDATE SET ring_end = excluded.ring_end
//   `)

//   const today = localDateOnly()
//   const lines = [
//     {
//       id: `${tunnelId}-left-line`,
//       name: "左线",
//       prefix: "ZDK",
//       start_chainage: null,
//       end_chainage: null,
//       length_adjustment: null,
//       advance_direction: "chainage_increase",
//       start_ring: 0,
//       end_ring: null,
//       actual_start_date: null,
//       actual_end_date: null,
//       scheduled_start_date: null,
//       scheduled_end_date: null,
//       sort_order: 1,
//     },
//     {
//       id: `${tunnelId}-right-line`,
//       name: "右线",
//       prefix: "YDK",
//       start_chainage: null,
//       end_chainage: null,
//       length_adjustment: null,
//       advance_direction: "chainage_increase",
//       start_ring: 0,
//       end_ring: null,
//       actual_start_date: null,
//       actual_end_date: null,
//       scheduled_start_date: null,
//       scheduled_end_date: null,
//       sort_order: 2,
//     },
//   ]

//   for (const line of lines) {
//     insertTunnelLine.run({
//       ...line,
//       tunnel_id: tunnelId,
//     })

//     insertPlan.run({
//       tunnel_line_id: line.id,
//       work_date: today,
//       plan_ring_count: 8,
//     })
//     insertProgress.run({
//       tunnel_line_id: line.id,
//       work_date: today,
//       ring_end: 0,
//     })
//   }
// }

// function seedIfEmpty() {
//   if (!db) return

//   const row = db.prepare("SELECT COUNT(*) AS count FROM tunnels").get() as {
//     count: number
//   }
//   const count = row.count
//   if (count > 0) {
//     const lineRow = db
//       .prepare("SELECT COUNT(*) AS count FROM tunnel_lines")
//       .get() as { count: number }

//     if (lineRow.count === 0) {
//       const firstTunnel = db
//         .prepare(
//           "SELECT id FROM tunnels ORDER BY sort_order ASC, name ASC LIMIT 1"
//         )
//         .get() as { id: string } | undefined
//       if (firstTunnel) seedTunnelLines(firstTunnel.id)
//     }
//     return
//   }

//   const insertTunnel = db.prepare(`
//     INSERT INTO tunnels (
//       id, project_name, name, full_name, line_mode, description, sort_order
//     ) VALUES (
//       @id, @project_name, @name, @full_name, @line_mode, @description, @sort_order
//     )
//   `)

//   const tunnelId = "minmin-section"

//   const transaction = db.transaction(() => {
//     insertTunnel.run({
//       id: tunnelId,
//       project_name: "深圳地铁22号线一期工程5工区",
//       name: "民民区间",
//       full_name: "民治站～民治北站区间",
//       line_mode: "double",
//       description:
//         "首次打开自动初始化，可在区间信息页面继续补充里程、环号和计划时间。",
//       sort_order: 1,
//     })

//     seedTunnelLines(tunnelId)
//   })

//   transaction()
// }

// export function getDb() {
//   if (db) return db

//   fs.mkdirSync(dataDir, { recursive: true })
//   db = new Database(dbPath)
//   db.pragma("journal_mode = WAL")
//   db.pragma("foreign_keys = ON")

//   runMigration("tunnels.sql")
//   runMigration("progress.sql")
//   runMigration("date_definitions.sql")
//   ensureSchemaCompatibility()
//   seedDateDefinitions()
//   seedIfEmpty()
//   db.exec("PRAGMA optimize")

//   return db
// }
