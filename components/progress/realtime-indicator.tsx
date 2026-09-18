type RealtimeIndicatorProps = {
  label: string
  lastReceivedAt: number | null
  now: number
  timeout?: number
}

export function RealtimeIndicator({
  label,
  lastReceivedAt,
  now,
  timeout = 60,
}: RealtimeIndicatorProps) {
  const size = 30
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const elapsed =
    lastReceivedAt === null
      ? null
      : Math.floor(
          (now - lastReceivedAt) / 1000
        )

  const remaining =
    elapsed === null
      ? 0
      : Math.max(timeout - elapsed, 0)

  const offlineSeconds =
    elapsed === null
      ? 0
      : Math.max(elapsed - timeout, 0)

  const waiting = lastReceivedAt === null
  const online = !waiting && remaining > 0

  const progress = online
    ? remaining / timeout
    : 1

  const offset =
    circumference * (1 - progress)

  return (
    <div
      className="flex items-center gap-1.5"
      title={
        waiting
          ? `${label}：等待实时数据`
          : online
            ? `${label}：${remaining} 秒后超时`
            : `${label}：已断线 ${formatDuration(
                offlineSeconds
              )}`
      }
    >
      <div className="relative size-[30px]">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="size-full -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={-offset}
            className={
              waiting
                ? "text-muted-foreground"
                : online
                  ? "text-emerald-500 transition-[stroke-dashoffset] duration-1000 ease-linear"
                  : "text-destructive"
            }
          />
        </svg>

        <span
          className={`absolute inset-0 flex items-center justify-center text-[8px] font-medium tabular-nums ${
            !waiting && !online
              ? "text-destructive"
              : ""
          }`}
        >
          {waiting
            ? "--"
            : online
              ? remaining
              : formatDuration(offlineSeconds)}
        </span>
      </div>

      <span className="text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`
  }

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`
  }

  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h`
  }

  return `${Math.floor(seconds / 86400)}d`
}