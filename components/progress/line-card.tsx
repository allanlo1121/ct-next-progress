// import { lineData } from "@/lib/progress/data"
import { cn } from "cn"
import { jetbrains_mono } from "@/components/ui/fonts"
import { LineData, TbmProgress } from "@/lib/progress/definition"

import { differenceInDays } from "date-fns/fp/differenceInDays"
import { getTbmDayInfo } from "@/lib/date-definition/tbm-data"
import { RealtimeIndicator } from "./realtime-indicator"

export type LineCardVariant = "left" | "right"

export function LineCard({
  lineData,
  lastReceivedAt,
  now,
  timeoutSeconds,
  variant,
}: {
  lineData: LineData
  lastReceivedAt: number | null
  now: number
  timeoutSeconds: number
  variant: LineCardVariant
}) {
  const style = lineCardStyles[variant]
  return (
    <section
      className={cn(
        "relative flex h-full min-h-0 flex-row overflow-hidden rounded-2xl",
        style.border,
        "bg-slate-950/55 pb-4"
      )}
    >
      {/* <div className="pointer-events-none absolute top-0 -left-20 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" /> */}
      <div className="absolute top-3 left-3 z-10">
        <RealtimeIndicator
          label={lineData.line.name}
          lastReceivedAt={lastReceivedAt}
          now={now}
          timeout={timeoutSeconds}
        />
      </div>
      <div
        className={cn(
          "flex w-24 flex-none items-center justify-center bg-linear-to-b",
          style.title,
          "bg-clip-text text-7xl font-[900] tracking-[2rem] text-transparent [writing-mode:vertical-rl]"
        )}
      >
        {lineData.line.name}
      </div>
      <div className="grid flex-1 grid-rows-4 gap-x-4 gap-y-1 p-0">
        <ProgressMetric progress={lineData.totalProgress} />
        <ProgressMetric progress={lineData.weekProgress} />
        <ProgressMetric progress={lineData.monthProgress} />
        <ProgressMetric progress={lineData.quarterProgress} />
      </div>
    </section>
  )
}

function percent(value: number, total: number, digits = 0) {
  if (!total) return "0"

  return ((value / total) * 100).toFixed(digits)
}

function Metric({
  title,
  value,
  unit,
  desc,
}: {
  title: string
  value: string | number
  unit?: string
  desc?: string
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_160px_40px] items-center gap-4 bg-white/20 px-4 py-4 text-4xl font-black">
      <div className="text-right">
        <div className="tracking-widest text-brand-100">{title}</div>

        {desc ? <div className="text-base text-brand-300">{desc}</div> : null}
      </div>

      <strong
        className={`text-right text-6xl font-[800] text-brand-100 ${jetbrains_mono.className}`}
      >
        {value}
      </strong>
      <div className="text-brand-200">{unit || ""}</div>
    </div>
  )
}

function ProgressMetric({ progress }: { progress: TbmProgress }) {
  let planTitle = ""
  let actualTitle = ""
  let completionTitle = ""

  switch (progress.period.type) {
    case "custom":
      planTitle = "设计总量"
      actualTitle = "开累完成"
      completionTitle = "总完成比例"
      break
    case "day":
      planTitle = "日计划数"
      actualTitle = "日完成数"
      completionTitle = "日完成比例"
      break
    case "week":
      planTitle = "周计划数"
      actualTitle = "周完成数"
      completionTitle = "周完成比例"
      break
    case "month":
      planTitle = "月计划数"
      actualTitle = "月完成数"
      completionTitle = "月完成比例"
      break
    case "quarter":
      planTitle = "季计划数"
      actualTitle = "季完成数"
      completionTitle = "季完成比例"
      break
    case "year":
      planTitle = "年计划数"
      actualTitle = "年完成数"
      completionTitle = "年完成比例"
      break
  }

  const startDateString = progress.period.startDate
  const endDateString = progress.period.endDate
  // console.log(endDateString)
  const todayInfo = getTbmDayInfo(new Date())
  // console.log(todayInfo)
  const restDays = differenceInDays(
    new Date(todayInfo.startDate),
    new Date(endDateString)
  )
  return (
    <div className="grid w-full flex-1 grid-cols-3 gap-x-8 gap-y-1 p-4">
      <Metric
        title={planTitle}
        desc={`${startDateString} - ${endDateString}`}
        value={progress.plan}
        unit="环"
      />
      <Metric
        title={actualTitle}
        desc={`剩余天数: ${restDays}`}
        value={progress.actual.ringCount}
        unit="环"
      />
      <Metric
        title={completionTitle}
        value={percent(progress.actual.ringCount, progress.plan, 1)}
        unit="%"
      />
    </div>
  )
}

const lineCardStyles: Record<
  LineCardVariant,
  {
    border: string
    title: string
  }
> = {
  left: {
    border:
      "border-brand-600/50 border outline-4 outline-offset-4 outline-brand-300",
    title: "from-brand-500 to-cyan-500",
  },
  right: {
    border:
      "border-industrial-600/50 border outline-4 outline-offset-4 outline-industrial-300",
    title: "from-emerald-400 to-teal-500",
  },
}
