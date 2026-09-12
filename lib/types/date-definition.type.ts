

export type DateDefinition = {
  id: string
  name: string

  day_start_offset: -1 | 0
  day_start_time: number

  week_start_offset: -1 | 0
  week_start_dow: number | null

  month_start_offset: -1 | 0
  month_start_day: number | null

  year_start_offset: -1 | 0
  year_start_month: number | null
  year_start_day: number | null

  is_active: boolean
  sort_order: number
}
