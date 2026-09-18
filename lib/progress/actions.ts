import { getDb } from "@/lib/db"
import type { LineData } from "./definition"
import type { DateDefinition } from "@/lib/date-definitions/definition"

import { getLineProgress } from "./data"

// export async function fetchLineDatas(): Promise<LineData[]> {
//   const db = getDb()

//   const lines = db
//     .prepare(
//       `
//       SELECT
//         tl.id,
//         t.project_name,
//         t.name AS tunnel_name,
//         t.full_name,
//         t.line_mode,
//         tl.tunnel_id,
//         tl.name,
//         tl.start_ring,
//         tl.end_ring,
//         tl.actual_start_date,
//         tl.actual_end_date,
//         tl.scheduled_start_date,
//         tl.scheduled_end_date,
//         tl.sort_order
//       FROM tunnel_lines tl
//       JOIN tunnels t ON t.id = tl.tunnel_id
//       ORDER BY
//         t.sort_order ASC,
//         tl.sort_order ASC
//     `
//     )
//     .all() as LineData["line"][]

//   const now = new Date()

//   const day = getTbmDayInfo(now)
//   const week = getTbmWeekInfo(now)
//   const month = getTbmMonthInfo(now)
//   const quarter = getTbmQuarterInfo(now)
//   const year = getTbmYearInfo(now)

//   return lines.map((line) => {
//     return {
//       line,

//       totalProgress: getLineProgress(line.id, line.actual_start_date, null),

//       dayProgress: getLineProgress(line.id, day.startAt, day.endAt),

//       weekProgress: getLineProgress(line.id, week.startAt, week.endAt),

//       monthProgress: getLineProgress(line.id, month.startAt, month.endAt),

//       quarterProgress: getLineProgress(line.id, quarter.startAt, quarter.endAt),

//       yearProgress: getLineProgress(line.id, year.startAt, year.endAt),
//     }
//   })
// }

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
      startDate: line.actual_start_date,
      endDate: line.scheduled_end_date,
    }),

    dayProgress: getLineProgress(line.id, now, "day", dateDefintion),

    weekProgress: getLineProgress(line.id, now, "week", dateDefintion),

    monthProgress: getLineProgress(line.id, now, "month", dateDefintion),

    quarterProgress: getLineProgress(line.id, now, "quarter", dateDefintion),

    yearProgress: getLineProgress(line.id, now, "year", dateDefintion),
  }
}
