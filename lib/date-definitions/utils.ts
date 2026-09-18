
import type { DayStartOffset } from "./definition"

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

export interface MonthRange {
  year: number
  month: number
  key: string
  startDate: string
  endDate: string
}

export function getMonthRanges(
  startDate: string,
  endDate: string,
  monthStartOffset: -1 | 0 = 0,
  monthStartDay: number = 1
): MonthRange[] {
  const result: MonthRange[] = []

  const inputStart = new Date(`${startDate}T00:00:00`)
  const inputEnd = new Date(`${endDate}T00:00:00`)

  let year = inputStart.getFullYear()
  let month = inputStart.getMonth() + 1
  const day = inputStart.getDate()

  // 到了统计周期起始日以后，
  // 当前日期属于下一个“统计月”
  if (day >= monthStartDay) {
    month = month - monthStartOffset
  }

  if (month > 12) {
    month -= 12
    year += 1
  } else if (month < 1) {
    month += 12
    year -= 1
  }

  while (true) {
    // 当前统计月的理论开始日期
    let startYear = year
    let startMonth = month + monthStartOffset

    if (startMonth > 12) {
      startMonth -= 12
      startYear += 1
    } else if (startMonth < 1) {
      startMonth += 12
      startYear -= 1
    }

    const rangeStart = new Date(startYear, startMonth - 1, monthStartDay)

    // 下一个统计周期开始
    let nextYear = startYear
    let nextMonth = startMonth + 1

    if (nextMonth > 12) {
      nextMonth = 1
      nextYear += 1
    }

    const nextRangeStart = new Date(nextYear, nextMonth - 1, monthStartDay)

    const rangeEnd = new Date(nextRangeStart)
    rangeEnd.setDate(rangeEnd.getDate() - 1)

    // 整个统计周期已经超过查询结束时间
    if (rangeStart > inputEnd) {
      break
    }

    // 第一个区间不能早于传入 startDate
    const actualStart = rangeStart < inputStart ? inputStart : rangeStart

    // 最后一个区间不能超过传入 endDate
    const actualEnd = rangeEnd > inputEnd ? inputEnd : rangeEnd

    result.push({
      year,
      month,
      key: `${year}-${String(month).padStart(2, "0")}`,
      startDate: formatDate(actualStart),
      endDate: formatDate(actualEnd),
    })

    month += 1

    if (month > 12) {
      month = 1
      year += 1
    }
  }

  return result
}
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function utcToBeijingInput(value: string | null) {
  if (!value) return ""

  const date = new Date(value)

  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(" ", "T")
}

export function beijingInputToUtc(value: string) {
  if (!value) return null

  return new Date(`${value}:00+08:00`).toISOString()
}

export function utcToBeijing(value: string | null) {
  if (!value) return ""

  const date = new Date(value)

  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

type TimeFormat = "HH-MM-SS" | "HH-MM" | "HH"

export function formatTimeS(s: number, format: TimeFormat = "HH-MM-SS") {
  const totalSeconds = Math.floor(s)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = {
    HH: `${hours.toString().padStart(2, "0")}小时`,
    MM: `${minutes.toString().padStart(2, "0")}分钟`,
    SS: `${seconds.toString().padStart(2, "0")}秒`,
  }

  return format
    .split("-")
    .map((key) => parts[key as keyof typeof parts])
    .join(" ")
}



export function getDurationSeconds(
  startAt: string | null,
  endAt: string | null
): number | null {
  if (!startAt || !endAt) {
    return null
  }

  const start = new Date(startAt).getTime()
  const end = new Date(endAt).getTime()

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return null
  }

  return Math.floor((end - start) / 1000)
}


export function getDurationFormat(
  startAt: string | null,
  endAt: string | null,
  format: TimeFormat = "HH-MM-SS"
) {
  const duration = getDurationSeconds(startAt, endAt)
  if (duration === null) return ""
  return formatTimeS(duration, format)
}