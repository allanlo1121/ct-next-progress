"use server"

import { revalidatePath } from "next/cache"
import { ActionResult } from "../types/action.type"
import {
  insertDateDefinition,
  updateDateDefinition,
  deleteDateDefinition,
} from "./repository"
import type {
  CreateDateDefinitionForm,
  UpdateDateDefinitionForm,
} from "./schema"
import {
  CreateDateDefinitionFormSchema,
  UpdateDateDefinitionFormSchema,
} from "./schema"

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

export async function createDateDefinitionAction(
  formData: FormData
): Promise<ActionResult> {
  // Validate form fields using Zod
  console.log("Form Data:", Object.fromEntries(formData.entries()))
  const validatedFields = CreateDateDefinitionFormSchema.safeParse({
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
    console.log(
      "Validation errors:",
      validatedFields.error.flatten().fieldErrors
    )
    return {
      success: false,
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

  const input: CreateDateDefinitionForm = {
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
  }

  // Insert data into the database
  try {
    insertDateDefinition(input)
    return {
      success: true,
      message: "Date definition created successfully.",
    }
  } catch (error) {
    console.error("Failed to create date definition:", error)

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create date definition.",
    }
  }
}

export async function updateDateDefinitionAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  console.log("Updating Date Definition with ID:", id)
  console.log("Form Data:", Object.fromEntries(formData.entries()))
  const validatedFields = UpdateDateDefinitionFormSchema.safeParse({
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
      success: false,
      message: "Validation failed. Missing or incorrect fields.",
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

  console.log("Validated Fields:", validatedFields.data)

  const input: UpdateDateDefinitionForm = {
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
  }

  try {
    updateDateDefinition(id, input)
    return {
      success: true,
      message: "Date definition updated successfully.",
    }
  } catch (error) {
    console.error("Failed to update date definition:", error)

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update date definition.",
    }
  }

  // Removed as it's now handled within the try-catch block above.
}

// export async function deleteDateDefinitionAction(
//   id: number
// ): Promise<ActionResult> {
//   try {
//     deleteDateDefinition(id)

//     revalidatePath("/date-definitions")

//     return {
//       success: true,
//       message: "Date definition deleted successfully.",
//     }
//   } catch (error) {
//     console.error("Failed to delete date definition:", error)

//     return {
//       success: false,
//       message:
//         error instanceof Error
//           ? error.message
//           : "Failed to delete date definition.",
//     }
//   }
// }

export async function deleteDateDefinitionAction(id: number) {
   deleteDateDefinition(id)

  revalidatePath("/date-definitions")
}
