import TunnelForm from "@/components/ui/tunnel/edit-tunnel-form"
import Breadcrumbs from "@/components/ui/tunnel/breadcrumbs"

import { notFound } from "next/navigation"
import { Metadata } from "next"
import {
  fetchTunnelById,
  fetchTunnelLinesById,
  fetchTunnelWithLinesById,
} from "@/lib/tunnels/data"
import LineForm from "@/components/ui/tunnel/edit-line-form"
import Link from "next/dist/client/link";

export const metadata: Metadata = {
  title: "Edit Tunnel",
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = Number(params.id)
  const tunnel = await fetchTunnelById(id)

  if (!tunnel) {
    notFound()
  }

  const lines = await fetchTunnelLinesById(tunnel.id)

  return (
    <main className="h-full w-full p-4">
      <header className="manage-topbar">
        <div>
          <span className="eyebrow">工期计划</span>
          <h1>区间维护</h1>
          <p>对区间信息进行维护。</p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
           <Link href={`/tunnels`}>返回区间信息</Link>
        </div>
      </header>
      <section className="overview-panel">
        {/* <Breadcrumbs
          breadcrumbs={[
            { label: "区间调整", href: "/tunnel" },
            {
              label: "编辑区间",
              href: `/tunnel/${id}/edit`,
              active: true,
            },
          ]}
        /> */}
        <TunnelForm tunnel={tunnel} />
        <LineForm line={lines[0]} />
        <LineForm line={lines[1]} />
      </section>
    </main>
  )
}
