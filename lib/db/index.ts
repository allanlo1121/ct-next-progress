import fs from "node:fs"
import path from "node:path"
import Database from "better-sqlite3"

import { runMigrations } from "./migrations"
import { seedSystemData } from "./seed"

const dataDir = path.join(process.cwd(), "data")

const dbPath = process.env.SQLITE_PATH ?? path.join(dataDir, "app.db")

let db: Database.Database | null = null

export function getDb() {
  if (db) {
    return db
  }

  const instance = new Database(dbPath)

  instance.pragma("journal_mode = WAL")
  instance.pragma("foreign_keys = ON")

  // 先完成所有迁移
  runMigrations(instance)

  // 再初始化系统数据
  seedSystemData(instance)

  instance.pragma("optimize")

  // 全部成功以后才暴露
  db = instance

  return db
}
