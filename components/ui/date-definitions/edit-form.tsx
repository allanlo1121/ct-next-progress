"use client"

import { DateDefinitionForm } from "@/lib/date-definitions/definition"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { updateDateDefinition, State } from "@/lib/date-definitions/actions"
import { useActionState } from "react"
import { Switch } from "../switch"

export default function EditDateDefinitionForm({
  dateDefinition,
}: {
  dateDefinition: DateDefinitionForm
}) {
  const initialState: State = { message: null, errors: {} }
  const updateDateDefinitionWithId = updateDateDefinition.bind(
    null,
    dateDefinition.id
  )
  const [state, formAction] = useActionState(
    updateDateDefinitionWithId,
    initialState
  )

  return (
    <form action={formAction}>
      <div className="grid grid-cols-3 gap-4 rounded-md bg-gray-50 p-4 md:p-6">
        {/* DateDefinition Name */}

        <div className="col-span-1 col-start-1 mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            统计日期名称
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={dateDefinition.name}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="name-error"
          />
        </div>

        {/* DateDefinition day_start_offset */}
        <div className="col-span-1 col-start-1 mb-4">
          <label
            htmlFor="day_start_offset"
            className="mb-2 block text-sm font-medium"
          >
            选择自然日
          </label>

          <div className="relative">
            <select
              id="day_start_offset"
              name="day_start_offset"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={dateDefinition.day_start_offset}
              aria-describedby="day_start_offset-error"
            >
              <option value={0}>当日</option>
              <option value={-1}>上一个自然日</option>
            </select>
          </div>

          <div
            id="day_start_offset-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.day_start_offset?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition day_start_time */}
        <div className="col-span-2 col-start-2 mb-4">
          <label
            htmlFor="day_start_time"
            className="mb-2 block text-sm font-medium"
          >
            工作日开始时间
          </label>

          <div className="relative">
            <select
              id="day_start_time"
              name="day_start_time"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2"
              defaultValue={dateDefinition.day_start_time}
              aria-describedby="day_start_time-error"
            >
              {Array.from({ length: 24 }, (_, hour) => (
                <option key={hour} value={hour}>
                  {String(hour).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>
          <div id="day_start_time-error" aria-live="polite" aria-atomic="true">
            {state.errors?.day_start_time?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition week_start_offset */}
        <div className="col-span-1 col-start-1 mb-4">
          <label
            htmlFor="week_start_offset"
            className="mb-2 block text-sm font-medium"
          >
            选择工作周开始
          </label>

          <div className="relative">
            <select
              id="week_start_offset"
              name="week_start_offset"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={dateDefinition.week_start_offset}
              aria-describedby="week_start_offset-error"
            >
              <option value={0}>本周</option>
              <option value={-1}>上周</option>
            </select>
          </div>

          <div
            id="week_start_offset-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.week_start_offset?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition week_start_dow */}
        <div className="col-span-2 col-start-2 mb-4">
          <label
            htmlFor="week_start_dow"
            className="mb-2 block text-sm font-medium"
          >
            选择工作周的开始日
          </label>

          <div className="relative">
            <select
              id="week_start_dow"
              name="week_start_dow"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2"
              defaultValue={dateDefinition.week_start_dow}
              aria-describedby="week_start_dow-error"
            >
              {Array.from({ length: 7 }, (_, day) => (
                <option key={day + 1} value={day + 1}>
                  星期{day + 1}
                </option>
              ))}
            </select>
          </div>

          <div id="week_start_dow-error" aria-live="polite" aria-atomic="true">
            {state.errors?.week_start_dow?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition month_start_offset */}
        <div className="col-span-1 col-start-1 mb-4">
          <label
            htmlFor="month_start_offset"
            className="mb-2 block text-sm font-medium"
          >
            选择工作月开始
          </label>

          <div className="relative">
            <select
              id="month_start_offset"
              name="month_start_offset"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={dateDefinition.month_start_offset}
              aria-describedby="month_start_offset-error"
            >
              <option value={0}>本月</option>
              <option value={-1}>上月</option>
            </select>
          </div>

          <div
            id="month_start_offset-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.month_start_offset?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition month_start_day */}
        <div className="col-span-2 col-start-2 mb-4">
          <label
            htmlFor="month_start_day"
            className="mb-2 block text-sm font-medium"
          >
            选择工作月的开始日
          </label>

          <div className="relative">
            <select
              id="month_start_day"
              name="month_start_day"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2"
              defaultValue={dateDefinition.month_start_day}
              aria-describedby="month_start_day-error"
            >
              {Array.from({ length: 31 }, (_, day) => (
                <option key={day + 1} value={day + 1}>
                  {day + 1}日
                </option>
              ))}
            </select>
          </div>

          <div id="month_start_day-error" aria-live="polite" aria-atomic="true">
            {state.errors?.month_start_day?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition year_start_offset */}
        <div className="col-span-1 col-start-1 mb-4">
          <label
            htmlFor="year_start_offset"
            className="mb-2 block text-sm font-medium"
          >
            选择开始年度
          </label>

          <div className="relative">
            <select
              id="year_start_offset"
              name="year_start_offset"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={dateDefinition.year_start_offset}
              aria-describedby="year_start_offset-error"
            >
              <option value={0}>本年</option>
              <option value={-1}>上一年</option>
            </select>
          </div>

          <div
            id="year_start_offset-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.year_start_offset?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition year_start_month */}
        <div className="col-span-1 col-start-2 mb-4">
          <label
            htmlFor="year_start_month"
            className="mb-2 block text-sm font-medium"
          >
            选择年度开始月份
          </label>

          <div className="relative">
            <select
              id="year_start_month"
              name="year_start_month"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2"
              defaultValue={dateDefinition.year_start_month}
              aria-describedby="year_start_month-error"
            >
              {Array.from({ length: 12 }, (_, month) => (
                <option key={month + 1} value={month + 1}>
                  {month + 1}月
                </option>
              ))}
            </select>
          </div>

          <div
            id="year_start_month-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.year_start_month?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition year_start_day */}
        <div className="col-span-1 col-start-3 mb-4">
          <label
            htmlFor="year_start_day"
            className="mb-2 block text-sm font-medium"
          >
            选择年度开始日期
          </label>

          <div className="relative">
            <select
              id="year_start_day"
              name="year_start_day"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2"
              defaultValue={dateDefinition.year_start_day}
              aria-describedby="year_start_day-error"
            >
              {Array.from({ length: 31 }, (_, day) => (
                <option key={day + 1} value={day + 1}>
                  {day + 1}日
                </option>
              ))}
            </select>
          </div>

          <div id="year_start_day-error" aria-live="polite" aria-atomic="true">
            {state.errors?.year_start_day?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition is_default */}
        <div className="col-span-1 col-start-1 mb-4">
          <label
            htmlFor="is_default"
            className="mb-2 block text-sm font-medium"
          >
            是否为默认
          </label>

          <div className="relative">
            <Switch
              id="is_default"
              name="is_default"
              defaultChecked={dateDefinition.is_default}
              aria-describedby="is_default-error"
            />
          </div>

          <div id="is_default-error" aria-live="polite" aria-atomic="true">
            {state.errors?.is_default?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* DateDefinition sort_order */}
        <div className="col-span-1 col-start-2 mb-4">
          <label
            htmlFor="sort_order"
            className="mb-2 block text-sm font-medium"
          >
            排序顺序
          </label>

          <div className="relative">
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={dateDefinition.sort_order}
              aria-describedby="sort_order-error"
            />
          </div>

          <div id="sort_order-error" aria-live="polite" aria-atomic="true">
            {state.errors?.sort_order?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/date-definitions"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          取消
        </Link>
        <Button type="submit">提交</Button>
      </div>
    </form>
  )
}
