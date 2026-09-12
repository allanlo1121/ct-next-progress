import { getDb } from "../db"
import type { Tunnel, TunnelLine, TunnelWithLines } from "./definition"

export async function fetchTunnels(): Promise<Tunnel[]> {
  const rows = getDb()
    .prepare(
      `
      SELECT *
      FROM tunnels
      ORDER BY sort_order ASC, name ASC
    `
    )
    .all() as Tunnel[]

  return rows ?? []
}

export async function fetchTunnelById(id: number): Promise<Tunnel | null> {
  const row = getDb()
    .prepare(
      `
      SELECT *
      FROM tunnels
      WHERE id = @id
      LIMIT 1
    `
    )
    .get({ id }) as Tunnel | undefined

  return row ?? null
}

export async function fetchTunnelLines(): Promise<TunnelLine[]> {
  const rows = getDb()
    .prepare(
      `
      SELECT *
      FROM tunnel_lines
      ORDER BY sort_order ASC, name ASC
    `
    )
    .all() as TunnelLine[]

  return rows ?? []
}

export async function fetchTunnelLinesById(id: number): Promise<TunnelLine[]> {
  const row = getDb()
    .prepare(
      `
      SELECT *
      FROM tunnel_lines
      WHERE tunnel_id = @id
      ORDER BY sort_order ASC, name ASC
    `
    )
    .all({ id }) as TunnelLine[]

  return row ?? []
}

export async function fetchTunnelWithLines(): Promise<TunnelWithLines[]> {
  const tunnels = await fetchTunnels()
  const lines = await fetchTunnelLines()

  return tunnels.map((tunnel) => ({
    ...tunnel,
    lines: lines.filter((line) => line.tunnel_id === tunnel.id),
  }))
}

export async function fetchTunnelWithLinesById(
  id: number
): Promise<TunnelWithLines | null> {
  const tunnel = await fetchTunnelById(id)
  const lines = await fetchTunnelLinesById(id)

  if (!tunnel) {
    return null
  }

  return {
    ...tunnel,
    lines,
  }
}
