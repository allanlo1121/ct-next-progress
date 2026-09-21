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
import { RingRecordPopover } from "./ring-record-popover"
import { RingRecord } from "@/lib/ring-record/definition"
import { ScrollArea } from "../ui/scroll-area"
import { updateRingRecordAction } from "@/lib/ring-record/actions"
import { utcToBeijing, getDurationFormat } from "@/lib/date-definition/utils"

export function RingRecordTable({ rings }: { rings: RingRecord[] }) {
  return (
    <ScrollArea className="mt-4 h-[640px] rounded-md border px-4">
      <Table>
        <TableCaption>掘进记录</TableCaption>
        <TableHeader className="bg-white">
          <TableRow>
            <TableHead className="w-[100px]">环号</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
            <TableHead className="text-right">完成时长</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rings.map((ring) => (
            <TableRow key={ring.id}>
              <TableCell className="font-medium">
                {" "}
                <RingRecordPopover
                  ring={ring}
                  onSave={updateRingRecordAction}
                />
              </TableCell>
              <TableCell>{utcToBeijing(ring.start_at)}</TableCell>
              <TableCell>{utcToBeijing(ring.end_at)}</TableCell>
              <TableCell className="text-right">
                {getDurationFormat(ring.start_at, ring.end_at, "HH-MM")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>总计</TableCell>
            <TableCell className="text-right">{rings.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </ScrollArea>
  )
}
