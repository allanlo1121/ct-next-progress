import { PlanInput } from "./definition"
import { getDateRange } from "@/lib/date-definition/utils"
import type { MonthRange } from "@/lib/date-definition/utils"
import { getMonthRanges } from "@/lib/date-definition/utils"

export function buildPlanDays(params: {
  tunnelLineId: number
  startDate: string
  endDate: string
  startRing: number
  endRing: number
  dailyRingCount: number
}): PlanInput[] {
  const { startDate, endDate, startRing, endRing, dailyRingCount } = params

  const dates = getDateRange(startDate, endDate)

  if (dates.length === 0) {
    return []
  }

  const totalRingCount = endRing - startRing

  if (totalRingCount <= 0) {
    return []
  }

  let remaining = totalRingCount

  return dates.map((workDate) => {
    const count = Math.min(Math.round(dailyRingCount), remaining)

    remaining -= count

    return {
      tunnel_line_id: params.tunnelLineId,
      work_date: workDate,
      plan_ring_count: remaining >= 0 ? count : 0,
    }
  })
}

export type MonthlyPlanSummary = MonthRange & {
  ringCount: number
}

export function getMonthlyPlanSummary(
  plans: PlanInput[],
  monthStartOffset: -1 | 0,
  monthStartDay: number
): MonthlyPlanSummary[] {
  if (plans.length === 0) {
    return []
  }

  const dates = plans
    .map((item) => item.work_date)
    .sort()

  const startDate = dates[0]
  const endDate = dates[dates.length - 1]

  const ranges = getMonthRanges(
    startDate,
    endDate,
    monthStartOffset,
    monthStartDay
  )

  return ranges.map((range) => ({
    ...range,

    ringCount: plans.reduce((sum, item) => {
      if (
        item.work_date >= range.startDate &&
        item.work_date <= range.endDate
      ) {
        return sum + item.plan_ring_count
      }

      return sum
    }, 0),
  }))
}
