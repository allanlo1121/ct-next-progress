"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getDb } from "../db"

const TunnelLineFormSchema = z.object({
  id: z.coerce.number().int(),
  name: z.string(),
  start_ring: z.coerce.number().int(),
  end_ring: z.coerce.number().int(),
  actual_start_date: z.string().nullable(),
  actual_end_date: z.string().nullable(),
  scheduled_start_date: z.string().nullable(),
  scheduled_end_date: z.string().nullable(),
  sort_order: z.coerce.number().int().min(0, { message: "排序顺序不能小于 0" }),
})

const CreateTunnelLine = TunnelLineFormSchema.omit({ id: true })
const UpdateTunnelLine = TunnelLineFormSchema.omit({ id: true })

export type State = {
  errors?: {
    name?: string[]
    start_ring?: string[]
    end_ring?: string[]
    actual_start_date?: string[]
    actual_end_date?: string[]
    scheduled_start_date?: string[]
    scheduled_end_date?: string[]
    sort_order?: string[]
  }
  message?: string | null
}

export async function createTunnelLine(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  console.log("Form Data:", Object.fromEntries(formData.entries()))
  const validatedFields = CreateTunnelLine.safeParse({
    name: formData.get("name"),
    start_ring: formData.get("start_ring"),
    end_ring: formData.get("end_ring"),
    actual_start_date: formData.get("actual_start_date"),
    actual_end_date: formData.get("actual_end_date"),
    scheduled_start_date: formData.get("scheduled_start_date"),
    scheduled_end_date: formData.get("scheduled_end_date"),
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
    start_ring,
    end_ring,
    actual_start_date,
    actual_end_date,
    scheduled_start_date,
    scheduled_end_date,
    sort_order,
  } = validatedFields.data

  // Insert data into the database
  try {
    await getDb()
      .prepare(
        `INSERT INTO tunnel_lines (name, start_ring, end_ring, actual_start_date, actual_end_date, scheduled_start_date, scheduled_end_date, sort_order)
      VALUES (
      @name, @start_ring, @end_ring, @actual_start_date, @actual_end_date, @scheduled_start_date, @scheduled_end_date, @sort_order)`
      )
      .run({
        name,
        start_ring,
        end_ring,
        actual_start_date,
        actual_end_date,
        scheduled_start_date,
        scheduled_end_date,
        sort_order,
      })
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Tunnel.",
    }
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/tunnels")
  redirect("/tunnels")
}

export async function updateTunnelLine(
  id: number,
  prevState: State,
  formData: FormData
) {
  console.log("Updating Tunnel with ID:", id)
  console.log("Form Data:", Object.fromEntries(formData.entries()))
  const validatedFields = UpdateTunnelLine.safeParse({
    name: formData.get("name"),
    start_ring: formData.get("start_ring"),
    end_ring: formData.get("end_ring"),
    actual_start_date: formData.get("actual_start_date"),
    actual_end_date: formData.get("actual_end_date"),
    scheduled_start_date: formData.get("scheduled_start_date"),
    scheduled_end_date: formData.get("scheduled_end_date"),
    sort_order: formData.get("sort_order"),
  })

  if (!validatedFields.success) {
    console.log(
      "Validation errors:",
      validatedFields.error.flatten().fieldErrors
    )

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Tunnel.",
    }
  }

  const {
    name,
    start_ring,
    end_ring,
    actual_start_date,
    actual_end_date,
    scheduled_start_date,
    scheduled_end_date,
    sort_order,
  } = validatedFields.data

  console.log("Validated Fields:", validatedFields.data)

  try {
    const row = getDb()
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
        sort_order = @sort_order
      WHERE id = @id
      RETURNING tunnel_id
    `
      )
      .get({
        name,
        start_ring,
        end_ring,
        actual_start_date,
        actual_end_date,
        scheduled_start_date,
        scheduled_end_date,
        sort_order,
        id,
      }) as { tunnel_id: number } | undefined

    if (!row) {
      return {
        message: "Tunnel line not found.",
      }
    }

    revalidatePath(`/tunnels/${row.tunnel_id}/edit`)

    return {
      message: "保存成功",
    }
  } catch (error) {
    console.error("Failed to update tunnel line:", error)

    return {
      message: "Database Error: Failed to Update Tunnel Line.",
    }
  }
}

export async function deleteTunnelLine(id: number) {
  await getDb().prepare(`DELETE FROM tunnel_lines WHERE id = @id`).run({ id })
  revalidatePath("/tunnels")
  redirect("/tunnels")
}
