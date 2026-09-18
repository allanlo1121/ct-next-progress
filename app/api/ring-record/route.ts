
import { NextRequest, NextResponse } from "next/server"
import { broadcast } from "@/lib/realtime"
import { upsertRingRecord } from "@/lib/ring-record/actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      tunnelLineId,
      ringNo,
      startAt,
      endAt,
      jueDuration,
      pinDuration,
      stopDuration,
      status,
    } = body

    if (!tunnelLineId || ringNo == null || !startAt) {
      return NextResponse.json(
        {
          success: false,
          message: "参数不完整",
        },
        {
          status: 400,
        }
      )
    }

    await upsertRingRecord({
      tunnel_line_id: tunnelLineId,
      ring_no: ringNo,
      start_at: startAt,
      end_at: endAt,
      jue_duration: jueDuration,
      pin_duration: pinDuration,
      stop_duration: stopDuration,
      status: status ?? "planned",
      source: "auto",
    })

    broadcast(`progress-updated-${tunnelLineId}`)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("接收盾构进度失败:", error)

    return NextResponse.json(
      {
        success: false,
        message: "服务器内部错误",
      },
      {
        status: 500,
      }
    )
  }
}
