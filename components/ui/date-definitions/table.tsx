import {
  formatDayDefinition,
  formatWeekDefinition,
  formatMonthDefinition,
  formatYearDefinition,
} from "@/lib/date-definitions/utils"
import { UpdateDateDefinition, DeleteDateDefinition } from "./buttons"

import { fetchDateDefinitions } from "@/lib/date-definitions/data"

export default async function DateDefinitionsTable() {
  const dateDefinitions = await fetchDateDefinitions()

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <table className="hidden min-w-full text-gray-900 md:table">
          <thead className="rounded-lg bg-brand-100 text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                名称
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                工作日起点
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                周开始日
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                月度开始日
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                年度开始日
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                是否生效
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                排序
              </th>
              <th scope="col" className="relative py-3 pr-3 pl-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {dateDefinitions?.map((dateDefinition) => (
              <tr
                key={dateDefinition.id}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <p>{dateDefinition.name}</p>
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {formatDayDefinition(
                    dateDefinition.day_start_offset,
                    dateDefinition.day_start_time
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {formatWeekDefinition(
                    dateDefinition.week_start_offset,
                    dateDefinition.week_start_dow
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {formatMonthDefinition(
                    dateDefinition.month_start_offset,
                    dateDefinition.month_start_day
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {formatYearDefinition(
                    dateDefinition.year_start_offset,
                    dateDefinition.year_start_month,
                    dateDefinition.year_start_day
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {dateDefinition.is_default ? "是" : "否"}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {dateDefinition.sort_order}
                </td>
                <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                  <div className="flex justify-end gap-3">
                    <UpdateDateDefinition id={dateDefinition.id} />
                    <DeleteDateDefinition id={dateDefinition.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
