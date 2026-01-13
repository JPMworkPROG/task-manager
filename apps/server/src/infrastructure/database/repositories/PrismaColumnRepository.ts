import type { PrismaClient } from '@prisma/client'
import type { ColumnRepository } from '../../../domain/repositories/ColumnRepository.js'
import { Column } from '../../../domain/entities/Column.js'
import { Card } from '../../../domain/entities/Card.js'
import { getLogger } from '../../config/loggerHelper.js'

export class PrismaColumnRepository implements ColumnRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Column | null> {
    const logger = getLogger()
    logger.debug({ columnId: id }, 'Finding column by id')
    const column = await this.prisma.column.findUnique({
      where: { id },
      include: {
        cards: {
          orderBy: { startDate: 'asc' },
        },
      },
    })

    if (!column) {
      logger.debug({ columnId: id }, 'Column not found')
      return null
    }

    const cards = column.cards.map((card) =>
      Card.reconstitute(
        card.id,
        card.title,
        card.description,
        card.startDate,
        card.dueDate,
        card.priority as import('../../../domain/entities/Card.js').Priority | null,
        card.workItemType as import('../../../domain/entities/Card.js').WorkItemType | null,
        card.columnId,
        card.createdAt,
        card.updatedAt
      )
    )

    logger.debug({ columnId: id, cardsCount: cards.length }, 'Column found')
    return Column.reconstitute(
      column.id,
      column.name,
      column.order,
      column.boardId,
      cards,
      column.createdAt,
      column.updatedAt
    )
  }

  async findByBoardId(boardId: string): Promise<Column[]> {
    const logger = getLogger()
    logger.debug({ boardId }, 'Finding columns by board id')
    const columns = await this.prisma.column.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
      include: {
        cards: {
          orderBy: { startDate: 'asc' },
        },
      },
    })

    const result = columns.map((col) => {
      const cards = col.cards.map((card) =>
        Card.reconstitute(
          card.id,
          card.title,
          card.description,
          card.startDate,
          card.dueDate,
          card.priority as import('../../../domain/entities/Card.js').Priority | null,
          card.workItemType as import('../../../domain/entities/Card.js').WorkItemType | null,
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
    logger.debug({ boardId, count: result.length }, 'Columns found')
    return result
  }

  async save(column: Column): Promise<Column> {
    const logger = getLogger()
    logger.debug({ columnId: column.id, boardId: column.boardId }, 'Saving column')
    const saved = await this.prisma.column.create({
      data: {
        id: column.id,
        name: column.name,
        order: column.order,
        boardId: column.boardId,
      },
    })
    logger.debug({ columnId: saved.id }, 'Column saved')
    return Column.reconstitute(
      saved.id,
      saved.name,
      saved.order,
      saved.boardId,
      [],
      saved.createdAt,
      saved.updatedAt
    )
  }

  async delete(id: string): Promise<void> {
    const logger = getLogger()
    logger.debug({ columnId: id }, 'Deleting column')
    await this.prisma.column.delete({
      where: { id },
    })
    logger.debug({ columnId: id }, 'Column deleted')
  }

  async exists(id: string): Promise<boolean> {
    const logger = getLogger()
    logger.debug({ columnId: id }, 'Checking if column exists')
    const count = await this.prisma.column.count({
      where: { id },
    })
    const exists = count > 0
    logger.debug({ columnId: id, exists }, 'Column existence checked')
    return exists
  }

  async getMaxOrderByBoardId(boardId: string): Promise<number> {
    const logger = getLogger()
    logger.debug({ boardId }, 'Getting max order by board id')
    const result = await this.prisma.column.aggregate({
      where: { boardId },
      _max: { order: true },
    })
    const maxOrder = result._max.order ?? -1
    logger.debug({ boardId, maxOrder }, 'Max order retrieved')
    return maxOrder
  }
}
