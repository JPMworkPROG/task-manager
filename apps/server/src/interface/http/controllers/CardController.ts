import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../../../infrastructure/database/prisma.js'
import { PrismaCardRepository } from '../../../infrastructure/database/repositories/PrismaCardRepository.js'
import { PrismaColumnRepository } from '../../../infrastructure/database/repositories/PrismaColumnRepository.js'
import { CreateCardUseCase } from '../../../application/use-cases/card/CreateCardUseCase.js'
import { UpdateCardUseCase } from '../../../application/use-cases/card/UpdateCardUseCase.js'
import { DeleteCardUseCase } from '../../../application/use-cases/card/DeleteCardUseCase.js'
import { MoveCardUseCase } from '../../../application/use-cases/card/MoveCardUseCase.js'
import { getLoggerFromRequest } from '../../../infrastructure/config/loggerHelper.js'

const cardRepository = new PrismaCardRepository(prisma)
const columnRepository = new PrismaColumnRepository(prisma)
const createCardUseCase = new CreateCardUseCase(cardRepository, columnRepository)
const updateCardUseCase = new UpdateCardUseCase(cardRepository)
const deleteCardUseCase = new DeleteCardUseCase(cardRepository)
const moveCardUseCase = new MoveCardUseCase(cardRepository, columnRepository)

export class CardController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = getLoggerFromRequest(req)
    const columnId = req.params.columnId as string
    try {
      logger.debug({ columnId, body: req.body }, 'Creating card')
      const card = await createCardUseCase.execute(columnId, req.body)
      logger.info({ cardId: card.id, columnId }, 'Card created successfully')
      res.status(201).json(card)
    } catch (error) {
      logger.error({ err: error, columnId, body: req.body }, 'Error creating card')
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = getLoggerFromRequest(req)
    const cardId = req.params.cardId as string
    try {
      logger.debug({ cardId, body: req.body }, 'Updating card')
      const card = await updateCardUseCase.execute(cardId, req.body)
      logger.info({ cardId }, 'Card updated successfully')
      res.json(card)
    } catch (error) {
      logger.error({ err: error, cardId, body: req.body }, 'Error updating card')
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = getLoggerFromRequest(req)
    const cardId = req.params.cardId as string
    try {
      logger.debug({ cardId }, 'Deleting card')
      await deleteCardUseCase.execute(cardId)
      logger.info({ cardId }, 'Card deleted successfully')
      res.status(204).send()
    } catch (error) {
      logger.error({ err: error, cardId }, 'Error deleting card')
      next(error)
    }
  }

  async move(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = getLoggerFromRequest(req)
    const cardId = req.params.cardId as string
    try {
      logger.debug({ cardId, body: req.body }, 'Moving card')
      const card = await moveCardUseCase.execute(cardId, req.body)
      logger.info({ cardId, newColumnId: card.column_id }, 'Card moved successfully')
      res.json(card)
    } catch (error) {
      logger.error({ err: error, cardId, body: req.body }, 'Error moving card')
      next(error)
    }
  }
}

export const cardController = new CardController()
