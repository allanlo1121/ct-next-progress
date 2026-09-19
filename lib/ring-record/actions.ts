"use server"

import { getDb } from "../db"
import { RingRecord, RingRecordInput } from "./definition"

import {
  updateRingRecordStartAt,
  updateRingRecordStartAts,
} from "./repository"

export async function createRingRecord(
  input: RingRecordInput
): Promise<RingRecord> {
  const db = getDb()

  const result = db
    .prepare(
      `
      INSERT INTO tunnel_ring_records (
        tunnel_line_id,
        ring_no,
        start_at,
        source
      )
      VALUES (
        @tunnel_line_id,
        @ring_no,
        @start_at,
        @source
      )
    `
    )
    .run(input)

  return db
    .prepare(
      `
      SELECT
        id,
        tunnel_line_id,
        ring_no,
        start_at,
        source
      FROM tunnel_ring_records
      WHERE id = ?
    `
    )
    .get(result.lastInsertRowid) as RingRecord
}

export async function upsertRingRecord(input: RingRecordInput) {
  return getDb()
    .prepare(
      `
      INSERT INTO tunnel_ring_records (
        tunnel_line_id,
        ring_no,
        start_at
      )
      VALUES (
        @tunnel_line_id,
        @ring_no,
        @start_at
      )
      ON CONFLICT(tunnel_line_id, ring_no)
      DO UPDATE SET
        start_at = @start_at,
        end_at = @end_at,
        jue_duration = @jue_duration,
        pin_duration = @pin_duration,
        stop_duration = @stop_duration,
        status = @status
    `
    )
    .run(input)
}

export async function updateRingRecord(
  id: number,
  input: Pick<
    RingRecordInput,
    | "ring_no"
    | "start_at"
    | "end_at"
    | "jue_duration"
    | "pin_duration"
    | "stop_duration"
    | "status"
  >
): Promise<RingRecord> {
  const db = getDb()

  db.prepare(
    `
    UPDATE tunnel_ring_records
    SET
      ring_no = @ring_no,
      start_at = @start_at,
      end_at = @end_at,
      jue_duration = @jue_duration,
      pin_duration = @pin_duration,
      stop_duration = @stop_duration,
      status = @status
    WHERE id = @id
  `
  ).run({
    id,
    ...input,
  })

  return db
    .prepare(
      `
      SELECT
        id,
        tunnel_line_id,
        ring_no,
        start_at,
        end_at,
        jue_duration,
        pin_duration,
        stop_duration,
        status,
        source
      FROM tunnel_ring_records
      WHERE id = ?
    `
    )
    .get(id) as RingRecord
}

export async function saveNullRingRecord(
  tunnelLineId: number,
  startRing: number,
  endRing: number
) {
  if (
    !Number.isInteger(startRing) ||
    !Number.isInteger(endRing) ||
    startRing > endRing
  ) {
    throw new Error("无效的环号范围")
  }

  const db = getDb()

  const stmt = db.prepare(`
    INSERT INTO tunnel_ring_records (
      tunnel_line_id,
      ring_no,
      start_at,
      status,
      source
    )
    VALUES (
      @tunnel_line_id,
      @ring_no,
      NULL,
      'planned',
      'manual'
    )
    ON CONFLICT(tunnel_line_id, ring_no)
    DO NOTHING
  `)

  const insertMany = db.transaction(() => {
    for (let ringNo = startRing; ringNo <= endRing; ringNo++) {
      stmt.run({
        tunnel_line_id: tunnelLineId,
        ring_no: ringNo,
      })
    }
  })

  insertMany()
}

export async function updateRingRecordAction(id: number, startAt: string) {
  try {
    await updateRingRecordStartAt({ id, start_at: startAt })

    return {
      success: true,
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
    }
  }
}

type UpdateRingRecordCsvInput = {
  id: number
  start_at: string
}

export async function updateRingRecordsAction(
  input: UpdateRingRecordCsvInput[]
) {
  try {
    await updateRingRecordStartAts(input)
     return {
    success: true,
  }
  } catch (error) {
    console.error(`Failed to update ring records:`, error)
    return {
      success: false,
    }
  }

 
}
