import { fetchTunnelLines } from "@/lib/tunnel/repository"
import { fetchRingRecordsByTunnelLineId } from "@/lib/ring-record/repository"

import { LinkButton } from "@/components/base/link-button"
import { PageHeader } from "@/components/base/page-header"
import RingRecordEditor from "@/components/ring-record/ring-record-editor"


export default async function TunnelProgressPage() {
  const tunnelLines = await fetchTunnelLines()

  const leftLine = tunnelLines?.[0]
  const rightLine = tunnelLines?.[1]
  const leftRingRecords = leftLine
    ? await fetchRingRecordsByTunnelLineId(leftLine.id)
    : []
  const rightRingRecords = rightLine
    ? await fetchRingRecordsByTunnelLineId(rightLine.id)
    : []

  // console.log(tunnelLines)

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col">
      <PageHeader
        title="进度维护"
        description="在此页面可以维护隧道区间的掘进进度，包括左右线的环号记录。"
        actions={
          <LinkButton href="/dashboard" variant="default" size="lg">
            总览
          </LinkButton>
        }
      />

      <div className="grid min-h-0 w-full flex-1 grid-cols-2 gap-4 p-4">
        {leftLine ? (
          <RingRecordEditor
            line={leftLine}
            initialRingRecords={leftRingRecords}
          />
        ) : (
          <EmptyRingRecordEditor title="左线" />
        )}
        {rightLine ? (
          <RingRecordEditor
            line={rightLine}
            initialRingRecords={rightRingRecords}
          />
        ) : (
          <EmptyRingRecordEditor title="右线" />
        )}
      </div>
    </div>
  )
}

function EmptyRingRecordEditor({ title }: { title: string }) {
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
