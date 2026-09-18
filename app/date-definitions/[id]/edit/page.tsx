import Form from "@/components/ui/date-definitions/edit-form"
import Breadcrumbs from "@/components/ui/date-definitions/breadcrumbs"
import { fetchDateDefinitionById } from "@/lib/date-definitions/repository"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit Date Definition",
}

export default async function Page(props: { params: Promise<{ id: string }> }) {

  const params = await props.params
  const id = Number(params.id)
  const dateDefinition = await fetchDateDefinitionById(id)

  if (!dateDefinition) {
    notFound()
  }

  return (
    <main className="manage-page">
      <header className="manage-topbar">
        <div>
          <span className="eyebrow">统计日期</span>
          <h1>统计日期维护</h1>
          <p>选择统计日期的定义进行维护。</p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          {/* <CreateInvoice /> */}
        </div>
      </header>
      <section className="overview-panel">
        <Breadcrumbs
          breadcrumbs={[
            { label: "统计日期调整", href: "/date-definitions" },
            {
              label: "编辑统计日期",
              href: `/date-definitions/${id}/edit`,
              active: true,
            },
          ]}
        />
        <Form dateDefinition={dateDefinition} />
      </section>
    </main>
  )
}
