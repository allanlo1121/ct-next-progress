import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { updatePlanAction } from "@/lib/plan/actions"
import type {PlanInput } from "@/lib/plan/definition"

import { PlanPopover } from "./plan-popover"

type PlanWithAccumulated = PlanInput & {
  accumulated_ring_count: number
}

export function PlanTable({ plans }: { plans: PlanInput[] }) {
  const plansWithAccumulated = plans.reduce<PlanWithAccumulated[]>(
    (result, plan) => {
      const previousAccumulated = result.at(-1)?.accumulated_ring_count ?? 0

      result.push({
        ...plan,
        accumulated_ring_count: previousAccumulated + plan.plan_ring_count,
      })

      return result
    },
    []
  )

  const totalRingCount =
    plansWithAccumulated.at(-1)?.accumulated_ring_count ?? 0

  return (
    <ScrollArea className="mt-4 h-[640px] rounded-md border px-8">
      <Table>
        <TableCaption>掘进计划表</TableCaption>

        <TableHeader className="bg-white">
          <TableRow >
            <TableHead className="w-[160px] text-center">日期</TableHead>

            <TableHead className="text-center">计划环数</TableHead>

            <TableHead className="text-center">累计环数</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {plansWithAccumulated.length > 0 ? (
            plansWithAccumulated.map((plan,index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <PlanPopover plan={plan} onSave={updatePlanAction} />
                </TableCell>

                <TableCell className="text-center">
                  {plan.plan_ring_count}
                </TableCell>

                <TableCell className="text-center">
                  {plan.accumulated_ring_count}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-muted-foreground"
              >
                暂无计划数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>总计</TableCell>

            <TableCell className="text-right font-semibold">
              {totalRingCount}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </ScrollArea>
  )
}
