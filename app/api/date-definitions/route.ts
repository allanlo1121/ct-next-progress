import { upsertDateDefinitions } from "@/lib/date-definitions"
import type { DateDefinition } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DateDefinition[]

    if (!Array.isArray(body) || body.length === 0) {
      return Response.json({ message: "请至少保留一条日期定义" }, { status: 400 })
    }

    for (const definition of body) {
      if (!definition.name?.trim()) {
        return Response.json({ message: "请填写周期名称" }, { status: 400 })
      }

      if (!definition.day_cutoff_time?.trim()) {
        return Response.json(
          { message: "请填写日切换时间" },
          { status: 400 }
        )
      }

      if (
        definition.period_type === "work_day" &&
        ![-1, 0, 1].includes(definition.day_start_offset)
      ) {
        return Response.json(
          { message: "当天开始日期只能选择上一自然日、本自然日或下一自然日" },
          { status: 400 }
        )
      }

      if (
        definition.period_type === "week" &&
        (definition.week_cutoff_dow === null ||
          definition.week_cutoff_dow < 0 ||
          definition.week_cutoff_dow > 6)
      ) {
        return Response.json(
          { message: "请选择周统计切换星期" },
          { status: 400 }
        )
      }

      if (
        (definition.period_type === "month" ||
          definition.period_type === "quarter") &&
        (definition.month_cutoff_day === null ||
          definition.month_cutoff_day < 1 ||
          definition.month_cutoff_day > 31)
      ) {
        return Response.json(
          { message: "月/季度切换日必须在 1 到 31 之间" },
          { status: 400 }
        )
      }
    }

    const definitions = upsertDateDefinitions(body)
    return Response.json({ definitions })
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "保存失败",
      },
      { status: 500 }
    )
  }
}
