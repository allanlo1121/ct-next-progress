"use client"

import * as React from "react"
import {
  columnVisibilityFeature,
  createColumnHelper,
  createPaginatedRowModel,
  FlexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
  useTable,
  type ColumnVisibilityState,
} from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Plan = {
  id: number
  tunnel_line_id: number
  work_date: string
  plan_ring_count: number
}

const features = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Plan>()

function createColumns(
  updatePlan: (id: number, planRingCount: number) => void,
  data: Plan[]
) {
  return columnHelper.columns([
    columnHelper.display({
      id: "select",

      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="全选"
          />
        </div>
      ),

      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="选择"
          />
        </div>
      ),
    }),

    columnHelper.accessor("work_date", {
      header: "计划日期",

      cell: ({ row }) => (
        <span className="font-medium">{row.original.work_date}</span>
      ),
    }),

    columnHelper.accessor("plan_ring_count", {
      header: () => <div className="text-right">计划环数</div>,

      cell: ({ row }) => (
        <div className="flex justify-end">
          <Input
            type="number"
            min={0}
            step={1}
            className="h-8 w-24 text-right"
            value={row.original.plan_ring_count}
            onChange={(event) =>
              updatePlan(row.original.id, Number(event.target.value))
            }
          />
        </div>
      ),
    }),

    columnHelper.display({
      id: "cumulative",

      header: () => <div className="text-right">累计计划</div>,

      cell: ({ row }) => {
        const currentIndex = data.findIndex(
          (item) => item.id === row.original.id
        )

        const cumulative = data
          .slice(0, currentIndex + 1)
          .reduce((sum, item) => sum + item.plan_ring_count, 0)

        return <div className="text-right font-medium">{cumulative}</div>
      },
    }),
  ])
}

export function PlanTable({
  data: initialData,
  onChange,
}: {
  data: Plan[]
  onChange?: (data: Plan[]) => void
}) {
  const [data, setData] = React.useState<Plan[]>(() =>
    [...initialData].sort((a, b) => a.work_date.localeCompare(b.work_date))
  )

  const [rowSelection, setRowSelection] = React.useState({})

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  })

  function changeData(updater: (data: Plan[]) => Plan[]) {
    setData((current) => {
      const next = updater(current)

      onChange?.(next)

      return next
    })
  }

  function updatePlan(id: number, planRingCount: number) {
    changeData((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              plan_ring_count: planRingCount,
            }
          : item
      )
    )
  }

  const columns = createColumns(updatePlan, data)

  const table = useTable({
    features,
    data,
    columns,

    state: {
      rowSelection,
      pagination,
    },

    getRowId: (row) => row.id.toString(),

    enableRowSelection: true,

    onRowSelectionChange: setRowSelection,

    onPaginationChange: setPagination,
  })

  const totalRingCount = React.useMemo(() => {
    return data.reduce((sum, item) => sum + item.plan_ring_count, 0)
  }, [data])

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">日进度计划</h3>

          <p className="text-sm text-muted-foreground">
            共 {data.length} 天， 计划 {totalRingCount} 环
          </p>
        </div>
      </div>

      <div className="h-full overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  暂无计划
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          已选择 {table.getSelectedRowModel().rows.length} 条
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            第 {table.state.pagination.pageIndex + 1} / {table.getPageCount()}{" "}
            页
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
