"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LineData } from "@/lib/progress/definition"
import { LineCard, LineCardVariant } from "@/components/progress/line-card"

const TIMEOUT_SECONDS = 60

export function ProgressRealtime({ line , variant }: { line: LineData, variant: LineCardVariant }) {
  const router = useRouter()

  const [lastReceivedAt, setLastReceivedAt] = useState<number | null>(null)

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const eventSource = new EventSource("/api/events")

    const handleUpdate = () => {
      setLastReceivedAt(Date.now())
      router.refresh()
    }

    eventSource.addEventListener(
      `progress-updated-${line?.line.id ?? 1}`,
      handleUpdate
    )

    return () => {
      eventSource.removeEventListener(
        `progress-updated-${line?.line.id ?? 1}`,
        handleUpdate
      )
      eventSource.close()
    }
  }, [router, line?.line.id])

  return (
    <div className="min-h-0 gap-4">
      <LineCard
        lineData={line}
        lastReceivedAt={lastReceivedAt}
        now={now}
        timeoutSeconds={TIMEOUT_SECONDS}
        variant={variant}
      />
    </div>
  )
}
