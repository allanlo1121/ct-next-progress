"use client"

import { DeleteDateDefinition } from "@/components/date-definitions/buttons"
import type { DateDefinition } from "@/lib/date-definition/schema"
import {
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Calendar,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { DateDefinitionDrawer } from "@/components/date-definitions/date-definition-drawer"

type DateDefinitionCardProps = {
  definition: DateDefinition
  onSave: (id: number, formData: FormData) => Promise<{ success: boolean }>
}

export function DateDefinitionCard({
  definition,
  onSave
}: DateDefinitionCardProps) {
  return (
    <Card className="group aspect-square w-full max-w-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">
            <DateDefinitionDrawer
              key={`${definition.id}-${definition.updated_at}`}
              definition={definition}
              onSave={(formData) => onSave(definition.id, formData)}
            ></DateDefinitionDrawer>
          </CardTitle>

          <CardDescription className="mt-1">统计日期周期定义</CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {definition.is_default && <Badge variant="secondary">默认</Badge>}

          <DeleteDateDefinition id={definition.id} />
        </div>
      </CardHeader>

      <CardContent className="grid flex-1 grid-cols-2 gap-3">
        <PeriodItem
          icon={CalendarClock}
          title="日"
          offset={formatOffset(
            definition.day_start_offset,
            "当天",
            "上一自然日"
          )}
          value={`${definition.day_start_time}:00`}
          description="统计日开始时间"
        />

        <PeriodItem
          icon={CalendarDays}
          title="周"
          offset={formatOffset(
            definition.week_start_offset,
            "本周",
            "上一自然周"
          )}
          value={formatWeekday(definition.week_start_dow)}
          description="统计周开始日"
        />

        <PeriodItem
          icon={CalendarRange}
          title="月"
          offset={formatOffset(
            definition.month_start_offset,
            "本月",
            "上一自然月"
          )}
          value={`${definition.month_start_day} 日`}
          description="统计月开始日"
        />

        <PeriodItem
          icon={Calendar}
          title="年"
          offset={formatOffset(
            definition.year_start_offset,
            "本年",
            "上一自然年"
          )}
          value={`${definition.year_start_month} 月 ${definition.year_start_day} 日`}
          description="统计年开始日"
        />
      </CardContent>
    </Card>
  )
}

type PeriodItemProps = {
  icon: React.ElementType
  title: string
  offset: string
  value: string
  description: string
}

function PeriodItem({
  icon: Icon,
  title,
  offset,
  value,
  description,
}: PeriodItemProps) {
  return (
    <div className="flex min-h-0 flex-col rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />

          <span className="text-sm font-medium">{title}</span>
        </div>

        <Badge variant="outline" className="text-[11px] font-normal">
          {offset}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <div className="text-xl font-semibold tracking-tight">{value}</div>

        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

function formatOffset(
  offset: number,
  currentLabel: string,
  previousLabel: string
) {
  return offset === 0 ? currentLabel : previousLabel
}

function formatWeekday(day: number) {
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

  return weekdays[day]
}
