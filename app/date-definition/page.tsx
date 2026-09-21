import { PageHeader } from "@/components/base/page-header"
import { LinkButton } from "@/components/base/link-button"

import { fetchDateDefinitions } from "@/lib/date-definition/repository"
import { Metadata } from "next"
import { DateDefinitionCard } from "@/components/date-definitions/date-card"
import { AddDateDefinitionCard } from "@/components/date-definitions/add-date-definition-card"
import {
  createDateDefinitionAction,
  updateDateDefinitionAction,
} from "@/lib/date-definition/actions"

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
      <div className="grid grid-cols-3 gap-4 p-4">
        {dateDefinitions.map((definition) => (
          <DateDefinitionCard
            key={definition.id}
            definition={definition}
            onSave={updateDateDefinitionAction}
          />
        ))}
        <AddDateDefinitionCard onSave={createDateDefinitionAction} />
      </div>
    </div>
  )
}
