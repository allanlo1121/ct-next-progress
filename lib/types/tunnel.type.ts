export type LineMode = "single" | "double"

export type AdvanceDirection = "chainage_increase" | "chainage_decrease"

export type Tunnel = {
  id: string
  project_name: string | null
  name: string
  full_name: string | null
  line_mode: LineMode
  description: string | null
  sort_order: number
}

export type TunnelLine = {
  id: string
  tunnel_id: string
  name: string
  prefix: string | null
  start_chainage: number | null
  end_chainage: number | null
  length_adjustment: number | null
  advance_direction: AdvanceDirection
  start_ring: number
  end_ring: number | null
  actual_start_date: string | null
  actual_end_date: string | null
  scheduled_start_date: string | null
  scheduled_end_date: string | null
  sort_order: number
}

export type TunnelWithLines = Tunnel & {
  lines: TunnelLine[]
}
