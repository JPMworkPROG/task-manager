import { z } from 'zod'

const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
const workItemTypeEnum = z.enum(['BUG', 'FEATURE', 'IMPROVEMENT'])

export const createCardSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').nullable().optional(),
  startDate: z.string().datetime({ message: 'Start date is required and must be a valid date' }),
  dueDate: z.string().datetime().nullable().optional(),
  priority: priorityEnum,
  workItemType: workItemTypeEnum,
})

export const updateCardSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200, 'Title cannot exceed 200 characters').optional(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  priority: priorityEnum.nullable().optional(),
  workItemType: workItemTypeEnum.nullable().optional(),
})

export const moveCardSchema = z.object({
  newColumnId: z.string().uuid('Invalid column ID format'),
})

export const cardIdParamSchema = z.object({
  cardId: z.string().uuid('Invalid card ID format'),
})

export type CreateCardInput = z.infer<typeof createCardSchema>
export type UpdateCardInput = z.infer<typeof updateCardSchema>
export type MoveCardInput = z.infer<typeof moveCardSchema>
