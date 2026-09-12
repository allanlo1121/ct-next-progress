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

export function getDateRange(startDate: string, endDate: string): string[] {
  const result: string[] = []

  const current = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)

  if (
    Number.isNaN(current.getTime()) ||
    Number.isNaN(end.getTime()) ||
    current > end
  ) {
    return result
  }

  while (current <= end) {
    result.push(
      [
        current.getFullYear(),
        String(current.getMonth() + 1).padStart(2, "0"),
        String(current.getDate()).padStart(2, "0"),
      ].join("-")
    )

    current.setDate(current.getDate() + 1)
  }

  return result
}

export function getDayCount(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`)

  const end = new Date(`${endDate}T00:00:00`)

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    return 0
  }

  const diff = end.getTime() - start.getTime()

  return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1
}
