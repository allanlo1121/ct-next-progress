import Link from "next/link"
import { fetchTunnelWithLinesById } from "@/lib/tunnels/data"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const dynamic = "force-dynamic"

export default async function TunnelPage() {
  const tunnelLine = await fetchTunnelWithLinesById(1)

  if (!tunnelLine) {
    return null
  }

  return (
    <main className="manage-page">
      <header className="manage-topbar">
        <div>
          <span className="eyebrow">基础资料</span>
          <h1>区间及线路信息</h1>
          <p>
            首次打开项目时会初始化默认区间和左右线，这里用于继续补齐里程、环号和计划时间。
          </p>
        </div>
        <nav>
          {/* <Link href="/">总览</Link> */}
          <Link href={`/tunnels/${tunnelLine.id}/edit`}>修改区间信息</Link>
        </nav>
      </header>

      <div className="manage-shell">
        <aside className="side-list">
          <button key={tunnelLine.id} type="button">
            <strong>{tunnelLine.name}</strong>
            <span>
              {tunnelLine.full_name || tunnelLine.project_name || tunnelLine.id}
            </span>
          </button>
        </aside>

        <div>
          <section className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2">
              <h3 className="mb-4 text-base font-semibold">
                {tunnelLine?.full_name || ""}
              </h3>
            </div>
            <div className="col-span-2">
              <dt className="text-sm text-muted-foreground">项目名称</dt>
              <dd className="mt-1 text-sm font-medium">
                {tunnelLine?.project_name || ""}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">区间名称</dt>
              <dd className="mt-1 text-sm font-medium">
                {tunnelLine?.name || ""}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">线路模式</dt>
              <dd className="mt-1 text-sm font-medium">
                {tunnelLine?.line_mode === "double"
                  ? "双线"
                  : tunnelLine?.line_mode === "single"
                    ? "单线"
                    : ""}
              </dd>
            </div>
          </section>

          <div className="line-stack mt-8">
            {tunnelLine.lines.map((line, index) => (
              <section key={line.id} className="line-panel">
                <h3 className="mb-4 text-base font-semibold">
                  {line.name || `线路${index + 1}`}
                </h3>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">起始环号</dt>
                    <dd className="mt-1 text-sm font-medium">
                      {line.start_ring ?? "-"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">结束环号</dt>
                    <dd className="mt-1 text-sm font-medium">
                      {line.end_ring ?? "-"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">计划开工</dt>
                    <dd className="mt-1 text-sm font-medium">
                      {line.scheduled_start_date || "-"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">计划竣工</dt>
                    <dd className="mt-1 text-sm font-medium">
                      {line.scheduled_end_date || "-"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">实际开工</dt>
                    <dd className="mt-1 text-sm font-medium">
                      {line.actual_start_date || "-"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">实际竣工</dt>
                    <dd className="mt-1 text-sm font-medium">
                      {line.actual_end_date || "-"}
                    </dd>
                  </div>
                </dl>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
