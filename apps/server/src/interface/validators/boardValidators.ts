import { z } from 'zod'

export const createBoardSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name cannot be empty')
    .max(100, 'Name cannot exceed 100 characters'),
})

export const boardIdParamSchema = z.object({
  boardId: z.string().uuid('Invalid board ID format'),
})

export type CreateBoardInput = z.infer<typeof createBoardSchema>
