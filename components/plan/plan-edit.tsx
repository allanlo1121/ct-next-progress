"use client"

import React, { useState } from "react"
import { saveNullRingRecord } from "@/lib/ring-record/actions"
import { getDayCount } from "@/lib/date-definitions/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { buildPlanDays } from "@/lib/plans/utils"

import type { TunnelLine } from "@/lib/tunnels/definition"

import type { PlanInput } from "@/lib/plans/definition"
import { PlanTable } from "./plan-table"
import { savePlans } from "@/lib/plans/actions"
import { toast } from "@/components/ui/toast"
import Papa from "papaparse"
import { ButtonGroup } from "../ui/button-group"

export default function PlanEditor({
  line,
  initialPlans,
}: {
  line: TunnelLine
  initialPlans: PlanInput[]
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

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [planDays, setPlanDays] = useState<PlanInput[]>(initialPlans)

  // function handleGenerate() {
  //   if (
  //     !startDate ||
  //     !endDate ||
  //     line.start_ring == null ||
  //     line.end_ring == null
  //   ) {
  //     return
  //   }

  //   const result = buildPlanDays({
  //     tunnelLineId: line.id,
  //     startDate,
  //     endDate,
  //     startRing: line.start_ring,
  //     endRing: line.end_ring,
  //     dailyRingCount,
  //   })

  //   // setPlanDays(result)
  // }
  function handleImportCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    // console.log("Importing CSV file:", file)

    Papa.parse<{
      work_date: string
      plan_ring_count: string
    }>(file, {
      header: true,
      skipEmptyLines: true,

      complete(result) {
        // console.log("CSV parse result:", result)
        const plans: PlanInput[] = result.data
          .filter((row) => row.work_date && row.plan_ring_count !== "")
          .map((row) => ({
            tunnel_line_id: line.id,
            work_date: row.work_date.trim(),
            plan_ring_count: Number(row.plan_ring_count),
          }))

        // console.log("Sorted plans:", plans)

        if (plans.length === 0) {
          toast.add({
            title: "导入失败",
            description: "CSV 中没有有效的计划数据",
            type: "error",
          })
          return
        }

        const invalid = plans.some(
          (item) =>
            !/^\d{4}-\d{2}-\d{2}$/.test(item.work_date) ||
            !Number.isFinite(item.plan_ring_count) ||
            item.plan_ring_count < 0
        )

        if (invalid) {
          // console.log("Invalid plans detected:", plans)
          toast.add({
            title: "导入失败",
            description: "CSV 格式错误，请检查日期和计划环数",
            type: "error",
          })
          return
        }

        plans.sort((a, b) => a.work_date.localeCompare(b.work_date))

        console.log("Plans before setting state:", plans)

        setPlanDays(plans)

        toast.add({
          title: "计划导入成功",
          description: `共导入 ${plans.length} 天计划，请确认后点击“保存计划”`,
          type: "success",
        })
      },

      error() {
        toast.add({
          title: "导入失败",
          description: "CSV 文件读取失败",
          type: "error",
        })
      },
    })

    // 允许再次选择同一个文件
    event.target.value = ""
  }

  async function handleSave() {
    const result = await savePlans(planDays)
    // await saveNullRingRecord(line.id, line.start_ring ?? 0, line.end_ring ?? 0)

    if (!result.success) {
      toast.add({
        title: "保存失败",
        description: "计划保存失败，请重试",
        type: "error",
      })
      return
    }

    toast.add({
      title: "保存成功",
      description: "计划已成功保存",
      type: "success",
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-md p-4">
      <h2 className="mb-4 text-lg font-semibold">
        {" "}
        {line.name || "左线"}-{line?.end_ring - line?.start_ring}环
      </h2>

      <div className="grid w-full grid-cols-2 gap-4 border-4 border-brand-800 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <dt className="text-sm text-muted-foreground">计划起止日期</dt>
          <dd className="text-sm font-medium">
            {line?.scheduled_start_date || ""} -{" "}
            {line?.scheduled_end_date || ""}
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="text-sm text-muted-foreground">实际起止日期</dt>
          <dd className="text-sm font-medium">
            {line?.actual_start_date || ""} - {line?.actual_end_date || ""}
          </dd>
        </div>

        <div className="flex items-center gap-1">
          <label className="block w-32 text-sm text-muted-foreground">
            平均日环数
          </label>

          <Input
            type="number"
            min={0}
            step="0.1"
            value={dailyRingCount}
            onChange={(e) => setDailyRingCount(Number(e.target.value))}
          />
        </div>

        <ButtonGroup className="flex items-end">
          {/* <Button
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
          </Button> */}

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            导入 CSV
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleImportCsv}
          />

          <Button
            type="button"
            onClick={handleSave}
            disabled={
              !startDate ||
              !endDate ||
              line.start_ring == null ||
              line.end_ring == null ||
              dailyRingCount <= 0
            }
          >
            保存计划
          </Button>
        </ButtonGroup>
      </div>

      <div className="h-full min-h-0 flex-1 rounded-md border">
        <PlanTable plans={planDays} />
      </div>
    </div>
  )
}
