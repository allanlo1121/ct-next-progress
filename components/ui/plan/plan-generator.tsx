"use client"

import { useState } from "react"
import { getDayCount } from "@/lib/date-definitions/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { buildPlanDays } from "@/lib/plans/utils"

import type { TunnelLine } from "@/lib/tunnels/definition"
import type { Plan } from "@/lib/plans/definition"
import { PlanTable } from "./data-table"

export default function PlanGenerator({
  line,
  title,
}: {
  line: TunnelLine
  title: string
}) {
  const [startDate, setStartDate] = useState(line.scheduled_start_date ?? "")

  const [endDate, setEndDate] = useState(line.scheduled_end_date ?? "")

  const totalRingCount =
    line.start_ring != null && line.end_ring != null
      ? line.end_ring - line.start_ring
      : 0

  const initialDayCount =
    startDate && endDate ? getDayCount(startDate, endDate) : 0

  const [dailyRingCount, setDailyRingCount] = useState(
    initialDayCount > 0
      ? Number((totalRingCount / initialDayCount).toFixed(2))
      : 0
  )

  const [planDays, setPlanDays] = useState<Plan[]>([])

  function handleGenerate() {
    if (
      !startDate ||
      !endDate ||
      line.start_ring == null ||
      line.end_ring == null
    ) {
      return
    }

    const result = buildPlanDays({
      tunnelLineId: line.id,
      startDate,
      endDate,
      startRing: line.start_ring,
      endRing: line.end_ring,
      dailyRingCount,
    })

    setPlanDays(result)
  }

  return (
    <div className="flex-1 flex flex-col rounded-md border border-yellow-200 p-4">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="mb-2 block text-sm text-muted-foreground">
            计划开工
          </label>

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-muted-foreground">
            计划竣工
          </label>

          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-muted-foreground">
            起始环号
          </label>

          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            {line.start_ring ?? "-"}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-muted-foreground">
            结束环号
          </label>

          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            {line.end_ring ?? "-"}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-muted-foreground">
            平均每日环数
          </label>

          <Input
            type="number"
            min={0}
            step="0.1"
            value={dailyRingCount}
            onChange={(e) => setDailyRingCount(Number(e.target.value))}
          />
        </div>

        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={
              !startDate ||
              !endDate ||
              line.start_ring == null ||
              line.end_ring == null ||
              dailyRingCount <= 0
            }
          >
            生成计划
          </Button>
        </div>
      </div>

      <div className="flex-1 mt-6 grid grid-cols-2 gap-4">
        {planDays.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium">计划预览</h3>

              <span className="text-sm text-muted-foreground">
                共 {planDays.length} 天
              </span>
            </div>

            <div className="max-h-80 overflow-auto rounded-md border">
              <PlanTable data={planDays} onChange={setPlanDays} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
