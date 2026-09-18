"use client"

import { TunnelDrawer } from "@/components/tunnel/tunnel-drawer"
import { updateTunnel } from "@/lib/tunnels/actions"
import { Tunnel } from "@/lib/tunnels/definition"

export default function TunnelClient({ tunnel }: { tunnel: Tunnel }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <div className="col-span-2">
        <h3 className="mb-4 text-base font-semibold">
          <TunnelDrawer
            key={`${tunnel.id}-${tunnel.updated_at}`}
            tunnel={tunnel}
            onSave={(formData) => updateTunnel(tunnel.id, formData)}
          />
        </h3>
      </div>
      <div className="col-span-2 flex items-center gap-3">
        <dt className="text-base text-muted-foreground">项目名称</dt>
        <dd className="text-base font-medium">{tunnel?.project_name || ""}</dd>
      </div>

      <div className="col-span-1 flex items-center gap-3">
        <dt className="text-base text-muted-foreground">区间简称</dt>
        <dd className="text-base font-medium">{tunnel?.name || ""}</dd>
      </div>

      <div className="col-span-1 flex items-center gap-3">
        <dt className="text-base text-muted-foreground">线路模式</dt>
        <dd className="text-base font-medium">
          {tunnel?.line_mode === "double"
            ? "双线"
            : tunnel?.line_mode === "single"
              ? "单线"
              : ""}
        </dd>
      </div>
    </div>
  )
}
