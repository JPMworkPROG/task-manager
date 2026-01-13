import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../../../infrastructure/database/prisma.js'
import { PrismaColumnRepository } from '../../../infrastructure/database/repositories/PrismaColumnRepository.js'
import { PrismaBoardRepository } from '../../../infrastructure/database/repositories/PrismaBoardRepository.js'
import { CreateColumnUseCase } from '../../../application/use-cases/column/CreateColumnUseCase.js'
import { getLoggerFromRequest } from '../../../infrastructure/config/loggerHelper.js'

const columnRepository = new PrismaColumnRepository(prisma)
const boardRepository = new PrismaBoardRepository(prisma)
const createColumnUseCase = new CreateColumnUseCase(columnRepository, boardRepository)

export class ColumnController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = getLoggerFromRequest(req)
    const boardId = req.params.boardId as string
    try {
      logger.debug({ boardId, body: req.body }, 'Creating column')
      const column = await createColumnUseCase.execute(boardId, req.body)
      logger.info({ columnId: column.id, boardId }, 'Column created successfully')
      res.status(201).json(column)
    } catch (error) {
      logger.error({ err: error, boardId, body: req.body }, 'Error creating column')
      next(error)
    }
  }
}

export const columnController = new ColumnController()
