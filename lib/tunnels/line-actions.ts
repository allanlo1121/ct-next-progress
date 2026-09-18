"use server"

import { z } from "zod"
import { updateTunnelLineById } from "./repository"

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

// const CreateTunnelLine = TunnelLineFormSchema.omit({ id: true })
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

export async function updateTunnelLine(id: number, formData: FormData) {
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

  console.log("Validated Fields:", validatedFields)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  console.log("Updating Tunnel Line with ID:", id)
  console.log("Data to Update:", validatedFields.data)

  updateTunnelLineById(id, validatedFields.data)

  return {
    success: true,
  }
}
