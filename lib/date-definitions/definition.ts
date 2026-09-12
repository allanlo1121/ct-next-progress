export type DateDefinition = {
  id: number
  name: string

  day_start_offset: -1 | 0
  day_start_time: number

  week_start_offset: -1 | 0
  week_start_dow: number

  month_start_offset: -1 | 0
  month_start_day: number

  year_start_offset: -1 | 0
  year_start_month: number
  year_start_day: number

  is_default: boolean
  sort_order: number
}

export type DateDefinitionForm = DateDefinition
