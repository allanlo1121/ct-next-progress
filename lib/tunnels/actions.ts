"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"

const TunnelFormSchema = z.object({
  id: z.number(),
  name: z.string(),
  project_name: z.string(),
  full_name: z.string(),
  line_mode: z.enum(["single", "double"]),
  description: z.string(),
  sort_order: z.coerce.number().int().min(0, { message: "排序顺序不能小于 0" }),
})

export type State = {
  errors?: {
    name?: string[]
    project_name?: string[]
    full_name?: string[]
    line_mode?: string[]
    description?: string[]
    sort_order?: string[]
  }
  message?: string | null
}

export type UpdateTunnelState = {
  errors?: {
    name?: string[]
    project_name?: string[]
    full_name?: string[]
  }
  message?: string | null
}

const CreateTunnel = TunnelFormSchema.omit({ id: true })
const UpdateTunnel = TunnelFormSchema.omit({
  id: true,
  line_mode: true,
  description: true,
  sort_order: true,
})

export async function createTunnel(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  console.log("Form Data:", Object.fromEntries(formData.entries()))
  const validatedFields = CreateTunnel.safeParse({
    name: formData.get("name"),
    project_name: formData.get("project_name"),
    full_name: formData.get("full_name"),
    line_mode: formData.get("line_mode"),
    description: formData.get("description"),
    sort_order: formData.get("sort_order"),
  })

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(
      "Validation errors:",
      validatedFields.error.flatten().fieldErrors
    )
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Date-Definition.",
    }
  }

  // Prepare data for insertion into the database
  const { name, project_name, full_name, line_mode, description, sort_order } =
    validatedFields.data

  // Insert data into the database
  try {
    await getDb()
      .prepare(
        `INSERT INTO tunnels (name, project_name, full_name, line_mode, description, sort_order)
      VALUES (
      @name, @project_name, @full_name, @line_mode, @description, @sort_order)`
      )
      .run({
        name,
        project_name,
        full_name,
        line_mode,
        description,
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

export async function updateTunnel(
  id: number,
  prevState: UpdateTunnelState,
  formData: FormData
) {
  console.log("Updating Tunnel with ID:", id)
  console.log("Form Data:", Object.fromEntries(formData.entries()))
  const validatedFields = UpdateTunnel.safeParse({
    name: formData.get("name"),
    project_name: formData.get("project_name"),
    full_name: formData.get("full_name"),
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

  const { name, project_name, full_name } = validatedFields.data

  console.log("Validated Fields:", validatedFields.data)

  try {
    await getDb()
      .prepare(
        `
      UPDATE tunnels
      SET name = @name, project_name = @project_name, full_name = @full_name
      WHERE id = @id
      `
      )
      .run({
        name,
        project_name,
        full_name,
        id,
      })
  } catch (error) {
    console.error("Failed to update tunnel:", error)
    return { message: "Database Error: Failed to Update Tunnel." }
  }

  revalidatePath(`/tunnels/${id}/edit`)
  return {
    message: "保存成功",
    errors: {},
  }
}

export async function deleteTunnel(id: number) {
  await getDb().prepare(`DELETE FROM tunnels WHERE id = @id`).run({ id })
  revalidatePath("/tunnels")
  redirect("/tunnels")
}
