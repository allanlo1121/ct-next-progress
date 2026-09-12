type DayStartOffset = -1 | 0

export function formatDayDefinition(
  dayStartOffset: DayStartOffset,
  dayCutoffTime: number
) {
  if (dayStartOffset === -1) {
    return `上一个自然日 ${dayCutoffTime}:00`
  }

  return `当天 ${dayCutoffTime}:00`
}

export function formatWeekDefinition(
  weekStartOffset: -1 | 0,
  weekStartDow: number
) {
  if (weekStartOffset === -1) {
    return `上一个自然周 星期${weekStartDow}`
  }

  return `本周 星期${weekStartDow}`
}
export function formatMonthDefinition(
  monthStartOffset: -1 | 0,
  monthStartDay: number
) {
  if (monthStartOffset === -1) {
    return `上一个自然月 ${monthStartDay} 日`
  }

  return `本月 ${monthStartDay} 日`
}

export function formatYearDefinition(
  yearStartOffset: -1 | 0,
  yearStartMonth: number,
  yearStartDay: number
) {
  if (yearStartOffset === -1) {
    return `上一个自然年 ${yearStartMonth} 月 ${yearStartDay} 日`
  }

  return `本年 ${yearStartMonth} 月 ${yearStartDay} 日`
}
