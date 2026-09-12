import fs from "node:fs"
import path from "node:path"

import type Database from "better-sqlite3"

export function runMigrations(db: Database.Database) {
  const migrationsDir = path.join(process.cwd(), "migrations")

  // migration 执行记录
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 获取所有 .sql 文件并按文件名排序
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()

  const hasMigration = db.prepare(`
    SELECT 1
    FROM _migrations
    WHERE name = ?
  `)

  const insertMigration = db.prepare(`
    INSERT INTO _migrations (name)
    VALUES (?)
  `)

  const migrate = db.transaction((fileName: string, sql: string) => {
    db.exec(sql)
    insertMigration.run(fileName)
  })

  for (const file of files) {
    // 已经执行过
    if (hasMigration.get(file)) {
      continue
    }

    const migrationPath = path.join(migrationsDir, file)

    const sql = fs.readFileSync(migrationPath, "utf8")

    migrate(file, sql)

    console.log(`[SQLite] migration applied: ${file}`)
  }
}
