import type { Column } from '../entities/Column.js'

export interface ColumnRepository {
  findById(id: string): Promise<Column | null>
  findByBoardId(boardId: string): Promise<Column[]>
  save(column: Column): Promise<Column>
  delete(id: string): Promise<void>
  exists(id: string): Promise<boolean>
  getMaxOrderByBoardId(boardId: string): Promise<number>
}
