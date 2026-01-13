import type { Board } from '../../domain/entities/Board.js'
import type { ColumnWithCardsDTO } from './ColumnDTO.js'

export interface CreateBoardDTO {
  name: string
}

export interface BoardDTO {
  id: string
  name: string
}

export interface BoardWithDetailsDTO {
  id: string
  name: string
  columns: ColumnWithCardsDTO[]
}

export function toBoardDTO(board: Board): BoardDTO {
  return {
    id: board.id,
    name: board.name,
  }
}

export function toBoardWithDetailsDTO(board: Board): BoardWithDetailsDTO {
  return {
    id: board.id,
    name: board.name,
    columns: board.columns.map((column) => ({
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
    })),
  }
}
