import type { CardRepository } from '../../../domain/repositories/CardRepository.js'
import { NotFoundError } from '../../errors/ApplicationError.js'
import { getLogger } from '../../../infrastructure/config/loggerHelper.js'

export class DeleteCardUseCase {
  constructor(private readonly cardRepository: CardRepository) { }

  async execute(cardId: string): Promise<void> {
    const logger = getLogger()
    const exists = await this.cardRepository.exists(cardId)

    if (!exists) {
      logger.warn({ cardId }, 'Card not found')
      throw new NotFoundError('Card', cardId)
    }

    await this.cardRepository.delete(cardId)
  }
}
