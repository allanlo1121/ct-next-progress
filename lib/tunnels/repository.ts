import { getDb } from "@/lib/db"
import { TunnelForm, TunnelLineForm } from "./definition"

export function updateTunnelById(id: number, data: Partial<TunnelForm>) {
  try {
    getDb()
      .prepare(
        `
      UPDATE tunnels
        SET name = @name,
        project_name = @project_name, 
        full_name = @full_name, 
        line_mode = @line_mode, 
        updated_at = @updated_at
      WHERE id = @id
      `
      )
      .run({
        ...data,
        updated_at: new Date().toISOString(),
        id,
      })
  } catch (error) {
    console.error("Failed to update tunnel by ID:", error)
    throw new Error("Database Error: Failed to Update Tunnel.")
  }
}

export function updateTunnelLineById(
  id: number,
  data: Partial<TunnelLineForm>
) {
  try {
    getDb()
      .prepare(
        `
      UPDATE tunnel_lines
        SET
        name = @name,
        start_ring = @start_ring,
        end_ring = @end_ring,
        actual_start_date = @actual_start_date,
        actual_end_date = @actual_end_date,
        scheduled_start_date = @scheduled_start_date,
        scheduled_end_date = @scheduled_end_date,
        sort_order = @sort_order,
        updated_at = @updated_at
      WHERE id = @id
      `
      )
      .run({
        ...data,
        updated_at: new Date().toISOString(),
        id,
      })
  } catch (error) {
    console.error("Failed to update tunnel line by ID:", error)
    throw new Error("Database Error: Failed to Update Tunnel Line.")
  }
}

import type { Tunnel, TunnelLine, TunnelWithLines } from "./definition"

export function fetchTunnels(): Tunnel[] {
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

export function fetchTunnelById(id: number): Tunnel | null {
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

export function fetchTunnelLines(): TunnelLine[] {
  const rows = getDb()
    .prepare(
      `
      SELECT *
      FROM tunnel_lines
      ORDER BY sort_order ASC, id ASC
    `
    )
    .all() as TunnelLine[]

  return rows ?? []
}

export function fetchTunnelLinesById(id: number): TunnelLine | null {
  const row = getDb()
    .prepare(
      `
      SELECT *
      FROM tunnel_lines
      WHERE id = @id
      ORDER BY sort_order ASC, name ASC
    `
    )
    .get({ id }) as TunnelLine | undefined

  return row ?? null
}

export function fetchTunnelLinesByTunnelId(id: number): TunnelLine[] {
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

export function fetchTunnelWithLines(): TunnelWithLines[] {
  const tunnels = fetchTunnels()
  const lines = fetchTunnelLines()

  return tunnels.map((tunnel) => ({
    ...tunnel,
    lines: lines.filter((line) => line.tunnel_id === tunnel.id),
  }))
}

export function fetchTunnelWithLinesById(id: number): TunnelWithLines | null {
  const tunnel = fetchTunnelById(id)
  const lines = fetchTunnelLinesByTunnelId(id)

  if (!tunnel) {
    return null
  }

  return {
    ...tunnel,
    lines,
  }
}
