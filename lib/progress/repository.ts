import { TbmPeriodType } from "../date-definition/definition"
import type { DateDefinition } from "../date-definition/schema"
import { CustomPeriod, getTbmPeriodInfo } from "../date-definition/tbm-data"
import { getDb } from "../db"
import { getPlanRingCount } from "../plan/repository"
import { getRingCountByTimeRange } from "../ring-record/repository"
import type { PlanInput, TbmProgress } from "./definition"

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
