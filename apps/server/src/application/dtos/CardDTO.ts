import type { Card, Priority, WorkItemType } from '../../domain/entities/Card.js'

export interface CreateCardDTO {
  title: string
  description?: string | null
  startDate: string
  dueDate?: string | null
  priority: Priority
  workItemType: WorkItemType
}

export interface UpdateCardDTO {
  title?: string
  description?: string | null
  startDate?: string | null
  dueDate?: string | null
  priority?: Priority | null
  workItemType?: WorkItemType | null
}

export interface MoveCardDTO {
  newColumnId: string
}

export interface CardDTO {
  id: string
  title: string
  description: string | null
  start_date: string | null
  due_date: string | null
  priority: Priority | null
  work_item_type: WorkItemType | null
  column_id: string
}

export function toCardDTO(card: Card): CardDTO {
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    start_date: card.startDate?.toISOString() ?? null,
    due_date: card.dueDate?.toISOString() ?? null,
    priority: card.priority,
    work_item_type: card.workItemType,
    column_id: card.columnId,
  }
}
