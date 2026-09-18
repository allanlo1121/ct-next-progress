import { getDb } from "../db"
import type { Plan, PlanInput } from "./definition"

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

export function fetchPlansByTunnelLineId(tunnelLineId: number): PlanInput[] {
  return getDb()
    .prepare(
      `
      SELECT 
      tunnel_line_id,
      work_date,
      plan_ring_count
      FROM tunnel_plan_days
      WHERE tunnel_line_id = @tunnelLineId
      ORDER BY work_date
    `
    )
    .all({
      tunnelLineId,
    }) as PlanInput[]
}

export function getPlanRingCount(
  tunnelLineId: number,
  startDate: string,
  endDate: string
): number {
  const row = getDb()
    .prepare(
      `
      SELECT
        COALESCE(SUM(plan_ring_count), 0) AS total
      FROM tunnel_plan_days
      WHERE tunnel_line_id = @tunnelLineId
        AND work_date BETWEEN @startDate AND @endDate
    `
    )
    .get({
      tunnelLineId,
      startDate,
      endDate,
    }) as { total: number }

  return row.total
}

export function updatePlan(input: PlanInput): Plan {
  const db = getDb()

  return db
    .prepare(
      `
      INSERT INTO tunnel_plan_days (
        tunnel_line_id,
        work_date,
        plan_ring_count
      )
      VALUES (
        @tunnel_line_id,
        @work_date,
        @plan_ring_count
      )
      ON CONFLICT(tunnel_line_id, work_date)
      DO UPDATE SET
        plan_ring_count = excluded.plan_ring_count
      RETURNING *
    `
    )
    .get(input) as Plan
}

export function updatePlans(inputs: PlanInput[]): void {
  if (inputs.length === 0) {
    return
  }

  const db = getDb()

  const statement = db.prepare(`
    INSERT INTO tunnel_plan_days (
      tunnel_line_id,
      work_date,
      plan_ring_count
    )
    VALUES (
      @tunnel_line_id,
      @work_date,
      @plan_ring_count
    )
    ON CONFLICT(tunnel_line_id, work_date)
    DO UPDATE SET
      plan_ring_count = excluded.plan_ring_count
  `)

  const updateMany = db.transaction((inputs: PlanInput[]) => {
    for (const input of inputs) {
      statement.run(input)
    }
  })

  updateMany(inputs)
}
