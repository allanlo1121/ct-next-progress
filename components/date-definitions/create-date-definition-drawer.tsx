"use client"

import { useId, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"


type DateDefinitionDrawerProps = {
  onSave: (formData: FormData) => Promise<{ success: boolean }>
  trigger: React.ReactElement
}

export function DateDefinitionDrawer({
  onSave,
  trigger,
}: DateDefinitionDrawerProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const result = await onSave(formData)

    if (!result.success) {
      toast.add({
        title: "保存失败",
        type: "error",
      })
      return
    }

    setOpen(false)

    router.refresh()

    toast.add({
      title: "保存成功",
      type: "success",
    })
  }
  const generatedId = useId()
  const formId = `date-definition-form-${generatedId}`

  return (
    <Drawer swipeDirection="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={trigger} />

      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>创建日期周期定义</DrawerTitle>

          <DrawerDescription>修改统计日期周期定义</DrawerDescription>
        </DrawerHeader>

        <div className="mt-4 flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form
            id={formId}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            {/* 基本信息 */}
            <div className="flex flex-col gap-3">
              <Label htmlFor={`name-${generatedId}`}>定义名称</Label>

              <Input id={`name-${generatedId}`} name="name" />
            </div>

            {/* 日周期 */}
            <PeriodSection title="日周期">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label>开始日期</Label>

                  <Select name="day_start_offset" defaultValue="0">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="0">当天</SelectItem>
                      <SelectItem value="-1">上一自然日</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor={`day_start_time-${generatedId}`}>
                    开始时间
                  </Label>

                  <Input
                    id={`day_start_time-${generatedId}`}
                    name="day_start_time"
                    type="number"
                    min={0}
                    max={23}
                    defaultValue="0"
                  />
                </div>
              </div>
            </PeriodSection>

            {/* 周周期 */}
            <PeriodSection title="周周期">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label>开始周期</Label>

                  <Select name="week_start_offset" defaultValue="0">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="0">本自然周</SelectItem>
                      <SelectItem value="-1">上一自然周</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>开始星期</Label>

                  <Select name="week_start_dow" defaultValue="1">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>                      
                      <SelectItem value="1">周一</SelectItem>
                      <SelectItem value="2">周二</SelectItem>
                      <SelectItem value="3">周三</SelectItem>
                      <SelectItem value="4">周四</SelectItem>
                      <SelectItem value="5">周五</SelectItem>
                      <SelectItem value="6">周六</SelectItem>
                      <SelectItem value="7">周日</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PeriodSection>

            {/* 月周期 */}
            <PeriodSection title="月周期">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label>开始周期</Label>

                  <Select name="month_start_offset" defaultValue="0">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="0">本自然月</SelectItem>
                      <SelectItem value="-1">上一自然月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor={`month_start_day-${generatedId}`}>
                    开始日期
                  </Label>

                  <Input
                    id={`month_start_day-${generatedId}`}
                    name="month_start_day"
                    type="number"
                    min={1}
                    max={31}
                    defaultValue="1"
                  />
                </div>
              </div>
            </PeriodSection>

            {/* 年周期 */}
            <PeriodSection title="年周期">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                  <Label>开始周期</Label>

                  <Select name="year_start_offset" defaultValue="0">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="0">本自然年</SelectItem>
                      <SelectItem value="-1">上一自然年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor={`year_start_month-${generatedId}`}>
                    开始月份
                  </Label>

                  <Input
                    id={`year_start_month-${generatedId}`}
                    name="year_start_month"
                    type="number"
                    min={1}
                    max={12}
                    defaultValue="1"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor={`year_start_day-${generatedId}`}>
                    开始日期
                  </Label>

                  <Input
                    id={`year_start_day-${generatedId}`}
                    name="year_start_day"
                    type="number"
                    min={1}
                    max={31}
                    defaultValue="1"
                  />
                </div>
              </div>
            </PeriodSection>

            {/* 其他 */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor={`is_default-${generatedId}`}>
                    默认日期定义
                  </Label>

                  <p className="text-xs text-muted-foreground">
                    设置为系统默认统计日期规则
                  </p>
                </div>

                <Switch
                  id={`is_default-${generatedId}`}
                  name="is_default"
                  defaultChecked={false}
                />
              </div>
            </div>

            <input type="hidden" name="sort_order" value="1" />
          </form>
        </div>

        <DrawerFooter>
          <Button type="submit" form={formId}>
            提交
          </Button>

          <DrawerClose render={<Button variant="outline" />}>关闭</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function PeriodSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="text-sm font-medium">{title}</div>

      {children}
    </div>
  )
}
