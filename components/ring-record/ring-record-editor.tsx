"use client"

import { useState } from "react"
import React, { useRef } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { TunnelLine } from "@/lib/tunnels/definition"

import type { RingRecord, RingRecordCsvRow } from "@/lib/ring-record/definition"

import Papa from "papaparse"
import { RingRecordTable } from "./table"
import { toast } from "../ui/toast"
import { ButtonGroup } from "../ui/button-group"
import {
  saveNullRingRecord,
  updateRingRecordsAction,
} from "@/lib/ring-record/actions"
import { useRouter } from "next/dist/client/components/navigation"

export default function RingRecordEditor({
  line,
  initialRingRecords,
}: {
  line: TunnelLine
  initialRingRecords: RingRecord[]
}) {
  const router = useRouter()

  const [ringRecords, setRingRecords] =
    useState<RingRecord[]>(initialRingRecords)

  const [pending, setPending] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  async function initRingRecord() {
    await saveNullRingRecord(line.id, line.start_ring ?? 0, line.end_ring ?? 0)
  }

  async function handleSave() {
    const initialMap = new Map(
      initialRingRecords.map((ring) => [ring.id, ring])
    )

    const changedRecords = ringRecords
      .filter((ring) => {
        const initial = initialMap.get(ring.id)

        return initial?.start_at !== ring.start_at
      })
      .map((ring) => ({
        id: ring.id,
        start_at: ring.start_at,
      }))

    if (changedRecords.length === 0) {
      toast.add({
        title: "没有需要保存的修改",
      })
      return
    }

    // console.log("Changed records:", changedRecords)

    try {
      setPending(true)

      const result = await updateRingRecordsAction(changedRecords)

      if (!result.success) {
        toast.add({
          title: "保存失败",
          type: "error",
        })
        return
      }

      toast.add({
        title: `保存成功，共更新 ${changedRecords.length} 环`,
        type: "success",
      })

      router.refresh()
    } finally {
      setPending(false)
    }
  }

  function handleImportCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    // console.log("Importing CSV file:", file)

    Papa.parse<{
      ring_no: string
      start_at: string
    }>(file, {
      header: true,
      skipEmptyLines: true,

      complete(result) {
        // console.log("CSV parse result:", result)
        const insertRingRecords: RingRecordCsvRow[] = result.data
          .filter((row) => row.ring_no && row.start_at !== "")
          .map((row) => ({
            tunnel_line_id: line.id,
            ring_no: Number(row.ring_no),
            start_at: row.start_at.trim(),
          }))

        // console.log("Sorted records:", insertRingRecords)

        if (insertRingRecords.length === 0) {
          toast.add({
            title: "导入失败",
            description: "CSV 中没有有效的计划数据",
            type: "error",
          })
          return
        }

        const invalid = insertRingRecords.some(
          (item) =>
            !/^\d+$/.test(String(item.ring_no)) ||
            !Number.isFinite(item.ring_no) ||
            item.ring_no < 0
        )

        if (invalid) {
          // console.log("Invalid records detected:", insertRingRecords)
          toast.add({
            title: "导入失败",
            description: "CSV 格式错误，请检查日期和计划环数",
            type: "error",
          })
          return
        }

        const ringMap = new Map<number, RingRecord>()

        initialRingRecords.forEach((ring) => {
          ringMap.set(ring.ring_no, ring)
        })

        insertRingRecords.forEach((row) => {
          const existing = ringMap.get(row.ring_no)

          if (existing) {
            // 已有环：只用 CSV 更新对应字段
            ringMap.set(row.ring_no, {
              ...existing,
              start_at: row.start_at,
            })
          } else {
            // 新环：补成完整 RingRecord
            ringMap.set(row.ring_no, csvRowToRingRecord(row, line.id))
          }
        })

        const mergedRingRecords: RingRecord[] = Array.from(
          ringMap.values()
        ).sort((a, b) => a.ring_no - b.ring_no)

        // console.log("Plans before setting state:", mergedRingRecords)

        setRingRecords(mergedRingRecords)

        toast.add({
          title: "计划导入成功",
          description: `共导入 ${mergedRingRecords.length} 天计划，请确认后点击“保存计划”`,
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

  return (
    <div className="flex h-full min-h-0 flex-col rounded-md p-4">
      <h2 className="mb-4 text-lg font-semibold">
        {line.name || "左线"}-{line?.end_ring - line?.start_ring}环
      </h2>

      <div className="grid w-full grid-cols-2 gap-4 rounded-lg border-4 border-brand-800 p-4">
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

        <ButtonGroup className="col-span-1 col-end-3 flex items-end place-self-end ">
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

          <Button type="button" onClick={handleSave}>
            保存进度
          </Button>
          <Button type="button" variant="destructive" onClick={initRingRecord}>
            初始化进度
          </Button>
        </ButtonGroup>
      </div>

      <div className="h-full min-h-0 flex-1 rounded-md border">
        <RingRecordTable rings={ringRecords} />
      </div>
    </div>
  )
}

function csvRowToRingRecord(
  row: RingRecordCsvRow,
  tunnelLineId: number
): RingRecord {
  return {
    id: 0,
    tunnel_line_id: tunnelLineId,
    ring_no: row.ring_no,
    start_at: row.start_at,
    end_at: null,
    jue_duration: 0,
    pin_duration: 0,
    stop_duration: 0,
    status: "planned",
    source: "manual",
  }
}
