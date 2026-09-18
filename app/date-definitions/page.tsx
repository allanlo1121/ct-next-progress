import { PageHeader } from "@/components/base/page-header"
import { LinkButton } from "@/components/base/link-button"

import Table from "@/components/date-definitions/table"
import { fetchDateDefinitions } from "@/lib/date-definitions/repository"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "data-definitions",
}

export default async function Page() {


const dateDefinitions = await fetchDateDefinitions()

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col">
      <PageHeader
        title="统计日期"
        description="在此页面可以维护统计日期的定义。"
        actions={
          <LinkButton href="/dashboard" variant="default" size="lg">
            总览
          </LinkButton>
        }
      />
      <Table dateDefinitions={dateDefinitions} />
    </div>
  )
}
