
import { fetchTunnelLines } from "@/lib/tunnels/repository"
import { fetchRingRecordsByTunnelLineId } from "@/lib/ring-record/repository"

import { LinkButton } from "@/components/base/link-button"
import { PageHeader } from "@/components/base/page-header"
import RingRecordEditor from "@/components/ring-record/ring-record-editor";

export const dynamic = "force-dynamic"

export default async function TunnelProgressPage() {
  const tunnelLine = await fetchTunnelLines()

  if (!tunnelLine) {
    return null
  }
  const leftRingRecords = await fetchRingRecordsByTunnelLineId(tunnelLine[0].id)
  const rightRingRecords = await fetchRingRecordsByTunnelLineId(
    tunnelLine[1].id
  )
  console.log(tunnelLine)
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
        <RingRecordEditor line={tunnelLine[0]} initialRingRecords={leftRingRecords} />
        <RingRecordEditor line={tunnelLine[1]} initialRingRecords={rightRingRecords} />
      </div>
    </div>
  )
}
