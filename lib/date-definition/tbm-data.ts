import {
  addDays,
  addMonths,
  Day,
  differenceInCalendarWeeks,
  format,
  parseISO,
  startOfWeek,
} from "date-fns"
import { toZonedTime } from "date-fns-tz"
import type { DateDefinition } from "./schema"
import type {
  TbmPeriodInfo,
  TbmPeriodType,
} from "./definition"



export function getTbmDayInfo(
  date: Date = new Date(),
  dayStartOffset: number = -1,
  dayCutoffTime: number = 19
): TbmPeriodInfo {
  const localDate = toZonedTime(date, "Asia/Shanghai")

  const workDate =
    localDate.getHours() >= dayCutoffTime
      ? addDays(localDate, -dayStartOffset)
      : localDate

  const dateStr = format(workDate, "yyyy-MM-dd")

  const baseDate = new Date(`${dateStr}T00:00:00+08:00`)

  const startDate = addDays(baseDate, dayStartOffset)
  const endDate = addDays(startDate, 1)

  const hour = String(dayCutoffTime).padStart(2, "0")

  const startAt = new Date(
    `${format(startDate, "yyyy-MM-dd")}T${hour}:00:00+08:00`
  )

  const endAt = new Date(`${format(endDate, "yyyy-MM-dd")}T${hour}:00:00+08:00`)

  return {
    type: "day",
    label: dateStr,
    startDate: dateStr,
    endDate: dateStr,
    startAt,
    endAt,
  }
}

export function getTbmMonthInfo(
  date: Date = new Date(),
  monthStartOffset: number = -1,
  monthStartDay: number = 26,
  dayStartOffset: number = -1,
  dayCutoffTime: number = 19
): TbmPeriodInfo {
  // 当前所属工作日
  const { startDate: workDateStr } = getTbmDayInfo(
    date,
    dayStartOffset,
    dayCutoffTime
  )

  const workDate = parseISO(workDateStr)

  // 计算当前属于哪个统计月
  const beforeStartDay = workDate.getDate() < monthStartDay

  let monthDate = workDate

  if (beforeStartDay) {
    monthDate = addMonths(workDate, monthStartOffset === -1 ? 0 : -1)
  } else {
    monthDate = addMonths(workDate, monthStartOffset === -1 ? 1 : 0)
  }

  const monthDateStr = format(monthDate, "yyyy-MM")

  // 根据统计月反推统计周期的第一天
  const startMonth = addMonths(parseISO(`${monthDateStr}-01`), monthStartOffset)

  const startDate = format(
    new Date(startMonth.getFullYear(), startMonth.getMonth(), monthStartDay),
    "yyyy-MM-dd"
  )

  // 最后一天 = 下一个统计周期起点 - 1 天
  const nextStartDate = addMonths(parseISO(startDate), 1)

  const endDate = format(addDays(nextStartDate, -1), "yyyy-MM-dd")

  // 直接复用日统计范围
  const startDayInfo = getTbmDayInfo(
    new Date(`${startDate}T12:00:00+08:00`),
    dayStartOffset,
    dayCutoffTime
  )

  const endDayInfo = getTbmDayInfo(
    new Date(`${endDate}T12:00:00+08:00`),
    dayStartOffset,
    dayCutoffTime
  )

  return {
    type: "month",
    label: monthDateStr,
    startDate,
    endDate,
    startAt: startDayInfo.startAt,
    endAt: endDayInfo.endAt,
  }
}

export function getTbmWeekInfo(
  date: Date = new Date(),
  weekStartOffset:number = -1,
  weekStartDay: number = 6,
  dayStartOffset: number = -1,
  dayCutoffTime: number = 19
): TbmPeriodInfo {
  // 当前所属 TBM 工作日
  const { startDate: workDateStr } = getTbmDayInfo(
    date,
    dayStartOffset,
    dayCutoffTime
  )

  const workDate = parseISO(workDateStr)

  // 当前统计周起始日
  const startDateValue = startOfWeek(workDate, {
    weekStartsOn: weekStartDay as Day,
  })

  // 当前统计周最后一天
  const endDateValue = addDays(startDateValue, 6)

  const startDate = format(startDateValue, "yyyy-MM-dd")
  const endDate = format(endDateValue, "yyyy-MM-dd")

  // weekStartOffset 只用于确定这个周期归属哪个周
  const weekDateValue = addDays(startDateValue, -weekStartOffset * 7)

  const year = weekDateValue.getFullYear()

  const firstWeekStart = startOfWeek(new Date(year, 0, 1), {
    weekStartsOn: weekStartDay as Day,
  })

  const week =
    differenceInCalendarWeeks(weekDateValue, firstWeekStart, {
      weekStartsOn: weekStartDay as Day,
    }) + 1

  const weekDate = `${year}-W${String(week).padStart(2, "0")}`

  // 转换成实际查询时间范围
  const startDayInfo = getTbmDayInfo(
    new Date(`${startDate}T12:00:00+08:00`),
    dayStartOffset,
    dayCutoffTime
  )

  const endDayInfo = getTbmDayInfo(
    new Date(`${endDate}T12:00:00+08:00`),
    dayStartOffset,
    dayCutoffTime
  )

  return {
    type: "week",
    label: weekDate,
    startDate,
    endDate,
    startAt: startDayInfo.startAt,
    endAt: endDayInfo.endAt,
  }
}

