import { TbmPeriodInfo } from "../date-definitions/definition"
import { RingCount } from "../ring-record/definition"

export type Plan = {
  id: number
  tunnel_line_id: number

  work_date: string
  plan_ring_count: number
}

export type PlanForm = Plan

export type PlanDayDraft = {
  work_date: string
  plan_ring_count: number
}

export type PlanInput = {
  tunnel_line_id: number
  work_date: string
  plan_ring_count: number
}

export type TbmProgress = {
  period: TbmPeriodInfo
  plan: number
  actual: RingCount
}

export type LineData = {
  line: {
    id: number
    project_name: string
    tunnel_name: string
    full_name: string
    line_mode: string
    tunnel_id: number
    name: string
    start_ring: number
    end_ring: number
    actual_start_date: string
    actual_end_date: string
    scheduled_start_date: string
    scheduled_end_date: string
    sort_order: number
  }
  totalProgress: TbmProgress
  dayProgress: TbmProgress
  weekProgress: TbmProgress
  monthProgress: TbmProgress

  quarterProgress: TbmProgress

  yearProgress: TbmProgress
}
