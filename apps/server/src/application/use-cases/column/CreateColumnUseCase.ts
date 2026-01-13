import type { ColumnRepository } from '../../../domain/repositories/ColumnRepository.js'
import type { BoardRepository } from '../../../domain/repositories/BoardRepository.js'
import { Column } from '../../../domain/entities/Column.js'
import type { CreateColumnDTO, ColumnDTO } from '../../dtos/ColumnDTO.js'
import { toColumnDTO } from '../../dtos/ColumnDTO.js'
import { NotFoundError } from '../../errors/ApplicationError.js'
import { getLogger } from '../../../infrastructure/config/loggerHelper.js'

export class CreateColumnUseCase {
  constructor(
    private readonly columnRepository: ColumnRepository,
    private readonly boardRepository: BoardRepository
  ) { }

  async execute(boardId: string, input: CreateColumnDTO): Promise<ColumnDTO> {
    const logger = getLogger()
    const boardExists = await this.boardRepository.exists(boardId)

    if (!boardExists) {
      logger.warn({ boardId }, 'Board not found')
      throw new NotFoundError('Board', boardId)
    }

    const maxOrder = await this.columnRepository.getMaxOrderByBoardId(boardId)
    const newOrder = maxOrder + 1

    const column = Column.create({
      name: input.name,
      order: newOrder,
      boardId,
    })

    const savedColumn = await this.columnRepository.save(column)
    return toColumnDTO(savedColumn)
  }
}
