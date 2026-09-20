"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RealtimeIndicator } from "./realtime-indicator"

const TIMEOUT_SECONDS = 60

export function ProgressRealtime() {
  const router = useRouter()

  const [leftLastReceivedAt, setLeftLastReceivedAt] = useState<number | null>(
    null
  )

  const [rightLastReceivedAt, setRightLastReceivedAt] = useState<number | null>(
    null
  )

  const [now, setNow] = useState(() => Date.now())

  // SSE
  useEffect(() => {
    const eventSource = new EventSource("/api/events")

    eventSource.addEventListener("progress-updated-1", () => {
      console.log("收到 progress-updated，准备 refresh")
      setLeftLastReceivedAt(Date.now())
      router.refresh()
    })

    eventSource.addEventListener("progress-updated-2", () => {
      console.log("收到 progress-updated-2，准备 refresh")
      setRightLastReceivedAt(Date.now())
      router.refresh()
    })

    return () => {
      eventSource.close()
    }
  }, [router])

  // 两条线共用一个计时器
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <RealtimeIndicator
        label="左线"
        lastReceivedAt={leftLastReceivedAt}
        now={now}
        timeout={TIMEOUT_SECONDS}
      />

      <RealtimeIndicator
        label="右线"
        lastReceivedAt={rightLastReceivedAt}
        now={now}
        timeout={TIMEOUT_SECONDS}
      />
    </div>
  )
}
