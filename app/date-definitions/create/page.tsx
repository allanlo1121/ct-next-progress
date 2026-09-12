import Form from "@/components/ui/date-definitions/create-form"
import Breadcrumbs from "@/components/ui/date-definitions/breadcrumbs"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Date Definition",
}

export default async function Page() {
  return (
    <main className="manage-page">
      <header className="manage-topbar">
        <div>
          <span className="eyebrow">统计日期定义</span>
          <h1>新增统计日期定义</h1>
          <p>选择统计日期的定义进行维护。</p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8"></div>
      </header>
      <section className="overview-panel">
        <Breadcrumbs
          breadcrumbs={[
            { label: "统计日期", href: "/date-definitions" },
            {
              label: "新增统计日期",
              href: `/date-definitions/create`,
              active: true,
            },
          ]}
        />
        <Form />
      </section>
    </main>
  )
}
