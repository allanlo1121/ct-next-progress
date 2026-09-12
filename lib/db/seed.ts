// lib/db/seed.ts

import type Database from "better-sqlite3"

import type { DateDefinition } from "@/lib/date-definitions/definition"
import { TunnelForm, TunnelLineForm } from "../tunnels/definition"

/**
 * 初始化系统默认数据。
 *
 * 注意：
 * 1. 这里只插入“系统运行需要的默认数据”
 * 2. 不负责数据库结构迁移
 * 3. 不建议在这里插入每日计划、每日进度等业务数据
 */
export function seedSystemData(db: Database.Database) {
  console.log("Seeding system data...")
  const transaction = db.transaction(() => {
    seedDateDefinitions(db)
    seedDefaultTunnel(db)
  })

  transaction()
}

/**
 * 初始化统计日期定义。
 */
function seedDateDefinitions(db: Database.Database) {
  console.log("Seeding date definitions...")

  const statement = db.prepare(`
    INSERT INTO date_definitions (  
      name,

      day_start_offset,
      day_start_time,

      week_start_offset,
      week_start_dow,

      month_start_offset,
      month_start_day,

      year_start_offset,
      year_start_month,
      year_start_day,

      is_default,
      sort_order
    )
    VALUES (     
      @name,

      @day_start_offset,
      @day_start_time,

      @week_start_offset,
      @week_start_dow,

      @month_start_offset,
      @month_start_day,

      @year_start_offset,
      @year_start_month,
      @year_start_day,

      @is_default,
      @sort_order
    )
    ON CONFLICT(name) DO NOTHING
  `)

  const definitions: Omit<DateDefinition, "id">[] = [
    {
      name: "公司统计日期",

      // 日：上一自然日 19:00 开始
      day_start_offset: -1,
      day_start_time: 19,

      // 周：上周五开始
      week_start_offset: -1,
      week_start_dow: 6,

      // 月：上月 25 日开始
      month_start_offset: -1,
      month_start_day: 26,

      // 年：本年 1 月 1 日开始
      year_start_offset: 0,
      year_start_month: 1,
      year_start_day: 1,

      is_default: true,
      sort_order: 1,
    },
  ]

  for (const definition of definitions) {
    statement.run({
      ...definition,
      is_default: definition.is_default ? 1 : 0,
    })
  }
}

/**
 * 初始化默认区间。
 *
 * 只有 tunnels 表为空时才创建。
 */
function seedDefaultTunnel(db: Database.Database) {
  console.log("Seeding default tunnel...")
  const existingTunnel = db
    .prepare(
      `
      SELECT id
      FROM tunnels
      LIMIT 1
    `
    )
    .get() as { id: string } | undefined

  if (existingTunnel) {
    return
  }

  const tunnel: TunnelForm = {
    project_name: "XXX项目部",
    name: "XX区间",
    full_name: "XX站～XX站区间",
    line_mode: "double",
    description:
      "首次打开自动初始化，需在区间信息页面继续补充里程、环号和计划时间。",
    sort_order: 1,
  }

  const insertTunnel = db.prepare(`
    INSERT INTO tunnels (
      project_name,
      name,
      full_name,
      line_mode,
      description,
      sort_order
    )
    VALUES (
      @project_name,
      @name,
      @full_name,
      @line_mode,
      @description,
      @sort_order
    )
  `)

  const result = insertTunnel.run(tunnel)

  const id = Number(result.lastInsertRowid)

  seedTunnelLines(db, id)
}

/**
 * 初始化区间左右线。
 */
function seedTunnelLines(db: Database.Database, tunnelId: number) {
  const statement = db.prepare(`
    INSERT INTO tunnel_lines (
      tunnel_id,
      name,
      start_ring,
      end_ring,
      actual_start_date,
      actual_end_date,
      scheduled_start_date,
      scheduled_end_date,
      sort_order
    )
    VALUES ( 
      @tunnel_id,
      @name,
      @start_ring,
      @end_ring,
      @actual_start_date,
      @actual_end_date,
      @scheduled_start_date,
      @scheduled_end_date,
      @sort_order
    )
    ON CONFLICT(tunnel_id, name)
    DO NOTHING
  `)

  const lines: TunnelLineForm[] = [
    {
      tunnel_id: tunnelId,
      name: "左线",

      start_ring: 0,
      end_ring: 100,

      actual_start_date: null,
      actual_end_date: null,

      scheduled_start_date: null,
      scheduled_end_date: null,

      sort_order: 1,
    },

    {
      tunnel_id: tunnelId,

      name: "右线",
      start_ring: 0,
      end_ring: 100,

      actual_start_date: null,
      actual_end_date: null,

      scheduled_start_date: null,
      scheduled_end_date: null,

      sort_order: 2,
    },
  ]

  for (const line of lines) {
    statement.run(line)
  }
}
