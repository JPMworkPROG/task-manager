import { z } from 'zod'

export const createColumnSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name cannot be empty')
    .max(50, 'Name cannot exceed 50 characters'),
})

export const columnIdParamSchema = z.object({
  columnId: z.string().uuid('Invalid column ID format'),
})

export type CreateColumnInput = z.infer<typeof createColumnSchema>
