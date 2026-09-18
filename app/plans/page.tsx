import Link from "next/link"
import { fetchTunnelLines } from "@/lib/tunnels/repository"
import { LinkButton } from "@/components/base/link-button"
import { PageHeader } from "@/components/base/page-header"
import { fetchPlansByTunnelLineId } from "@/lib/plans/repository"
import PlanEditor from "@/components/plan/plan-edit"

export const dynamic = "force-dynamic"

export default async function TunnelPlanPage() {
  const tunnelLine = await fetchTunnelLines()

  if (!tunnelLine) {
    return null
  }

  const leftPlans = await fetchPlansByTunnelLineId(tunnelLine[0].id)
  const rightPlans = await fetchPlansByTunnelLineId(tunnelLine[1].id)

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col">
      <PageHeader
        title="计划维护"
        description="在此页面可以维护隧道区间的计划信息。"
        actions={
          <LinkButton href="/dashboard" variant="default" size="lg">
            总览
          </LinkButton>
        }
      />

      <div className="grid min-h-0 w-full flex-1 grid-cols-2 gap-4 p-4">
        <PlanEditor line={tunnelLine[0]} initialPlans={leftPlans} />
        <PlanEditor line={tunnelLine[1]} initialPlans={rightPlans} />
      </div>
    </div>
  )
}
