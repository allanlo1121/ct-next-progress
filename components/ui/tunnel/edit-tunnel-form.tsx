"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { updateTunnel } from "@/lib/tunnels/actions"
import { useActionState } from "react"
import type { UpdateTunnelState } from "@/lib/tunnels/actions"

import { Tunnel } from "@/lib/tunnels/definition"

export default function TunnelForm({ tunnel }: { tunnel: Tunnel }) {
  const initialState: UpdateTunnelState = { message: null, errors: {} }
  const updateTunnelWithId = updateTunnel.bind(null, tunnel.id)
  const [state, formAction] = useActionState(updateTunnelWithId, initialState)

  return (
    <form action={formAction}>
      <div className="grid grid-cols-2 gap-4 rounded-md bg-gray-50 p-4 md:p-6">
        {/* tunnel  projectName */}
        <div className="col-span-1 mb-4">
          <label
            htmlFor="project_name"
            className="mb-2 block text-sm font-medium"
          >
            工程名称
          </label>
          <input
            id="project_name"
            name="project_name"
            type="text"
            defaultValue={tunnel.project_name}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="name-error"
          />
        </div>

        {/* tunnel  full_name */}
        <div className="col-span-1 mb-4">
          <label htmlFor="full_name" className="mb-2 block text-sm font-medium">
            区间全称
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={tunnel.full_name ?? ""}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="name-error"
          />
        </div>

        {/* tunnel  name */}
        <div className="col-span-1 mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            区间简称
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={tunnel.name}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="name-error"
          />
        </div>

        {/* tunnel linemode */}
        <div className="col-span-1 mb-4">
          <label htmlFor="line_mode" className="mb-2 block text-sm font-medium">
            区间模式
          </label>

          <div className="relative">
            <select
              id="line_mode"
              disabled
              name="line_mode"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={tunnel.line_mode}
              aria-describedby="line_mode-error"
            >
              <option value="single">单线</option>
              <option value="double">双线</option>
            </select>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {state.message ? (
              <p className="my-2 text-sm text-red-500">{state.message}</p>
            ) : null}
          </div>
        </div>
        <div className="col-span-2 mt-6 flex justify-end gap-4">
          <Button className="h-10 w-32 bg-brand-500 text-white" type="submit">
            提交
          </Button>
        </div>
      </div>
    </form>
  )
}
