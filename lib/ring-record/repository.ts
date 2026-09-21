import { getDb } from "../db"

import type {
  RingRecord,
  RingCount,
  RingRecordInput,
  RingStartAtUpdate,
} from "./definition"

// export async function fetchDateDefinitions(): Promise<DateDefinition[]> {
//   const rows = getDb()
//     .prepare(
//       `
//       SELECT *
//       FROM date_definitions
//       ORDER BY sort_order ASC, name ASC
//     `
//     )
//     .all() as DateDefinition[]

//   return rows.map((row) => ({
//     ...row,
//     is_default: row.is_default,
//   }))
// }

export async function fetchRingRecordsByTunnelLineId(
  tunnelLineId: number
): Promise<RingRecord[]> {
  return getDb()
    .prepare(
      `
      SELECT *
      FROM tunnel_ring_records
      WHERE tunnel_line_id = @tunnelLineId
      ORDER BY ring_no
    `
    )
    .all({
      tunnelLineId,
    }) as RingRecord[]
}

export function getRingCountByTimeRange(
  tunnelLineId: number,
  startAt: Date,
  endAt: Date
): RingCount {
  const startAtIso = startAt.toISOString()
  const endAtIso = endAt.toISOString()

  const row = getDb()
    .prepare(
      `
      SELECT
        (
          SELECT ring_no
          FROM tunnel_ring_records
          WHERE tunnel_line_id = @tunnelLineId
            AND start_at IS NOT NULL
            AND start_at <= @startAtIso
          ORDER BY start_at DESC
          LIMIT 1
        ) AS start_ring_no,

        (
          SELECT ring_no
          FROM tunnel_ring_records
          WHERE tunnel_line_id = @tunnelLineId
            AND start_at IS NOT NULL
            AND start_at < @endAtIso
          ORDER BY start_at DESC
          LIMIT 1
        ) AS end_ring_no
      `
    )
    .get({
      tunnelLineId,
      startAtIso,
      endAtIso,
    }) as {
      start_ring_no: number | null
      end_ring_no: number | null
    }

  const startRingNo = row.start_ring_no ?? 0
  const endRingNo = row.end_ring_no ?? startRingNo

  return {
    startRingNo,
    endRingNo,
    ringCount: Math.max(0, endRingNo - startRingNo),
  }
}

export function updateSimpleRingRecord(
  id: number,
  input: Pick<RingRecordInput, "start_at">
): RingRecord {
  const db = getDb()

  db.prepare(
    `
    UPDATE tunnel_ring_records
    SET start_at = @start_at
    WHERE id = @id
  `
  ).run({
    id,
    ...input,
  })

  return db
    .prepare(
      `
      SELECT *
      FROM tunnel_ring_records
      WHERE id = ?
    `
    )
    .get(id) as RingRecord
}

export function updateRingRecordStartAt(input: RingStartAtUpdate): RingRecord {
  const db = getDb()

  const update = db.transaction(() => {
    // 1. 更新当前环 start_at
    db.prepare(
      `
      UPDATE tunnel_ring_records
      SET start_at = @start_at
      WHERE id = @id
    `
    ).run({
      ...input,
    })

    // 2. 更新上一环 end_at
    db.prepare(
      `
      UPDATE tunnel_ring_records
      SET end_at = @start_at
      WHERE id = (
        SELECT prev.id
        FROM tunnel_ring_records AS prev
        JOIN tunnel_ring_records AS current
          ON prev.tunnel_line_id = current.tunnel_line_id
        WHERE current.id = @id
          AND prev.ring_no < current.ring_no
        ORDER BY prev.ring_no DESC
        LIMIT 1
      )
    `
    ).run({
      ...input,
    })
  })

  update()

  return db
    .prepare(
      `
      SELECT *
      FROM tunnel_ring_records
      WHERE id = ?
    `
    )
    .get(input.id) as RingRecord
}

export function updateRingRecordStartAts(records: RingStartAtUpdate[]): void {
  if (records.length === 0) {
    return
  }

  const db = getDb()

  const updateCurrent = db.prepare(`
    UPDATE tunnel_ring_records
    SET start_at = @start_at
    WHERE id = @id
  `)

  const updatePrevious = db.prepare(`
    UPDATE tunnel_ring_records
    SET end_at = @start_at
    WHERE id = (
      SELECT prev.id
      FROM tunnel_ring_records AS prev
      JOIN tunnel_ring_records AS current
        ON prev.tunnel_line_id = current.tunnel_line_id
      WHERE current.id = @id
        AND prev.ring_no < current.ring_no
      ORDER BY prev.ring_no DESC
      LIMIT 1
    )
  `)

  const updateMany = db.transaction((records: RingStartAtUpdate[]) => {
    for (const record of records) {
      updateCurrent.run(record)

      updatePrevious.run(record)
    }
  })

  updateMany(records)
}


