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
