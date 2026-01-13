import type { PrismaClient } from '@prisma/client'
import type { CardRepository } from '../../../domain/repositories/CardRepository.js'
import { Card, type Priority, type WorkItemType } from '../../../domain/entities/Card.js'
import { getLogger } from '../../config/loggerHelper.js'

export class PrismaCardRepository implements CardRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findById(id: string): Promise<Card | null> {
    const logger = getLogger()
    logger.debug({ cardId: id }, 'Finding card by id')
    const card = await this.prisma.card.findUnique({
      where: { id },
    })

    if (!card) {
      logger.debug({ cardId: id }, 'Card not found')
      return null
    }

    logger.debug({ cardId: id }, 'Card found')
    return Card.reconstitute(
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
  }

  async findByColumnId(columnId: string): Promise<Card[]> {
    const logger = getLogger()
    logger.debug({ columnId }, 'Finding cards by column id')
    const cards = await this.prisma.card.findMany({
      where: { columnId },
      orderBy: { startDate: 'asc' },
    })
    logger.debug({ columnId, count: cards.length }, 'Cards found')
    return cards.map((card) =>
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
  }

  async save(card: Card): Promise<Card> {
    const logger = getLogger()
    logger.debug({ cardId: card.id, columnId: card.columnId }, 'Saving card')
    const saved = await this.prisma.card.create({
      data: {
        id: card.id,
        title: card.title,
        description: card.description,
        startDate: card.startDate,
        dueDate: card.dueDate,
        priority: card.priority,
        workItemType: card.workItemType,
        columnId: card.columnId,
      },
    })
    logger.debug({ cardId: saved.id }, 'Card saved')
    return Card.reconstitute(
      saved.id,
      saved.title,
      saved.description,
      saved.startDate,
      saved.dueDate,
      saved.priority as Priority | null,
      saved.workItemType as WorkItemType | null,
      saved.columnId,
      saved.createdAt,
      saved.updatedAt
    )
  }

  async update(card: Card): Promise<Card> {
    const logger = getLogger()
    logger.debug({ cardId: card.id }, 'Updating card')
    const updated = await this.prisma.card.update({
      where: { id: card.id },
      data: {
        title: card.title,
        description: card.description,
        startDate: card.startDate,
        dueDate: card.dueDate,
        priority: card.priority,
        workItemType: card.workItemType,
        columnId: card.columnId,
      },
    })
    logger.debug({ cardId: updated.id }, 'Card updated')
    return Card.reconstitute(
      updated.id,
      updated.title,
      updated.description,
      updated.startDate,
      updated.dueDate,
      updated.priority as Priority | null,
      updated.workItemType as WorkItemType | null,
      updated.columnId,
      updated.createdAt,
      updated.updatedAt
    )
  }

  async delete(id: string): Promise<void> {
    const logger = getLogger()
    logger.debug({ cardId: id }, 'Deleting card')
    await this.prisma.card.delete({
      where: { id },
    })
    logger.debug({ cardId: id }, 'Card deleted')
  }

  async exists(id: string): Promise<boolean> {
    const logger = getLogger()
    logger.debug({ cardId: id }, 'Checking if card exists')
    const count = await this.prisma.card.count({
      where: { id },
    })
    const exists = count > 0
    logger.debug({ cardId: id, exists }, 'Card existence checked')
    return exists
  }
}
