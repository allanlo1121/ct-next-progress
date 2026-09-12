import Form from "@/components/ui/date-definitions/edit-form"
import Breadcrumbs from "@/components/ui/date-definitions/breadcrumbs"
import { fetchDateDefinitionById } from "@/lib/date-definitions/data"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import {
  fetchTunnelWithLines,
  fetchTunnelWithLinesById,
} from "@/lib/tunnels/data"
import { Button } from "@/components/ui/button"
import PlanGenerator from "@/components/ui/plan/plan-generator"

export const metadata: Metadata = {
  title: "Edit Date Definition",
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = Number(params.id)
  const dateDefinition = await fetchDateDefinitionById(id)
  const tunnelLines = await fetchTunnelWithLinesById(id)

  if (!dateDefinition || !tunnelLines) {
    notFound()
  }

  const line_left = tunnelLines?.lines?.[0]

  return (
    <main className="flex flex-col min-h-[calc(100vh-3rem)] border-2 border-red-500 bg-linear-to-b from-background to-brand-100 p-8 text-foreground overflow">
      <header className="mx-auto mb-6 h-16 max-w-6xl min-w-4xl flex-none  gap-6 border-2 border-green-500">
        <div>
          <h2 className="text-2xl font-semibold text-brand-950">
            统计日期维护
          </h2>
          <p>选择统计日期的定义进行维护。</p>
        </div>
      </header>
      <section className="mx-auto mt-0 flex-1 flex max-w-6xl bg-card border-2 border-blue-500">
        <PlanGenerator
          key={line_left.id}
          line={line_left}
          title={line_left.name || `左线`}
        />
      </section>
    </main>
  )
}
