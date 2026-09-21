import { fetchTunnelWithLinesById } from "@/lib/tunnel/repository"

import TunnelClient from "@/components/tunnel/tunnel-client"
import TunnelLineClient from "@/components/tunnel/tunnel-line-client"

import { PageHeader } from "@/components/base/page-header"
import { LinkButton } from "@/components/base/link-button"


export default async function TunnelPage() {
  const tunnelLine = await fetchTunnelWithLinesById(1)

  if (!tunnelLine) {
    return null
  }

  const { lines, ...rest } = tunnelLine

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col">
      <PageHeader
        title="区间基础信息"
        description="首次打开项目时会初始化默认区间和左右线，这里用于继续补齐里程、环号和计划时间。"
        actions={
          <LinkButton href="/dashboard" variant="default" size="lg">
            总览
          </LinkButton>
        }
      />

      <section className="min-h-0 w-full flex-1 p-4">
        <TunnelClient key={`${rest.id}-${rest.updated_at}`} tunnel={rest} />

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
          {lines.map((line) => (
            <section key={line.id} className="min-h-0 border-2 border-brand-500 p-4 rounded-2xl">
              <TunnelLineClient
                key={`${line.id}-${line.updated_at}`}
                line={line}
              />
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
