"use client"

import { TunnelLineDrawer } from "@/components/tunnel/tunnel-line-drawer"

import { TunnelLine } from "@/lib/tunnels/definition"
import { updateTunnelLine } from "@/lib/tunnels/line-actions"

export default function TunnelLineClient({ line }: { line: TunnelLine }) {
  return (
    <div className="grid min-h-0 grid-rows-2 gap-x-6 gap-y-4">
      <div className="col-span-2">
        <h3 className="mb-4 text-lg font-semibold">
          <TunnelLineDrawer
            key={`${line.id}-${line.updated_at}`}
            line={line}
            onSave={(formData) => updateTunnelLine(line.id, formData)}
          />
        </h3>
      </div>
      <div className="col-span-2 flex items-center gap-3">
        <dt className="text-base text-muted-foreground">线路名称</dt>
        <dd className="text-base font-medium">{line?.name || ""}</dd>
      </div>

      <div className="col-span-2 flex items-center gap-3">
        <dt className="text-base text-muted-foreground">区间起止环号</dt>
        <dd className="text-base font-medium">
          {line?.start_ring ?? ""} - {line?.end_ring || ""}
        </dd>
      </div>

      <div className="col-span-2 flex items-center gap-3">
        <dt className="text-base text-muted-foreground">计划起止日期</dt>
        <dd className="text-base font-medium">
          {line?.scheduled_start_date || ""} - {line?.scheduled_end_date || ""}
        </dd>
      </div>
      <div className="col-span-2 flex items-center gap-3">
        <dt className="text-base text-muted-foreground">实际起止日期</dt>
        <dd className="text-base font-medium">
          {line?.actual_start_date || ""} - {line?.actual_end_date || ""}
        </dd>
      </div>
    </div>
  )
}
