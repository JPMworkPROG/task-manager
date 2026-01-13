import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MoveCardUseCase } from '../../../../src/application/use-cases/card/MoveCardUseCase.js'
import type { CardRepository } from '../../../../src/domain/repositories/CardRepository.js'
import type { ColumnRepository } from '../../../../src/domain/repositories/ColumnRepository.js'
import { Card } from '../../../../src/domain/entities/Card.js'
import { Column } from '../../../../src/domain/entities/Column.js'
import { NotFoundError, ValidationError } from '../../../../src/application/errors/ApplicationError.js'

// Mock logger
vi.mock('../../../../src/infrastructure/config/loggerHelper.js', () => ({
  getLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}))

describe('MoveCardUseCase', () => {
  let useCase: MoveCardUseCase
  let mockCardRepository: CardRepository
  let mockColumnRepository: ColumnRepository

  beforeEach(() => {
    mockCardRepository = {
      findById: vi.fn(),
      findByColumnId: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    }

    mockColumnRepository = {
      findById: vi.fn(),
      findByBoardId: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
      getMaxOrderByBoardId: vi.fn(),
    }

    useCase = new MoveCardUseCase(mockCardRepository, mockColumnRepository)
  })

  it('should move card to a new column', async () => {
    const card = Card.create({
      id: 'card-123',
      title: 'My Task',
      columnId: 'column-source',
    })

    const targetColumn = Column.create({
      id: 'column-target',
      name: 'Done',
      order: 1,
      boardId: 'board-123',
    })

    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockColumnRepository.findById).mockResolvedValue(targetColumn)
    vi.mocked(mockCardRepository.update).mockImplementation(async (c: Card) => c)

    const result = await useCase.execute('card-123', { newColumnId: 'column-target' })

    expect(result.column_id).toBe('column-target')
    expect(mockCardRepository.update).toHaveBeenCalledTimes(1)
  })

  it('should throw NotFoundError if card does not exist', async () => {
    vi.mocked(mockCardRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute('non-existent', { newColumnId: 'column-target' })
    ).rejects.toThrow(NotFoundError)
  })

  it('should throw NotFoundError if target column does not exist', async () => {
    const card = Card.create({
      id: 'card-123',
      title: 'My Task',
      columnId: 'column-source',
    })

    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockColumnRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute('card-123', { newColumnId: 'non-existent' })
    ).rejects.toThrow(NotFoundError)
  })

  it('should throw ValidationError if card is already in target column', async () => {
    const card = Card.create({
      id: 'card-123',
      title: 'My Task',
      columnId: 'column-123',
    })

    const targetColumn = Column.create({
      id: 'column-123',
      name: 'To Do',
      order: 0,
      boardId: 'board-123',
    })

    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockColumnRepository.findById).mockResolvedValue(targetColumn)

    await expect(
      useCase.execute('card-123', { newColumnId: 'column-123' })
    ).rejects.toThrow(ValidationError)
  })
})
