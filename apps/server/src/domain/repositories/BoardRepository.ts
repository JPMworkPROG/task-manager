import type { Board } from '../entities/Board.js'

export interface BoardRepository {
  findAll(): Promise<Board[]>
  findById(id: string): Promise<Board | null>
  findByIdWithDetails(id: string): Promise<Board | null>
  save(board: Board): Promise<Board>
  delete(id: string): Promise<void>
  exists(id: string): Promise<boolean>
}
