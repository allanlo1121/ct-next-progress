import Link from "next/link"
import { ArrowRight, CalendarClock, HardHat, PencilLine } from "lucide-react"
import {
  getDateDefinitionRules,
  listDateDefinitions,
} from "@/lib/date-definitions"
import { listTunnelWithLines } from "@/lib/tunnel"

export const dynamic = "force-dynamic"

export default function ProgressEditPage() {
  const tunnels = listTunnelWithLines()
  const dateDefinitions = listDateDefinitions()
  const lineCount = tunnels.reduce(
    (count, tunnel) => count + tunnel.lines.length,
    0
  )

  return (
    <main className="manage-page">
      <header className="manage-topbar">
        <div>
          <span className="eyebrow">进度修改</span>
          <h1>现场进度维护</h1>
          <p>选择区间和线路后，可继续接入当天环号、施工状态和计划调整等进度填报内容。</p>
        </div>
        {lineCount === 0 && (
          <Link className="primary-link" href="/tunnel">
            先维护区间
            <ArrowRight aria-hidden="true" />
          </Link>
        )}
      </header>

      <section className="stat-grid" aria-label="进度维护概览">
        <article>
          <PencilLine aria-hidden="true" />
          <span>维护入口</span>
          <strong>进度修改</strong>
        </article>
        <article>
          <HardHat aria-hidden="true" />
          <span>可选区间</span>
          <strong>{tunnels.length}</strong>
        </article>
        <article>
          <CalendarClock aria-hidden="true" />
          <span>可选线路</span>
          <strong>{lineCount}</strong>
        </article>
      </section>

      <section className="overview-panel date-definition-panel">
        <div className="panel-heading">
          <div>
            <h2>日期统计口径</h2>
            <p>工作日、周、月、季度统计都按以下区间归集。</p>
          </div>
        </div>

        <div
          className="date-definition-table"
          role="table"
          aria-label="日期统计口径"
        >
          <div className="date-definition-row table-head" role="row">
            <span role="columnheader">周期</span>
            <span role="columnheader">开始</span>
            <span role="columnheader">结束</span>
            <span role="columnheader">时间口径</span>
            <span role="columnheader">说明</span>
          </div>
          {dateDefinitions.map((definition) => {
            const rules = getDateDefinitionRules(definition)

            return (
              <div className="date-definition-row" key={definition.id} role="row">
                <span role="cell">
                  <strong>{definition.name}</strong>
                </span>
                <span role="cell">{rules.start}</span>
                <span role="cell">{rules.end}</span>
                <span role="cell">{rules.basis}</span>
                <span role="cell">{rules.summary}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="overview-panel">
        <div className="panel-heading">
          <div>
            <h2>待维护线路</h2>
            <p>进度录入表单接入前，可先在区间修改中完善线路基础资料。</p>
          </div>
        </div>

        <div className="tunnel-table" role="table" aria-label="待维护线路">
          <div className="table-row table-head" role="row">
            <span role="columnheader">区间</span>
            <span role="columnheader">线路</span>
            <span role="columnheader">当前状态</span>
            <span role="columnheader">起始环号</span>
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
                <span role="cell">待填报</span>
                <span role="cell">{line.start_ring ?? 0}</span>
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