export function getTbmQuarterInfo(
  date: Date = new Date(),
  monthStartOffset: number = -1,
  monthStartDay: number = 26,
  dayStartOffset: number = -1,
  dayCutoffTime: number = 19
): TbmPeriodInfo {
  // 先获取当前所属 TBM 统计月
  const monthInfo = getTbmMonthInfo(
    date,
    monthStartOffset,
    monthStartDay,
    dayStartOffset,
    dayCutoffTime
  )

  // monthInfo.label，例如 "2026-09"
  const monthDate = parseISO(`${monthInfo.label}-01`)

  const year = monthDate.getFullYear()
  const month = monthDate.getMonth() + 1

  // 当前统计月所属季度：1~4
  const quarter = Math.ceil(month / 3)

  // 当前季度第一个统计月
  // Q1 -> 1
  // Q2 -> 4
  // Q3 -> 7
  // Q4 -> 10
  const quarterStartMonth = (quarter - 1) * 3 + 1

  // 用季度第一个统计月获取 TBM 月周期
  const firstMonthInfo = getTbmMonthInfo(
    new Date(
      `${year}-${String(quarterStartMonth).padStart(2, "0")}-15T12:00:00+08:00`
    ),
    monthStartOffset,
    monthStartDay,
    dayStartOffset,
    dayCutoffTime
  )

  // 用季度最后一个统计月获取 TBM 月周期
  const quarterEndMonth = quarterStartMonth + 2

  const lastMonthInfo = getTbmMonthInfo(
    new Date(
      `${year}-${String(quarterEndMonth).padStart(2, "0")}-15T12:00:00+08:00`
    ),
    monthStartOffset,
    monthStartDay,
    dayStartOffset,
    dayCutoffTime
  )

  return {
    type: "quarter",
    label: `${year}-Q${quarter}`,

    startDate: firstMonthInfo.startDate,
    endDate: lastMonthInfo.endDate,

    startAt: firstMonthInfo.startAt,
    endAt: lastMonthInfo.endAt,
  }
}

export function getTbmYearInfo(
  date: Date = new Date(),
  yearStartOffset: number = 0,
  yearStartMonth: number = 1,
  yearStartDay: number = 1,
  dayStartOffset: number = -1,
  dayCutoffTime: number = 19
): TbmPeriodInfo {
  // 当前所属 TBM 工作日
  const { startDate: workDateStr } = getTbmDayInfo(
    date,
    dayStartOffset,
    dayCutoffTime
  )

  const workDate = parseISO(workDateStr)

  const currentYear = workDate.getFullYear()

  // 当前自然年中的统计年分界日期
  const boundaryDate = new Date(currentYear, yearStartMonth - 1, yearStartDay)

  const beforeStartDate = workDate < boundaryDate

  // 当前日期属于哪个统计年
  let year = currentYear

  if (beforeStartDate) {
    year = yearStartOffset === -1 ? currentYear : currentYear - 1
  } else {
    year = yearStartOffset === -1 ? currentYear + 1 : currentYear
  }

  // 根据统计年反推周期开始日期
  const startYear = year + yearStartOffset

  const startDateValue = new Date(startYear, yearStartMonth - 1, yearStartDay)

  // 下一个统计年的起点
  const nextStartDateValue = new Date(
    startYear + 1,
    yearStartMonth - 1,
    yearStartDay
  )

  // 最后一个工作日
  const endDateValue = addDays(nextStartDateValue, -1)

  const startDate = format(startDateValue, "yyyy-MM-dd")
  const endDate = format(endDateValue, "yyyy-MM-dd")

  // 转换成实际数据查询时间
  const startDayInfo = getTbmDayInfo(
    new Date(`${startDate}T12:00:00+08:00`),
    dayStartOffset,
    dayCutoffTime
  )

  const endDayInfo = getTbmDayInfo(
    new Date(`${endDate}T12:00:00+08:00`),
    dayStartOffset,
    dayCutoffTime
  )

  return {
    type: "year",
    label: String(year),
    startDate,
    endDate,
    startAt: startDayInfo.startAt,
    endAt: endDayInfo.endAt,
  }
}


