import { getDb } from "./db"
import type { DateDefinition } from "./types"

export function listDateDefinitions() {
  return getDb()
    .prepare(
      `SELECT *
       FROM date_definitions
       ORDER BY sort_order ASC, name ASC`
    )
    .all() as DateDefinition[]
}

function text(value: unknown) {
  if (typeof value !== "string") return null
  const next = value.trim()
  return next || null
}

function requiredText(value: unknown, fallback = "") {
  return text(value) || fallback
}

function intOrZero(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.trunc(number) : 0
}

function intOrNull(value: unknown) {
  if (value === "" || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) ? Math.trunc(number) : null
}

function normalizeCutoffTime(value: unknown) {
  const next = requiredText(value, "19:00:00")
  return next.length === 5 ? `${next}:00` : next
}

export function upsertDateDefinitions(input: DateDefinition[]) {
  const db = getDb()
  const definitions = input.map((definition, index) => {
    const periodType = normalizePeriodType(definition.period_type)

    return {
      id: requiredText(definition.id, periodType),
      name: requiredText(definition.name, "未命名周期"),
      period_type: periodType,
      day_start_offset: intOrZero(definition.day_start_offset),
      day_cutoff_time: normalizeCutoffTime(definition.day_cutoff_time),
      week_cutoff_dow:
        periodType === "week" ? intOrNull(definition.week_cutoff_dow) : null,
      month_cutoff_day:
        periodType === "month" || periodType === "quarter"
          ? intOrNull(definition.month_cutoff_day)
          : null,
      sort_order: intOrZero(definition.sort_order || index + 1),
    } satisfies DateDefinition
  })

  const save = db.transaction(() => {
    const upsert = db.prepare(
      `INSERT INTO date_definitions (
        id, name, period_type, day_start_offset, day_cutoff_time, week_cutoff_dow, month_cutoff_day, sort_order
      ) VALUES (
        @id, @name, @period_type, @day_start_offset, @day_cutoff_time, @week_cutoff_dow, @month_cutoff_day, @sort_order
      )
      ON CONFLICT(period_type) DO UPDATE SET
        id = excluded.id,
        name = excluded.name,
        day_start_offset = excluded.day_start_offset,
        day_cutoff_time = excluded.day_cutoff_time,
        week_cutoff_dow = excluded.week_cutoff_dow,
        month_cutoff_day = excluded.month_cutoff_day,
        sort_order = excluded.sort_order`
    )

    for (const definition of definitions) {
      upsert.run(definition)
    }
  })

  save()

  return listDateDefinitions()
}

const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

function formatTime(value: string) {
  return value.replace(/:00$/, "")
}

function formatDayOffset(offset: number) {
  if (offset === -1) return "前一自然日"
  if (offset === 0) return "当前自然日"
  if (offset === 1) return "后一自然日"
  return offset > 0 ? `后 ${offset} 日` : `前 ${Math.abs(offset)} 日`
}

export function getDateDefinitionRules(definition: DateDefinition) {
  const cutoffTime = formatTime(definition.day_cutoff_time)

  if (definition.period_type === "work_day") {
    const startDay = formatDayOffset(definition.day_start_offset)
    const endDay = formatDayOffset(definition.day_start_offset + 1)

    return {
      start: `${startDay} ${cutoffTime}`,
      end: `${endDay} ${cutoffTime} 前`,
      basis: `每日 ${cutoffTime} 切换`,
      summary: `${startDay} ${cutoffTime} 到${endDay} ${cutoffTime} 前计入当天工作日。`,
    }
  }

  if (definition.period_type === "week") {
    const cutoffDow = definition.week_cutoff_dow ?? 5
    const weekday = weekdays[cutoffDow] || "周五"

    return {
      start: `上${weekday} ${cutoffTime}`,
      end: `本${weekday} ${cutoffTime} 前`,
      basis: `${weekday} ${cutoffTime} 切换`,
      summary: `周统计按上${weekday} ${cutoffTime} 到本${weekday} ${cutoffTime} 前归集为本周。`,
    }
  }

  const cutoffDay = definition.month_cutoff_day ?? 25

  if (definition.period_type === "month") {
    return {
      start: `上月 ${cutoffDay} 日 ${cutoffTime}`,
      end: `本月 ${cutoffDay} 日 ${cutoffTime} 前`,
      basis: `每月 ${cutoffDay} 日 ${cutoffTime} 切换`,
      summary: `月统计按上月 ${cutoffDay} 日 ${cutoffTime} 到本月 ${cutoffDay} 日 ${cutoffTime} 前归集为本月。`,
    }
  }

  return {
    start: `上季度末月 ${cutoffDay} 日 ${cutoffTime}`,
    end: `本季度末月 ${cutoffDay} 日 ${cutoffTime} 前`,
    basis: `季度末月 ${cutoffDay} 日 ${cutoffTime} 切换`,
    summary: `季度统计按上季度末月 ${cutoffDay} 日 ${cutoffTime} 到本季度末月 ${cutoffDay} 日 ${cutoffTime} 前归集。`,
  }
}
