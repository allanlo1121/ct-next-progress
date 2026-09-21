"use server"

import { getDb } from "../db"
import { PlanInput } from "./definition"
import { updatePlan, updatePlans } from "./repository"



export async function savePlans(plans: PlanInput[]) {
  const db = getDb()

  const stmt = db.prepare(`
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

  const transaction = db.transaction((plans: PlanInput[]) => {
    for (const plan of plans) {
      stmt.run(plan)
    }
  })

  transaction(plans)

  return { success: true }
}

export async function updatePlanAction(input: PlanInput) {
  try {
    await updatePlan(input)

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

export async function updatePlansAction(inputs: PlanInput[]) {
  try {
    await updatePlans(inputs)
    return {
      success: true,
    }
  } catch (error) {
    console.error(`Failed to update plan records:`, error)
    return {
      success: false,
    }
  }
}
