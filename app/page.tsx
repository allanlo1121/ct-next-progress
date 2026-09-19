import Link from "next/link"
import { ArrowRight, GitBranch, MapPinned, Route } from "lucide-react"
import { fetchTunnelWithLines } from "@/lib/tunnels/repository"

export const dynamic = "force-dynamic"

function formatChainage(value: number | null) {
  if (value === null || value === undefined) return "待补充"
  return value.toFixed(3)
}

export default function Page() {
  
  const tunnels = fetchTunnelWithLines()
  const lineCount = tunnels.reduce(
    (count, tunnel) => count + tunnel.lines.length,
    0
  )
  const primaryTunnel = tunnels[0]

  return (
    <main className="home-page">
      <header className="home-header">
        <div>
          <span className="eyebrow">现场进度展示</span>
          <h1>盾构区间进度管理</h1>
          <p>
            系统首次打开时会自动初始化一个默认区间和左右线。先补齐基础资料，再进入后续计划进度和现场填报。
          </p>
        </div>
        <Link className="primary-link" href="/tunnel">
          完善区间信息
          <ArrowRight aria-hidden="true" />
        </Link>
      </header>

      <section className="stat-grid" aria-label="基础资料概览">
        <article>
          <MapPinned aria-hidden="true" />
          <span>区间数量</span>
          <strong>{tunnels.length}</strong>
        </article>
        <article>
          <GitBranch aria-hidden="true" />
          <span>线路数量</span>
          <strong>{lineCount}</strong>
        </article>
        <article>
          <Route aria-hidden="true" />
          <span>当前区间</span>
          <strong>{primaryTunnel?.name || "待初始化"}</strong>
        </article>
      </section>

      <section className="overview-panel">
        <div className="panel-heading">
          <div>
            <h2>区间及线路信息</h2>
            <p>以下数据来自首次初始化结果，可在区间信息页面继续修改。</p>
          </div>
        </div>

        <div className="tunnel-table" role="table" aria-label="区间及线路">
          <div className="table-row table-head" role="row">
            <span role="columnheader">区间</span>
            <span role="columnheader">线路</span>
            <span role="columnheader">里程范围</span>
            <span role="columnheader">环号范围</span>
            <span role="columnheader">计划时间</span>
          </div>
          {tunnels.flatMap((tunnel) =>
            tunnel.lines.map((line) => (
              <div className="table-row" key={line.id} role="row">
                <span role="cell">
                  <strong>{tunnel.name}</strong>
                  <small>{tunnel.full_name || tunnel.project_name}</small>
                </span>
                <span role="cell">{line.name}</span>
                <span role="cell">
                  {/* {line.prefix || "DK"} {formatChainage(line.start_chainage)} -{" "}
                  {formatChainage(line.end_chainage)} */}
                </span>
                <span role="cell">
                  {line.start_ring ?? 0} - {line.end_ring ?? "待补充"}
                </span>
                <span role="cell">
                  {line.scheduled_start_date || "待补充"} /{" "}
                  {line.scheduled_end_date || "待补充"}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
