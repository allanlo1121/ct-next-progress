import { upsertTunnelWithLines } from "@/lib/tunnel"
import type { TunnelWithLines } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TunnelWithLines

    if (!body?.name?.trim()) {
      return Response.json({ message: "请填写区间名称" }, { status: 400 })
    }

    if (!Array.isArray(body.lines) || body.lines.length === 0) {
      return Response.json({ message: "请至少保留一条线路" }, { status: 400 })
    }

    const tunnel = upsertTunnelWithLines(body)
    return Response.json({ tunnel })
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "保存失败",
      },
      { status: 500 }
    )
  }
}
