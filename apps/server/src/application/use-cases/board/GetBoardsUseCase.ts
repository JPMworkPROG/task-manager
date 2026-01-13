import type { BoardRepository } from '../../../domain/repositories/BoardRepository.js'
import type { BoardDTO } from '../../dtos/BoardDTO.js'
import { toBoardDTO } from '../../dtos/BoardDTO.js'

export class GetBoardsUseCase {
  constructor(private readonly boardRepository: BoardRepository) { }

  async execute(): Promise<BoardDTO[]> {
    const boards = await this.boardRepository.findAll()
    return boards.map(toBoardDTO)
  }
}
