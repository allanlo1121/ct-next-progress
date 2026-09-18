import { RingRecord, RingCount } from "./definition"

export function getRingCountByTimeRangeFromData(
  data: RingRecord[],
  startAt: Date,
  endAt: Date
): RingCount {
  const startTime = startAt.getTime()
  const endTime = endAt.getTime()

  let startRingNo: number | null = null
  let endRingNo: number | null = null
  let startRingTime = Infinity
  let endRingTime = -Infinity

  for (const item of data) {
    if (!item.start_at) continue

    const time = new Date(item.start_at).getTime()

    if (Number.isNaN(time)) continue

    // startAt 之后最近的一环
    if (time > startTime && time < startRingTime) {
      startRingTime = time
      startRingNo = item.ring_no
    }

    // endAt 之前最近的一环
    if (time < endTime && time > endRingTime) {
      endRingTime = time
      endRingNo = item.ring_no
    }
  }

  return {
    startRingNo,
    endRingNo,
    ringCount:
      startRingNo !== null && endRingNo !== null ? endRingNo - startRingNo : 0,
  }
}
