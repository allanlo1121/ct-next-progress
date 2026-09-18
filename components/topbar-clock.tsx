"use client"

import { useEffect, useState } from "react"

export function TopBarClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    let interval: number

    const timeout = window.setTimeout(
      () => {
        setNow(new Date())

        interval = window.setInterval(() => {
          setNow(new Date())
        }, 1000)
      },
      1000 - (Date.now() % 1000)
    )

    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [])

  if (!now) {
    return <div className="h-7 w-60" />
  }

  const date = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)

  const weekday = new Intl.DateTimeFormat("zh-CN", {
    weekday: "long",
  }).format(now)

  const time = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now)

  return (
    <div className="flex items-baseline gap-3 tabular-nums">
      <span className="text-xs text-cyan-100/50">
        {date} {weekday}
      </span>

      <span className="text-xl font-semibold tracking-wider text-cyan-50">
        {time}
      </span>
    </div>
  )
}