export type TbmPeriodOptions = {
  dayStartOffset?: number
  dayCutoffTime?: number

  weekStartOffset?: -1 | 0
  weekStartDay?: number

  monthStartOffset?: -1 | 0
  monthStartDay?: number

  yearStartOffset?: -1 | 0
  yearStartMonth?: number
  yearStartDay?: number
}

const defaultDefinition: DateDefinition = {
  id: 0,
  name: "default",
  day_start_offset: -1,
  day_start_time: 19,

  week_start_offset: -1,
  week_start_dow: 6,

  month_start_offset: -1,
  month_start_day: 26,

  year_start_offset: 0,
  year_start_month: 1,
  year_start_day: 1,
  is_default: true,
  sort_order: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}
export type CustomPeriod = {
  label: string
  startDate: string
  endDate: string
}

export function getTbmCustomPeriodInfo(
  date: Date,
  customPeriod: CustomPeriod,
  definition: DateDefinition = defaultDefinition
): TbmPeriodInfo {
  const { label, startDate, endDate } = customPeriod

  // 当前所属工作日
  // const { startDate: workDateStr } = getTbmDayInfo(
  //   date,
  //   definition.day_start_offset,
  //   definition.day_start_time
  // )

  // 判断当前工作日是否在自定义周期内
  // if (workDateStr < startDate || workDateStr > endDate) {
  //   throw new Error(
  //     `Date ${workDateStr} is outside custom period ${startDate} ~ ${endDate}`
  //   )
  // }

  // 自定义周期第一天对应的实际时间范围
  const startDayInfo = getTbmDayInfo(
    new Date(`${startDate}T12:00:00+08:00`),
    definition.day_start_offset,
    definition.day_start_time
  )

  // 自定义周期最后一天对应的实际时间范围
  const endDayInfo = getTbmDayInfo(
    new Date(`${endDate}T12:00:00+08:00`),
    definition.day_start_offset,
    definition.day_start_time
  )

  return {
    type: "custom",
    label,
    startDate,
    endDate,
    startAt: startDayInfo.startAt,
    endAt: endDayInfo.endAt,
  }
}

export function getTbmPeriodInfo(
  type: TbmPeriodType,
  date: Date = new Date(),
  definition: DateDefinition = defaultDefinition,
  customPeriod?: CustomPeriod
): TbmPeriodInfo {
  const {
    day_start_offset: dayStartOffset,
    day_start_time: dayCutoffTime = 19,

    week_start_offset: weekStartOffset = -1,
    week_start_dow: weekStartDay = 6,

    month_start_offset: monthStartOffset = -1,
    month_start_day: monthStartDay = 26,

    year_start_offset: yearStartOffset = 0,
    year_start_month: yearStartMonth = 1,
    year_start_day: yearStartDay = 1,
  } = definition

  switch (type) {
    case "day":
      return getTbmDayInfo(date, dayStartOffset, dayCutoffTime)

    case "week":
      return getTbmWeekInfo(
        date,
        weekStartOffset,
        weekStartDay,
        dayStartOffset,
        dayCutoffTime
      )

    case "month":
      return getTbmMonthInfo(
        date,
        monthStartOffset,
        monthStartDay,
        dayStartOffset,
        dayCutoffTime
      )

    case "quarter":
      return getTbmQuarterInfo(
        date,
        monthStartOffset,
        monthStartDay,
        dayStartOffset,
        dayCutoffTime
      )

    case "year":
      return getTbmYearInfo(
        date,
        yearStartOffset,
        yearStartMonth,
        yearStartDay,
        dayStartOffset,
        dayCutoffTime
      )

    case "custom":
      if (!customPeriod) {
        throw new Error("Custom period is required for type 'custom'")
      }
      return getTbmCustomPeriodInfo(date, customPeriod, definition)
  }
}
