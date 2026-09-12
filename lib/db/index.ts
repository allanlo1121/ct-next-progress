import fs from "node:fs"
import path from "node:path"
import Database from "better-sqlite3"

import { runMigrations } from "./migrations"
import { seedSystemData } from "./seed"

const dataDir = path.join(process.cwd(), "data")

const dbPath = process.env.SQLITE_PATH ?? path.join(dataDir, "app.db")

let db: Database.Database | null = null

export function getDb() {
  if (db) return db

  fs.mkdirSync(path.dirname(dbPath), {
    recursive: true,
  })

  db = new Database(dbPath)

  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")

  runMigrations(db)
  seedSystemData(db)

  db.exec("PRAGMA optimize")

  return db
}
