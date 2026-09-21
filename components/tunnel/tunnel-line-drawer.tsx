import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { TunnelLine } from "@/lib/tunnel/definition"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/dist/client/components/navigation"
import { useState } from "react"

export function TunnelLineDrawer({
  line,
  onSave,
}: {
  line: TunnelLine
  onSave: (formData: FormData) => Promise<{ success: boolean }>
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    // console.log(Object.fromEntries(formData.entries()))

    const result = await onSave(formData)
    if (!result.success) {
      toast.add({
        title: "保存失败",
        type: "error",
      })
      return
    }

    // 关闭 Drawer
    setOpen(false)

    // 重新执行 Server Component，重新读取 SQLite
    router.refresh()

    toast.add({
      title: "保存成功",
      type: "success",
    })
  }
  return (
    <Drawer swipeDirection="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={<Button variant="default" className="min-w-32" />}>
        {line.name}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{line.name}</DrawerTitle>
          <DrawerDescription>修改区间线路信息</DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form
            key={`${line.id}-${line.updated_at}`}
            id={`tunnel-form-${line.id}`}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">线路名称</Label>
              <Input id="name" name="name" defaultValue={line.name ?? ""} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="start_ring">线路起止环号</Label>
              <div className="flex gap-2">
                <Input
                  id="start_ring"
                  name="start_ring"
                  defaultValue={line.start_ring ?? ""}
                />
                <span>-</span>
                <Input
                  id="end_ring"
                  name="end_ring"
                  defaultValue={line.end_ring ?? ""}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="scheduled_start_date">线路计划起止</Label>
              <div className="flex gap-2">
                <Input
                  id="scheduled_start_date"
                  name="scheduled_start_date"
                  type="date"
                  defaultValue={line.scheduled_start_date ?? ""}
                />
                <span>-</span>
                <Input
                  id="scheduled_end_date"
                  name="scheduled_end_date"
                  type="date"
                  defaultValue={line.scheduled_end_date ?? ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="actual_start_date">线路实际起止</Label>
              <div className="flex gap-2">
                <Input
                  id="actual_start_date"
                  name="actual_start_date"
                  type="date"
                  defaultValue={line.actual_start_date ?? ""}
                />
                <span>-</span>
                <Input
                  id="actual_end_date"
                  name="actual_end_date"
                  type="date"
                  defaultValue={line.actual_end_date ?? ""}
                />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button type="submit" form={`tunnel-form-${line.id}`}>
            提交
          </Button>
          <DrawerClose render={<Button variant="outline" />}>关闭</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
