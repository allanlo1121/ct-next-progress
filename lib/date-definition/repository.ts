import { getDb } from "../db"
import type { DateDefinition, UpdateDateDefinitionForm } from "./schema"
import { CreateDateDefinitionForm } from "./schema"

type DateDefinitionRow = Omit<DateDefinition, "is_default"> & {
  is_default: number
}

function toDateDefinition(row: DateDefinitionRow): DateDefinition {
  return {
    ...row,
    is_default: row.is_default === 1,
  }
}

export function fetchDateDefinitions(): DateDefinition[] {
  const rows = getDb()
    .prepare(
      `
      SELECT *
      FROM date_definitions
      ORDER BY sort_order ASC, name ASC
    `
    )
    .all() as DateDefinitionRow[]

  return rows.map((row) => toDateDefinition(row))
}

export async function fetchDateDefinitionById(
  id: number
): Promise<DateDefinition | null> {
  const row = getDb()
    .prepare(
      `
      SELECT *
      FROM date_definitions
      WHERE id = @id
      LIMIT 1
    `
    )
    .get({ id }) as DateDefinitionRow | undefined

  return row ? toDateDefinition(row) : null
}

export function insertDateDefinition(
  data: CreateDateDefinitionForm
): DateDefinition {
  // console.log("Inserting Date Definition:", data)
  try {
    const db = getDb()
    const now = new Date().toISOString()

    const result = db
      .prepare(
        `
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
          sort_order,
          created_at,
          updated_at
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
          @sort_order,
          @created_at,
          @updated_at
        )
      `
      )
      .run({
        ...data,
        is_default: data.is_default ? 1 : 0,
        created_at: now,
        updated_at: now,
      })

    return {
      ...data,
      created_at: now,
      updated_at: now,
      id: Number(result.lastInsertRowid),
    }
  } catch (error) {
    console.error("Failed to create date definition:", error)

    throw new Error("Database Error: Failed to Create Date-Definition.")
  }
}

export function updateDateDefinition(
  id: number,
  data: UpdateDateDefinitionForm
): void {
  try {
    const now = new Date().toISOString()
    const result = getDb()
      .prepare(
        `
        UPDATE date_definitions
        SET
          name = @name,
          day_start_offset = @day_start_offset,
          day_start_time = @day_start_time,
          week_start_offset = @week_start_offset,
          week_start_dow = @week_start_dow,
          month_start_offset = @month_start_offset,
          month_start_day = @month_start_day,
          year_start_offset = @year_start_offset,
          year_start_month = @year_start_month,
          year_start_day = @year_start_day,
          is_default = @is_default,
          sort_order = @sort_order,
          updated_at = @updated_at
        WHERE id = @id
      `
      )
      .run({
        id,
        ...data,
        is_default: data.is_default ? 1 : 0,
        updated_at: now,
      })

    if (result.changes === 0) {
      throw new Error(`Date definition ${id} not found`)
    }
  } catch (error) {
    console.error("Failed to update date definition:", error)
    throw error
  }
}

export function deleteDateDefinition(id: number): void {
  const db = getDb()

  const result = db
    .prepare(
      `
      DELETE FROM date_definitions
      WHERE id = @id
        AND is_default = 0
    `
    )
    .run({ id })

  if (result.changes === 0) {
    throw new Error("默认统计日期不能删除，或记录不存在")
  }
}
