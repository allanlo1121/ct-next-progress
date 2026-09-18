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

import type { RingRecord } from "@/lib/ring-record/definition"

type RingRecordPopoverProps = {
  ring: RingRecord
  onSave: (id: number, startAt: string) => Promise<{ success: boolean }>
}

export function RingRecordPopover({ ring, onSave }: RingRecordPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const startAt = formData.get("start_at")

    if (typeof startAt !== "string" || !startAt) {
      return
    }

    try {
      setPending(true)

      const result = await onSave(ring.id, startAt)

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
            className="h-auto w-16 border-2 border-brand-500 p-0 font-medium"
          />
        }
      >
        {ring.ring_no}
      </PopoverTrigger>

      <PopoverContent className="w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="font-medium">第 {ring.ring_no} 环</div>

          <div className="space-y-2">
            <Label htmlFor={`start_at-${ring.id}`}>开始时间</Label>

            <Input
              id={`start_at-${ring.id}`}
              name="start_at"
              type="datetime-local"
              defaultValue={ring.start_at ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`end_at-${ring.id}`}>结束时间</Label>

            <Input
              id={`end_at-${ring.id}`}
              name="end_at"
              type="datetime-local"
              defaultValue={ring.end_at ?? ""}
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
