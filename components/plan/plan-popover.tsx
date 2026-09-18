"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/toast"

import type {  PlanInput } from "@/lib/plans/definition"

type PlanPopoverProps = {
  plan: PlanInput
  onSave: (input: PlanInput) => Promise<{ success: boolean }>
}

export function PlanPopover({ plan, onSave }: PlanPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const value = formData.get("plan_ring_count")

    if (typeof value !== "string" || value === "") {
      return
    }

    const planRingCount = Number(value)

    if (!Number.isInteger(planRingCount) || planRingCount < 0) {
      return
    }
    const planInput: PlanInput = {
      tunnel_line_id: plan.tunnel_line_id,
      work_date: plan.work_date,
      plan_ring_count: planRingCount,
    }

    try {
      setPending(true)

      const result = await onSave(planInput)

      if (!result.success) {
        toast.add({
          title: "保存失败",
          type: "error",
        })
        return
      }

      setOpen(false)

      toast.add({
        title: "保存成功",
        type: "success",
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="link"
            className="h-auto w-32 border-2 border-brand-500 p-0 font-medium"
          />
        }
      >
        {plan.work_date}
      </PopoverTrigger>

      <PopoverContent className="w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="font-medium">{plan.work_date}</div>

          <div className="space-y-2">
            <Label htmlFor="plan_ring_count">计划环数</Label>

            <Input
              id="plan_ring_count"
              name="plan_ring_count"
              type="number"
              defaultValue={plan.plan_ring_count ?? ""}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              取消
            </Button>

            <Button type="submit" disabled={pending}>
              {pending ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
