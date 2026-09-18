export type RingRecordSource = "auto" | "manual"
export type RingStatus = "planned" | "in_progress" | "completed"

export type RingRecord = {
  id: number
  tunnel_line_id: number
  ring_no: number
  start_at: string
  end_at: string | null
  jue_duration: number
  pin_duration: number
  stop_duration: number
  status: RingStatus
  source: RingRecordSource
}

export type RingRecordCsvRow = Pick<
  RingRecord,
  "tunnel_line_id" | "ring_no" | "start_at"
>

export type RingStartAtUpdate = Pick<RingRecord, "id" | "start_at">

export type RingRecordInput = Omit<RingRecord, "id">

export type RingCount = {
  startRingNo: number | null
  endRingNo: number | null
  ringCount: number
}
