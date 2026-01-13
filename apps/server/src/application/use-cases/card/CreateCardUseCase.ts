import type { CardRepository } from '../../../domain/repositories/CardRepository.js'
import type { ColumnRepository } from '../../../domain/repositories/ColumnRepository.js'
import { Card } from '../../../domain/entities/Card.js'
import type { CreateCardDTO, CardDTO } from '../../dtos/CardDTO.js'
import { toCardDTO } from '../../dtos/CardDTO.js'
import { NotFoundError } from '../../errors/ApplicationError.js'
import { getLogger } from '../../../infrastructure/config/loggerHelper.js'

export class CreateCardUseCase {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly columnRepository: ColumnRepository
  ) {}

  async execute(columnId: string, input: CreateCardDTO): Promise<CardDTO> {
    const logger = getLogger()
    const columnExists = await this.columnRepository.exists(columnId)

    if (!columnExists) {
      logger.warn({ columnId }, 'Column not found')
      throw new NotFoundError('Column', columnId)
    }

    const card = Card.create({
      title: input.title,
      description: input.description,
      startDate: new Date(input.startDate),
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      priority: input.priority,
      workItemType: input.workItemType,
      columnId,
    })

    const savedCard = await this.cardRepository.save(card)
    return toCardDTO(savedCard)
  }
}
