import {  TbmPeriodType } from "../date-definitions/definition"
import type { DateDefinition } from "../date-definitions/schema"
import { CustomPeriod, getTbmPeriodInfo } from "../date-definitions/tbm-data"
import { getDb } from "../db"
import { getPlanRingCount } from "../plans/repository"
import { getRingCountByTimeRange } from "../ring-record/repository"
import type { LineData, PlanInput, TbmProgress } from "./definition"

// export async function fetchDateDefinitions(): Promise<DateDefinition[]> {
//   const rows = getDb()
//     .prepare(
//       `
//       SELECT *
//       FROM date_definitions
//       ORDER BY sort_order ASC, name ASC
//     `
//     )
//     .all() as DateDefinition[]

//   return rows.map((row) => ({
//     ...row,
//     is_default: row.is_default,
//   }))
// }

export async function fetchPlansByTunnelLineId(
  tunnelLineId: number
): Promise<PlanInput[]> {
  return getDb()
    .prepare(
      `
      SELECT
        tunnel_line_id,
        work_date,
        plan_ring_count
      FROM tunnel_plan_days
      WHERE tunnel_line_id = @tunnelLineId
      ORDER BY work_date
    `
    )
    .all({
      tunnelLineId,
    }) as PlanInput[]
}

export const lineData: LineData = {
  line: {
    id: 1,
    project_name: "深圳地铁22号线一期工程5工区",
    tunnel_name: "民民区间",
    full_name: "民治站～民治北站区间",
    line_mode: "double",
    tunnel_id: 1,
    name: "左线",
    start_ring: 0,
    end_ring: 947,
    actual_start_date: "2026-07-18",
    actual_end_date: "",
    scheduled_start_date: "2026-07-18",
    scheduled_end_date: "2027-04-30",
    sort_order: 1,
  },
  dayProgress: {
    period: {
      type: "day",
      label: "2026-09-16",
      startDate: "2026-09-16",
      endDate: "2026-09-16",
      startAt: new Date("2026-09-15T11:00:00.000Z"),
      endAt: new Date("2026-09-16T11:00:00.000Z"),
    },
    plan: 10,
    actual: {
      startRingNo: 184,
      endRingNo: 185,
      ringCount: 1,
    },
  },
  weekProgress: {
    period: {
      type: "week",
      label: "2026-W38",
      startDate: "2026-09-12",
      endDate: "2026-09-18",
      startAt: new Date("2026-09-11T11:00:00.000Z"),
      endAt: new Date("2026-09-18T11:00:00.000Z"),
    },
    plan: 50,
    actual: {
      startRingNo: 180,
      endRingNo: 185,
      ringCount: 5,
    },
  },
  totalProgress: {
    period: {
      type: "custom",
      label: "总计",
      startDate: "2026-07-18",
      endDate: "2027-04-30",
      startAt: new Date("2026-07-17T11:00:00.000Z"),
      endAt: new Date("2027-04-30T11:00:00.000Z"),
    },
    plan: 2400,
    actual: {
      startRingNo: 0,
      endRingNo: 185,
      ringCount: 185,
    },
  },
  monthProgress: {
    period: {
      type: "month",
      label: "2026-09",
      startDate: "2026-09-01",
      endDate: "2026-09-30",
      startAt: new Date("2026-08-31T11:00:00.000Z"),
      endAt: new Date("2026-09-30T11:00:00.000Z"),
    },
    plan: 200,
    actual: {
      startRingNo: 170,
      endRingNo: 185,
      ringCount: 15,
    },
  },
  quarterProgress: {
    period: {
      type: "quarter",
      label: "2026-Q3",
      startDate: "2026-07-01",
      endDate: "2026-09-30",
      startAt: new Date("2026-06-30T11:00:00.000Z"),
      endAt: new Date("2026-09-30T11:00:00.000Z"),
    },
    plan: 600,
    actual: {
      startRingNo: 150,
      endRingNo: 185,
      ringCount: 35,
    },
  },
  yearProgress: {
    period: {
      type: "year",
      label: "2026",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      startAt: new Date("2025-12-31T11:00:00.000Z"),
      endAt: new Date("2026-12-31T11:00:00.000Z"),
    },
    plan: 2400,
    actual: {
      startRingNo: 100,
      endRingNo: 185,
      ringCount: 85,
    },
  },
}

export function getLineProgress(
  tunnelLineId: number,
  date: Date = new Date(),
  type: TbmPeriodType,
  dateDefinition?: DateDefinition,
  customPeriod?: CustomPeriod
): TbmProgress {
  //let datePeriod: TbmPeriodInfo
  const datePeriod = getTbmPeriodInfo(type, date, dateDefinition, customPeriod)

  const plan = getPlanRingCount(
    tunnelLineId,
    datePeriod.startDate,
    datePeriod.endDate
  )

  const actual = getRingCountByTimeRange(
    tunnelLineId,
    datePeriod.startAt,
    datePeriod.endAt
  )

  return {
    period: datePeriod,
    plan,
    actual,
  }
}
