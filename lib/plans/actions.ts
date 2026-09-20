"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getDb } from "../db"
import { PlanInput } from "./definition"
import { updatePlan, updatePlans } from "./repository"

const FormSchema = z.object({
  id: z.number(),
  name: z.string(),
  day_start_offset: z.coerce
    .number()
    .int()
    .min(-1, { message: "请在-1 0 1 之间选一个" })
    .max(0, { message: "请在-1 0 1 之间选一个" }),
  day_start_time: z.coerce
    .number()
    .int()
    .min(0, { message: "请在 0 23 之间选一个" })
    .max(23, { message: "请在 0 23 之间选一个" }),
  week_start_offset: z.coerce
    .number()
    .int()
    .min(-1, { message: "请在-1 0 1 之间选一个" })
    .max(0, { message: "请在-1 0 1 之间选一个" }),
  week_start_dow: z.coerce
    .number()
    .int()
    .min(1, { message: "请在 1 7 之间选一个" })
    .max(7, { message: "请在 1 7 之间选一个" }),
  month_start_offset: z.coerce
    .number()
    .int()
    .min(-1, { message: "请在-1 0 1 之间选一个" })
    .max(0, { message: "请在-1 0 1 之间选一个" }),
  month_start_day: z.coerce
    .number()
    .int()
    .min(1, { message: "请在 1 31 之间选一个" })
    .max(31, { message: "请在 1 31 之间选一个" }),
  year_start_offset: z.coerce
    .number()
    .int()
    .min(-1, { message: "请在-1 0 1 之间选一个" })
    .max(0, { message: "请在-1 0 1 之间选一个" }),
  year_start_month: z.coerce
    .number()
    .int()
    .min(1, { message: "请在 1 12 之间选一个" })
    .max(12, { message: "请在 1 12 之间选一个" }),
  year_start_day: z.coerce
    .number()
    .int()
    .min(1, { message: "请在 1 31 之间选一个" })
    .max(31, { message: "请在 1 31 之间选一个" }),
  is_default: z
    .string()
    .nullish()
    .transform((value) => value === "on"),
  sort_order: z.coerce.number().int().min(0, { message: "排序顺序不能小于 0" }),
})

const CreateDateDefinition = FormSchema.omit({ id: true })
const UpdateDateDefinition = FormSchema.omit({ id: true })

export type State = {
  errors?: {
    name?: string[]
    day_start_offset?: string[]
    day_start_time?: string[]
    week_start_offset?: string[]
    week_start_dow?: string[]
    month_start_offset?: string[]
    month_start_day?: string[]
    year_start_offset?: string[]
    year_start_month?: string[]
    year_start_day?: string[]
    is_default?: string[]
    sort_order?: string[]
  }
  message?: string | null
}

export async function createDateDefinition(
  prevState: State,
  formData: FormData
) {
  // Validate form fields using Zod
  // console.log("Form Data:", Object.fromEntries(formData.entries()))
  const validatedFields = CreateDateDefinition.safeParse({
    name: formData.get("name"),
    day_start_offset: formData.get("day_start_offset"),
    day_start_time: formData.get("day_start_time"),
    week_start_offset: formData.get("week_start_offset"),
    week_start_dow: formData.get("week_start_dow"),
    month_start_offset: formData.get("month_start_offset"),
    month_start_day: formData.get("month_start_day"),
    year_start_offset: formData.get("year_start_offset"),
    year_start_month: formData.get("year_start_month"),
    year_start_day: formData.get("year_start_day"),
    is_default: formData.get("is_default"),
    sort_order: formData.get("sort_order"),
  })

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Date-Definition.",
    }
  }

  // Prepare data for insertion into the database
  const {
    name,
    day_start_offset,
    day_start_time,
    week_start_offset,
    week_start_dow,
    month_start_offset,
    month_start_day,
    year_start_offset,
    year_start_month,
    year_start_day,
    is_default,
    sort_order,
  } = validatedFields.data

  // Insert data into the database
  try {
    await getDb()
      .prepare(
        `INSERT INTO date_definitions (name, day_start_offset, day_start_time, week_start_offset, week_start_dow,month_start_offset, month_start_day, year_start_offset, year_start_month, year_start_day, is_default, sort_order)
      VALUES (
      @name, @day_start_offset, @day_start_time, @week_start_offset, @week_start_dow, @month_start_offset, @month_start_day, @year_start_offset, @year_start_month, @year_start_day, @is_default, @sort_order)`
      )
      .run({
        name,
        day_start_offset,
        day_start_time,
        week_start_offset,
        week_start_dow,
        month_start_offset,
        month_start_day,
        year_start_offset,
        year_start_month,
        year_start_day,
        is_default: is_default ? 1 : 0,
        sort_order,
      })
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Date-Definition.",
    }
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/date-definitions")
  redirect("/date-definitions")
}

export async function updateDateDefinition(
  id: number,
  prevState: State,
  formData: FormData
) {
  // console.log("Updating Date Definition with ID:", id)
  // console.log("Form Data:", Object.fromEntries(formData.entries()))
  const validatedFields = UpdateDateDefinition.safeParse({
    name: formData.get("name"),
    day_start_offset: formData.get("day_start_offset"),
    day_start_time: formData.get("day_start_time"),
    week_start_offset: formData.get("week_start_offset"),
    week_start_dow: formData.get("week_start_dow"),
    month_start_offset: formData.get("month_start_offset"),
    month_start_day: formData.get("month_start_day"),
    year_start_offset: formData.get("year_start_offset"),
    year_start_month: formData.get("year_start_month"),
    year_start_day: formData.get("year_start_day"),
    is_default: formData.get("is_default"),
    sort_order: formData.get("sort_order"),
  })

  if (!validatedFields.success) {
    console.log(
      "Validation errors:",
      validatedFields.error.flatten().fieldErrors
    )

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Date-Definition.",
    }
  }

  const {
    name,
    day_start_offset,
    day_start_time,
    week_start_offset,
    week_start_dow,
    month_start_offset,
    month_start_day,
    year_start_offset,
    year_start_month,
    year_start_day,
    is_default,
    sort_order,
  } = validatedFields.data

  // console.log("Validated Fields:", validatedFields.data)

  try {
    await getDb()
      .prepare(
        `
      UPDATE date_definitions
      SET name = @name, day_start_offset = @day_start_offset, day_start_time = @day_start_time, week_start_offset = @week_start_offset, week_start_dow = @week_start_dow, month_start_offset = @month_start_offset, month_start_day = @month_start_day, year_start_offset = @year_start_offset, year_start_month = @year_start_month, year_start_day = @year_start_day, is_default = @is_default, sort_order = @sort_order
      WHERE id = @id
      `
      )
      .run({
        name,
        day_start_offset,
        day_start_time,
        week_start_offset,
        week_start_dow,
        month_start_offset,
        month_start_day,
        year_start_offset,
        year_start_month,
        year_start_day,
        is_default: is_default ? 1 : 0,
        sort_order,
        id,
      })
  } catch (error) {
    console.error("Failed to update date definition:", error)
    return { message: "Database Error: Failed to Update Date-Definition." }
  }

  revalidatePath("/date-definitions")
  redirect("/date-definitions")
}

export async function deleteDateDefinition(id: number) {
  await getDb()
    .prepare(`DELETE FROM date_definitions WHERE id = @id`)
    .run({ id })
  revalidatePath("/date-definitions")
}

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
