import type { PrismaClient } from '@prisma/client'
import type { BoardRepository } from '../../../domain/repositories/BoardRepository.js'
import { Board } from '../../../domain/entities/Board.js'
import { Column } from '../../../domain/entities/Column.js'
import { Card, type Priority, type WorkItemType } from '../../../domain/entities/Card.js'
import { getLogger } from '../../config/loggerHelper.js'

export class PrismaBoardRepository implements BoardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Board[]> {
    const logger = getLogger()
    logger.debug('Finding all boards')
    const boards = await this.prisma.board.findMany({
      orderBy: { createdAt: 'desc' },
    })
    logger.debug({ count: boards.length }, 'Boards found')
    return boards.map((board) =>
      Board.reconstitute(board.id, board.name, [], board.createdAt, board.updatedAt)
    )
  }

  async findById(id: string): Promise<Board | null> {
    const logger = getLogger()
    logger.debug({ boardId: id }, 'Finding board by id')
    const board = await this.prisma.board.findUnique({
      where: { id },
    })

    if (!board) {
      logger.debug({ boardId: id }, 'Board not found')
      return null
    }

    logger.debug({ boardId: id }, 'Board found')
    return Board.reconstitute(board.id, board.name, [], board.createdAt, board.updatedAt)
  }

  async findByIdWithDetails(id: string): Promise<Board | null> {
    const logger = getLogger()
    logger.debug({ boardId: id }, 'Finding board by id with details')
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: {
            cards: {
              orderBy: { startDate: 'asc' },
            },
          },
        },
      },
    })

    if (!board) {
      logger.debug({ boardId: id }, 'Board not found')
      return null
    }

    const columns = board.columns.map((col) => {
      const cards = col.cards.map((card) =>
        Card.reconstitute(
          card.id,
          card.title,
          card.description,
          card.startDate,
          card.dueDate,
          card.priority as Priority | null,
          card.workItemType as WorkItemType | null,
          card.columnId,
          card.createdAt,
          card.updatedAt
        )
      )

      return Column.reconstitute(
        col.id,
        col.name,
        col.order,
        col.boardId,
        cards,
        col.createdAt,
        col.updatedAt
      )
    })

    logger.debug({ boardId: id, columnsCount: columns.length }, 'Board with details found')
    return Board.reconstitute(board.id, board.name, columns, board.createdAt, board.updatedAt)
  }

  async save(board: Board): Promise<Board> {
    const logger = getLogger()
    logger.debug({ boardId: board.id, name: board.name }, 'Saving board')
    const saved = await this.prisma.board.create({
      data: {
        id: board.id,
        name: board.name,
      },
    })
    logger.debug({ boardId: saved.id }, 'Board saved')
    return Board.reconstitute(saved.id, saved.name, [], saved.createdAt, saved.updatedAt)
  }

  async delete(id: string): Promise<void> {
    const logger = getLogger()
    logger.debug({ boardId: id }, 'Deleting board')
    await this.prisma.board.delete({
      where: { id },
    })
    logger.debug({ boardId: id }, 'Board deleted')
  }

  async exists(id: string): Promise<boolean> {
    const logger = getLogger()
    logger.debug({ boardId: id }, 'Checking if board exists')
    const count = await this.prisma.board.count({
      where: { id },
    })
    const exists = count > 0
    logger.debug({ boardId: id, exists }, 'Board existence checked')
    return exists
  }
}
