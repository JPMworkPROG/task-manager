import type { CardRepository } from '../../../domain/repositories/CardRepository.js'
import type { UpdateCardDTO, CardDTO } from '../../dtos/CardDTO.js'
import { toCardDTO } from '../../dtos/CardDTO.js'
import { NotFoundError, ValidationError } from '../../errors/ApplicationError.js'
import { getLogger } from '../../../infrastructure/config/loggerHelper.js'

export class UpdateCardUseCase {
  constructor(private readonly cardRepository: CardRepository) { }

  async execute(cardId: string, input: UpdateCardDTO): Promise<CardDTO> {
    const logger = getLogger()
    const card = await this.cardRepository.findById(cardId)

    if (!card) {
      logger.warn({ cardId }, 'Card not found')
      throw new NotFoundError('Card', cardId)
    }

    const hasAnyField =
      input.title !== undefined ||
      input.description !== undefined ||
      input.startDate !== undefined ||
      input.dueDate !== undefined ||
      input.priority !== undefined ||
      input.workItemType !== undefined

    if (!hasAnyField) {
      logger.warn({ cardId }, 'No fields provided for update')
      throw new ValidationError('At least one field must be provided')
    }

    if (input.title !== undefined) {
      card.updateTitle(input.title)
    }

    if (input.description !== undefined) {
      card.updateDescription(input.description)
    }

    if (input.startDate !== undefined) {
      card.updateStartDate(input.startDate ? new Date(input.startDate) : null)
    }

    if (input.dueDate !== undefined) {
      card.updateDueDate(input.dueDate ? new Date(input.dueDate) : null)
    }

    if (input.priority !== undefined) {
      card.updatePriority(input.priority)
    }

    if (input.workItemType !== undefined) {
      card.updateWorkItemType(input.workItemType)
    }

    const updatedCard = await this.cardRepository.update(card)
    return toCardDTO(updatedCard)
  }
}
