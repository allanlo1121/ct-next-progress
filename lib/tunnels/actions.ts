"use server"

import { z } from "zod"

import { updateTunnelById } from "./repository"

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

// const CreateTunnel = TunnelFormSchema.omit({ id: true })
const UpdateTunnel = TunnelFormSchema.omit({
  id: true,
  description: true,
  sort_order: true,
})

export async function updateTunnel(id: number, formData: FormData) {
  const validatedFields = UpdateTunnel.safeParse({
    name: formData.get("name"),
    project_name: formData.get("project_name"),
    full_name: formData.get("full_name"),
    line_mode: formData.get("line_mode"),
  })

  console.log("Validated Fields:", validatedFields)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  console.log("Updating Tunnel with ID:", id)
  console.log("Data to Update:", validatedFields.data)

  updateTunnelById(id, validatedFields.data)

  return {
    success: true,
  }
}
