import type { Column } from '../../domain/entities/Column.js'
import type { CardDTO } from './CardDTO.js'

export interface CreateColumnDTO {
  name: string
}

export interface ColumnDTO {
  id: string
  name: string
  board_id: string
}

export interface ColumnWithCardsDTO {
  id: string
  name: string
  board_id: string
  cards: CardDTO[]
}

export function toColumnDTO(column: Column): ColumnDTO {
  return {
    id: column.id,
    name: column.name,
    board_id: column.boardId,
  }
}

export function toColumnWithCardsDTO(column: Column): ColumnWithCardsDTO {
  return {
    id: column.id,
    name: column.name,
    board_id: column.boardId,
    cards: column.cards.map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      start_date: card.startDate?.toISOString() ?? null,
      due_date: card.dueDate?.toISOString() ?? null,
      priority: card.priority,
      work_item_type: card.workItemType,
      column_id: card.columnId,
    })),
  }
}
