import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../../../infrastructure/database/prisma.js'
import { PrismaBoardRepository } from '../../../infrastructure/database/repositories/PrismaBoardRepository.js'
import { CreateBoardUseCase } from '../../../application/use-cases/board/CreateBoardUseCase.js'
import { GetBoardsUseCase } from '../../../application/use-cases/board/GetBoardsUseCase.js'
import { GetBoardByIdUseCase } from '../../../application/use-cases/board/GetBoardByIdUseCase.js'
import { getLoggerFromRequest } from '../../../infrastructure/config/loggerHelper.js'

const boardRepository = new PrismaBoardRepository(prisma)
const createBoardUseCase = new CreateBoardUseCase(boardRepository)
const getBoardsUseCase = new GetBoardsUseCase(boardRepository)
const getBoardByIdUseCase = new GetBoardByIdUseCase(boardRepository)

export class BoardController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = getLoggerFromRequest(req)
    try {
      logger.debug('Getting all boards')
      const boards = await getBoardsUseCase.execute()
      logger.info({ count: boards.length }, 'Boards retrieved successfully')
      res.json(boards)
    } catch (error) {
      logger.error({ err: error }, 'Error getting all boards')
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = getLoggerFromRequest(req)
    const boardId = req.params.boardId as string
    try {
      logger.debug({ boardId }, 'Getting board by id')
      const board = await getBoardByIdUseCase.execute(boardId)
      logger.info({ boardId }, 'Board retrieved successfully')
      res.json(board)
    } catch (error) {
      logger.error({ err: error, boardId }, 'Error getting board by id')
      next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = getLoggerFromRequest(req)
    try {
      logger.debug({ body: req.body }, 'Creating board')
      const board = await createBoardUseCase.execute(req.body)
      logger.info({ boardId: board.id, name: board.name }, 'Board created successfully')
      res.status(201).json(board)
    } catch (error) {
      logger.error({ err: error, body: req.body }, 'Error creating board')
      next(error)
    }
  }
}

export const boardController = new BoardController()
