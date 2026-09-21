import { z } from "zod"

const DateDefinitionSchema = {
  id: z.coerce.number(),
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
  created_at: z.string(),
  updated_at: z.string(),
}

export const DateDefinitionFormSchema = z.object(DateDefinitionSchema)

export const CreateDateDefinitionFormSchema = DateDefinitionFormSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const UpdateDateDefinitionFormSchema = DateDefinitionFormSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export type DateDefinition = z.infer<typeof DateDefinitionFormSchema>
export type CreateDateDefinitionForm = z.infer<
  typeof CreateDateDefinitionFormSchema
>
export type UpdateDateDefinitionForm = z.infer<
  typeof UpdateDateDefinitionFormSchema
>
