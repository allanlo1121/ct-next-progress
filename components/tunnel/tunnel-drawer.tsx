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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import type { Tunnel } from "@/lib/tunnel/definition"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/dist/client/components/navigation"
import { useState } from "react"

export function TunnelDrawer({
  tunnel,
  onSave,
}: {
  tunnel: Tunnel
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
      <DrawerTrigger render={<Button variant="default" />}>
        {tunnel.full_name}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{tunnel.full_name}</DrawerTitle>
          <DrawerDescription>修改区间基础信息</DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form
            key={`${tunnel.updated_at}`}
            id={`tunnel-form-${tunnel.id}`}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-3">
              <Label htmlFor="full_name">区间全称</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={tunnel.full_name ?? ""}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">区间简称</Label>
              <Input id="name" name="name" defaultValue={tunnel.name ?? ""} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="project_name">工程名称</Label>
              <Input
                id="project_name"
                name="project_name"
                defaultValue={tunnel.project_name ?? ""}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="line_mode">区间模式</Label>
              <Select defaultValue={tunnel.line_mode} name="line_mode">
                <SelectTrigger id="line_mode" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="double">双线</SelectItem>
                  <SelectItem value="single">单线</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button type="submit" form={`tunnel-form-${tunnel.id}`}>
            提交
          </Button>
          <DrawerClose render={<Button variant="outline" />}>关闭</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
