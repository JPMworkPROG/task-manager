import type { CardRepository } from '../../../domain/repositories/CardRepository.js'
import type { ColumnRepository } from '../../../domain/repositories/ColumnRepository.js'
import type { MoveCardDTO, CardDTO } from '../../dtos/CardDTO.js'
import { toCardDTO } from '../../dtos/CardDTO.js'
import { NotFoundError, ValidationError } from '../../errors/ApplicationError.js'
import { getLogger } from '../../../infrastructure/config/loggerHelper.js'

export class MoveCardUseCase {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly columnRepository: ColumnRepository
  ) { }

  async execute(cardId: string, input: MoveCardDTO): Promise<CardDTO> {
    const logger = getLogger()
    const card = await this.cardRepository.findById(cardId)

    if (!card) {
      logger.warn({ cardId }, 'Card not found')
      throw new NotFoundError('Card', cardId)
    }

    const targetColumn = await this.columnRepository.findById(input.newColumnId)

    if (!targetColumn) {
      logger.warn({ newColumnId: input.newColumnId }, 'Target column not found')
      throw new NotFoundError('Column', input.newColumnId)
    }

    if (card.columnId === input.newColumnId) {
      logger.warn({ cardId, columnId: card.columnId }, 'Card already in target column')
      throw new ValidationError('Card is already in the target column')
    }

    logger.debug({ cardId, oldColumnId: card.columnId, newColumnId: input.newColumnId }, 'Moving card entity')
    card.moveTo(input.newColumnId)

    const updatedCard = await this.cardRepository.update(card)
    return toCardDTO(updatedCard)
  }
}
