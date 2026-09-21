import { fetchTunnelLines } from "@/lib/tunnel/repository"
import { LinkButton } from "@/components/base/link-button"
import { PageHeader } from "@/components/base/page-header"
import { fetchPlansByTunnelLineId } from "@/lib/plan/repository"
import PlanEditor from "@/components/plan/plan-edit"


export default async function TunnelPlanPage() {
  const tunnelLines = await fetchTunnelLines()

  const leftLine = tunnelLines?.[0]
  const rightLine = tunnelLines?.[1]

  const leftPlans = leftLine ? await fetchPlansByTunnelLineId(leftLine.id) : []

  const rightPlans = rightLine
    ? await fetchPlansByTunnelLineId(rightLine.id)
    : []

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
        {leftLine ? (
          <PlanEditor line={leftLine} initialPlans={leftPlans} />
        ) : (
          <EmptyPlanEditor title="左线" />
        )}

        {rightLine ? (
          <PlanEditor line={rightLine} initialPlans={rightPlans} />
        ) : (
          <EmptyPlanEditor title="右线" />
        )}
      </div>
    </div>
  )
}

function EmptyPlanEditor({ title }: { title: string }) {
  return (
    <div className="flex min-h-0 items-center justify-center rounded-lg border border-dashed">
      <div className="text-center">
        <div className="font-medium">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">
          暂无隧道线路数据
        </div>
      </div>
    </div>
  )
}
