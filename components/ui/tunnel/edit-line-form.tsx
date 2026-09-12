"use client"

import { useActionState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { updateTunnelLine, State } from "@/lib/tunnels/line-actions"

import type { TunnelLine } from "@/lib/tunnels/definition"

export default function LineForm({ line }: { line: TunnelLine }) {
  const initialState: State = {
    message: null,
    errors: {},
  }

  const updateTunnelWithId = updateTunnelLine.bind(null, line.id)

  const [state, formAction] = useActionState(updateTunnelWithId, initialState)

  return (
    <form action={formAction}>
      {/* 线路信息 */}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4 text-base font-semibold">线路信息</div>

        <div className="space-y-6">
          <div
            key={line.id}
            className="rounded-md border border-gray-200 bg-white p-4"
          >
            <input type="hidden" name="id" value={line.id} />

            <div className="mb-4 text-sm font-medium">{line.name}</div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  线路名称
                </label>

                <input
                  name="name"
                  type="text"
                  defaultValue={line.name}
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  起始环号
                </label>

                <input
                  name="start_ring"
                  type="number"
                  defaultValue={line.start_ring}
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  aria-describedby="start-ring-error"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  结束环号
                </label>

                <input
                  name="end_ring"
                  type="number"
                  defaultValue={line.end_ring ?? ""}
                  aria-describedby="end-ring-error"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">排序</label>

                <input
                  name="sort_order"
                  type="number"
                  defaultValue={line.sort_order}
                  aria-describedby="sort-order-error"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  计划开始日期
                </label>

                <input
                  name="scheduled_start_date"
                  type="date"
                  defaultValue={
                    line.scheduled_start_date
                      ? line.scheduled_start_date.slice(0, 10)
                      : ""
                  }
                  aria-describedby="scheduled-start-date-error"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  计划结束日期
                </label>

                <input
                  name="scheduled_end_date"
                  type="date"
                  defaultValue={
                    line.scheduled_end_date
                      ? line.scheduled_end_date.slice(0, 10)
                      : ""
                  }
                  aria-describedby="scheduled-end-date-error"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  实际开始日期
                </label>

                <input
                  name="actual_start_date"
                  type="date"
                  defaultValue={
                    line.actual_start_date
                      ? line.actual_start_date.slice(0, 10)
                      : ""
                  }
                  aria-describedby="actual-start-date-error"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  实际结束日期
                </label>

                <input
                  name="actual_end_date"
                  type="date"
                  defaultValue={
                    line.actual_end_date
                      ? line.actual_end_date.slice(0, 10)
                      : ""
                  }
                  aria-describedby="actual-end-date-error"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {state.message ? (
        <p className="text-sm text-red-500">{state.message}</p>
      ) : null}

      <div className="flex justify-end gap-4 pr-6">
        <Button className="h-10 w-32 bg-brand-500 text-white" type="submit">
          提交
        </Button>
      </div>
    </form>
  )
}
