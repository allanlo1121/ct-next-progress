
import { CreateDateDefinition } from "@/components/ui/date-definitions/buttons";
import Table from "@/components/ui/date-definitions/table"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "data-definitions",
}

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""

  return (
      <main className="manage-page">
      <header className="manage-topbar">
        <div>
          <span className="eyebrow">统计日期</span>
          <h1>统计日期维护</h1>
          <p>选择统计日期的定义进行维护。</p>
        </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateDateDefinition />
      </div>

     
      </header>
        <section className="overview-panel">
        <div className="panel-heading">
          <div>
            <h2>待维护线路</h2>
            <p>进度录入表单接入前，可先在区间修改中完善线路基础资料。</p>
          </div>
        </div>

          <Table />
   
      </section>
        </main>
  )
}
