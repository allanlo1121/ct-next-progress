export type Tunnel = {
  id: number
  project_name: string
  name: string
  full_name: string | null
  line_mode: string
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type TunnelForm = Omit<Tunnel, "id">

export type TunnelLine = {
  id: number
  tunnel_id: number
  name: string
  start_ring: number
  end_ring: number
  actual_start_date: string | null
  actual_end_date: string | null
  scheduled_start_date: string | null
  scheduled_end_date: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type TunnelLineForm = Omit<TunnelLine, "id">

export type TunnelWithLines = Tunnel & {
  lines: TunnelLine[]
}
