import { ProgressRealtime } from "@/components/progress/progress-realtime"
import { EmptyLineCard } from "@/components/progress/line-card-empty"
import { fetchLineDataById } from "@/lib/progress/actions"
import { LineCardVariant } from "@/components/progress/line-card"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const leftLine = await fetchLineDataById(1)
  console.log("Dashboard Left Line:", leftLine)
  const rightLine = await fetchLineDataById(2)
  console.log("Dashboard Right Line:", rightLine)
  return (
    <div className="grid h-full min-h-0 w-full grid-rows-2 gap-8 overflow-hidden bg-[#07111f] bg-dashboard-background p-8 text-foreground ">
      {/* <ProgressRealtime /> */}
      {leftLine ? <ProgressRealtime line={leftLine} variant="left" /> : <EmptyLineCard />}
      {rightLine ? <ProgressRealtime line={rightLine} variant="right" /> : <EmptyLineCard />}
    </div>
  )
}
