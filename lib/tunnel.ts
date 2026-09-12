import { randomUUID } from "node:crypto"
import { getDb } from "./db"
import type { Tunnel, TunnelLine, TunnelWithLines } from "./types"

export function listTunnels() {
  return getDb()
    .prepare("SELECT * FROM tunnels ORDER BY sort_order ASC, name ASC")
    .all() as Tunnel[]
}

export function listTunnelLines() {
  return getDb()
    .prepare("SELECT * FROM tunnel_lines ORDER BY sort_order ASC, name ASC")
    .all() as TunnelLine[]
}

export function listTunnelWithLines() {
  const tunnels = listTunnels()
  const lines = listTunnelLines()

  return tunnels.map((tunnel) => ({
    ...tunnel,
    lines: lines.filter((line) => line.tunnel_id === tunnel.id),
  }))
}

function text(value: unknown) {
  if (typeof value !== "string") return null
  const next = value.trim()
  return next || null
}

function requiredText(value: unknown, fallback = "") {
  return text(value) || fallback
}

function numberOrNull(value: unknown) {
  if (value === "" || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function intOrZero(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.trunc(number) : 0
}

export function upsertTunnelWithLines(input: TunnelWithLines) {
  const db = getDb()
  const tunnel: Tunnel = {
    id: requiredText(input.id, randomUUID()),
    project_name: text(input.project_name),
    name: requiredText(input.name, "未命名区间"),
    full_name: text(input.full_name),
    line_mode: input.line_mode === "single" ? "single" : "double",
    description: text(input.description),
    sort_order: intOrZero(input.sort_order),
  }

  const rawLines = Array.isArray(input.lines) ? input.lines : []
  const lines: TunnelLine[] = rawLines.map((line, index) => ({
    id: requiredText(line.id, `${tunnel.id}-line-${index + 1}`),
    tunnel_id: tunnel.id,
    name: requiredText(line.name, `线路${index + 1}`),
    prefix: text(line.prefix),
    start_chainage: numberOrNull(line.start_chainage),
    end_chainage: numberOrNull(line.end_chainage),
    length_adjustment: numberOrNull(line.length_adjustment),
    advance_direction:
      line.advance_direction === "chainage_decrease"
        ? "chainage_decrease"
        : "chainage_increase",
    start_ring: intOrZero(line.start_ring),
    end_ring: numberOrNull(line.end_ring),
    actual_start_date: text(line.actual_start_date),
    actual_end_date: text(line.actual_end_date),
    scheduled_start_date: text(line.scheduled_start_date),
    scheduled_end_date: text(line.scheduled_end_date),
    sort_order: intOrZero(line.sort_order || index + 1),
  }))

  const save = db.transaction(() => {
    db.prepare(
      `INSERT INTO tunnels (
        id, project_name, name, full_name, line_mode, description, sort_order
      ) VALUES (
        @id, @project_name, @name, @full_name, @line_mode, @description, @sort_order
      )
      ON CONFLICT(id) DO UPDATE SET
        project_name = excluded.project_name,
        name = excluded.name,
        full_name = excluded.full_name,
        line_mode = excluded.line_mode,
        description = excluded.description,
        sort_order = excluded.sort_order`
    ).run(tunnel)

    const keepIds = new Set(lines.map((line) => line.id))
    const currentLines = db
      .prepare("SELECT id FROM tunnel_lines WHERE tunnel_id = ?")
      .all(tunnel.id) as Array<{ id: string }>

    for (const currentLine of currentLines) {
      if (!keepIds.has(currentLine.id)) {
        db.prepare("DELETE FROM tunnel_lines WHERE id = ?").run(currentLine.id)
      }
    }

    const upsertLine = db.prepare(
      `INSERT INTO tunnel_lines (
        id, tunnel_id, name, prefix, start_chainage, end_chainage,
        length_adjustment, advance_direction, start_ring, end_ring,
        actual_start_date, actual_end_date, scheduled_start_date,
        scheduled_end_date, sort_order
      ) VALUES (
        @id, @tunnel_id, @name, @prefix, @start_chainage, @end_chainage,
        @length_adjustment, @advance_direction, @start_ring, @end_ring,
        @actual_start_date, @actual_end_date, @scheduled_start_date,
        @scheduled_end_date, @sort_order
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        prefix = excluded.prefix,
        start_chainage = excluded.start_chainage,
        end_chainage = excluded.end_chainage,
        length_adjustment = excluded.length_adjustment,
        advance_direction = excluded.advance_direction,
        start_ring = excluded.start_ring,
        end_ring = excluded.end_ring,
        actual_start_date = excluded.actual_start_date,
        actual_end_date = excluded.actual_end_date,
        scheduled_start_date = excluded.scheduled_start_date,
        scheduled_end_date = excluded.scheduled_end_date,
        sort_order = excluded.sort_order`
    )

    for (const line of lines) {
      upsertLine.run(line)
    }
  })

  save()

  return {
    ...tunnel,
    lines,
  }
}
