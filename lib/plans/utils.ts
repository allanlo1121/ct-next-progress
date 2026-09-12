import { Plan } from "./definition"
import { getDateRange } from "@/lib/date-definitions/utils"

export function buildPlanDays(params: {
  tunnelLineId: number
  startDate: string
  endDate: string
  startRing: number
  endRing: number
  dailyRingCount: number
}): Plan[] {
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

  return dates.map((workDate, index) => {
    const count = Math.min(Math.round(dailyRingCount), remaining)

    remaining -= count

    return {
      id: -(index + 1),
      tunnel_line_id: params.tunnelLineId,
      work_date: workDate,
      plan_ring_count: remaining >= 0 ? count : 0,
    }
  })
}
