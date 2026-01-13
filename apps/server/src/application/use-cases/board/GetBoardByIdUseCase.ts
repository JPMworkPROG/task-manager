import type { BoardRepository } from '../../../domain/repositories/BoardRepository.js'
import type { BoardWithDetailsDTO } from '../../dtos/BoardDTO.js'
import { toBoardWithDetailsDTO } from '../../dtos/BoardDTO.js'
import { NotFoundError } from '../../errors/ApplicationError.js'
import { getLogger } from '../../../infrastructure/config/loggerHelper.js'

export class GetBoardByIdUseCase {
  constructor(private readonly boardRepository: BoardRepository) { }

  async execute(boardId: string): Promise<BoardWithDetailsDTO> {
    const logger = getLogger()
    const board = await this.boardRepository.findByIdWithDetails(boardId)

    if (!board) {
      logger.warn({ boardId }, 'Board not found')
      throw new NotFoundError('Board', boardId)
    }

    return toBoardWithDetailsDTO(board)
  }
}
