import { getDb } from "../db"
import type { DateDefinition } from "./definition"

export function fetchDateDefinitions(): DateDefinition[] {
  const rows = getDb()
    .prepare(
      `
      SELECT *
      FROM date_definitions
      ORDER BY sort_order ASC, name ASC
    `
    )
    .all() as DateDefinition[]

  return rows.map((row) => ({
    ...row,
    is_default: row.is_default,
  }))
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
    .get({ id }) as DateDefinition | undefined

  return row ?? null
}
