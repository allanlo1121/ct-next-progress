import { TopBarClock } from "./topbar-clock"
import { ProgressRealtime } from "./progress/progress-realtime"

import { TopBarMenu } from "./topbar-menu"
import { Tunnel } from "@/lib/tunnels/definition"

export async function TopBar({ tunnel }: { tunnel: Tunnel | null }) {
  return (
    <header className="relative flex h-16 w-full shrink-0 items-center border-b border-white/10 bg-[#07111f]/95 px-5 text-white backdrop-blur">
      {/* 左侧菜单 */}
      <div className="flex flex-1 items-center">
        <TopBarMenu />
        <ProgressRealtime />
      </div>

      {/* 中间标题 */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-4xl font-extrabold tracking-[0.12em] whitespace-nowrap text-cyan-50">
        {tunnel?.full_name && `${tunnel.full_name} `}
        盾构施工计划完成情况对比统计表
      </div>

      {/* 右侧预留 */}
      <div className="flex flex-1 justify-end">
        
        <TopBarClock />
         
      </div>
    </header>
  )
}
