import { getDb } from "@/lib/db"
import type { LineData } from "./definition"
import type { DateDefinition } from "@/lib/date-definition/schema"

import { getLineProgress } from "./repository"



export async function fetchLineDataById(
  id: number,
  dateDefintion?: DateDefinition
): Promise<LineData | null> {
  const db = getDb()

  const line = db
    .prepare(
      `
      SELECT
        tl.id,
        t.project_name,
        t.name AS tunnel_name,
        t.full_name,
        t.line_mode,
        tl.tunnel_id,
        tl.name,
        tl.start_ring,
        tl.end_ring,
        tl.actual_start_date,
        tl.actual_end_date,
        tl.scheduled_start_date,
        tl.scheduled_end_date,
        tl.sort_order
      FROM tunnel_lines tl
      JOIN tunnels t
        ON t.id = tl.tunnel_id
      WHERE tl.id = ?
      LIMIT 1
    `
    )
    .get(id) as LineData["line"] | undefined

  if (!line) {
    return null
  }

  const now = new Date()

  return {
    line,

    totalProgress: getLineProgress(line.id, now, "custom", dateDefintion, {
      label: "total",
      startDate: line.scheduled_start_date,
      endDate: line.scheduled_end_date,
    }),

    dayProgress: getLineProgress(line.id, now, "day", dateDefintion),

    weekProgress: getLineProgress(line.id, now, "week", dateDefintion),

    monthProgress: getLineProgress(line.id, now, "month", dateDefintion),

    quarterProgress: getLineProgress(line.id, now, "quarter", dateDefintion),

    yearProgress: getLineProgress(line.id, now, "year", dateDefintion),
  }
}
