import { LeftLineCard } from "@/components/progress/left-line-card"

import { RightLineCard } from "@/components/progress/right-line-card"
import { fetchLineDataById } from "@/lib/progress/actions"

export default async function DashboardPage() {
  const leftLine = await fetchLineDataById(1)
  // console.log("Dashboard Left Line:", leftLine)
  const rightLine = await fetchLineDataById(2)
  // console.log("Dashboard Right Line:", rightLine)
  return (
    <div className="grid h-full min-h-0 w-full grid-rows-2 gap-8 overflow-hidden bg-[#07111f] bg-dashboard-background p-8 text-foreground">
      <div className="min-h-0 overflow-hidden rounded-2xl bg-brand-900 outline-4 outline-offset-2 outline-brand-500 outline-solid">
        {leftLine && <LeftLineCard lineData={leftLine} />}
      </div>

      <div className="min-h-0 overflow-hidden rounded-2xl bg-industrial-700 outline-4 outline-offset-2 outline-industrial-500 outline-solid">
        {rightLine && <RightLineCard lineData={rightLine} />}
      </div>
    </div>
  )
}
