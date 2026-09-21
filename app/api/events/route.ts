// app/api/events/route.ts

import { subscribe } from "@/lib/realtime"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  console.log("SSE connection opened")

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // 先发一条，确保连接真正建立
      controller.enqueue(encoder.encode(`event: connected\ndata: {}\n\n`))

      const unsubscribe = subscribe((event) => {
        console.log("Sending SSE event:", event)

        controller.enqueue(encoder.encode(`event: ${event}\ndata: {}\n\n`))
      })

      request.signal.addEventListener("abort", () => {
        console.log("SSE connection closed")

        unsubscribe()

        try {
          controller.close()
        } catch {
          // already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
