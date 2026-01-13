import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetBoardByIdUseCase } from '../../../../src/application/use-cases/board/GetBoardByIdUseCase.js'
import type { BoardRepository } from '../../../../src/domain/repositories/BoardRepository.js'
import { Board } from '../../../../src/domain/entities/Board.js'
import { Column } from '../../../../src/domain/entities/Column.js'
import { Card } from '../../../../src/domain/entities/Card.js'
import { NotFoundError } from '../../../../src/application/errors/ApplicationError.js'

// Mock logger
vi.mock('../../../../src/infrastructure/config/loggerHelper.js', () => ({
  getLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}))

describe('GetBoardByIdUseCase', () => {
  let useCase: GetBoardByIdUseCase
  let mockBoardRepository: BoardRepository

  beforeEach(() => {
    mockBoardRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByIdWithDetails: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    }
    useCase = new GetBoardByIdUseCase(mockBoardRepository)
  })

  it('should return board with details when found', async () => {
    const card = Card.create({
      id: 'card-1',
      title: 'Task 1',
      columnId: 'column-1',
    })

    const column = Column.create({
      id: 'column-1',
      name: 'To Do',
      order: 0,
      boardId: 'board-1',
      cards: [card],
    })

    const board = Board.reconstitute(
      'board-1',
      'My Board',
      [column],
      new Date('2024-01-01'),
      new Date('2024-01-02')
    )

    vi.mocked(mockBoardRepository.findByIdWithDetails).mockResolvedValue(board)

    const result = await useCase.execute('board-1')

    expect(result.id).toBe('board-1')
    expect(result.name).toBe('My Board')
    expect(result.columns).toHaveLength(1)
    expect(result.columns[0].id).toBe('column-1')
    expect(result.columns[0].name).toBe('To Do')
    expect(result.columns[0].cards).toHaveLength(1)
    expect(result.columns[0].cards[0].title).toBe('Task 1')
  })

  it('should throw NotFoundError when board does not exist', async () => {
    vi.mocked(mockBoardRepository.findByIdWithDetails).mockResolvedValue(null)

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundError)
    await expect(useCase.execute('non-existent')).rejects.toThrow(
      "Board with id 'non-existent' not found"
    )
  })

  it('should return board with empty columns', async () => {
    const board = Board.reconstitute(
      'board-1',
      'Empty Board',
      [],
      new Date('2024-01-01'),
      new Date('2024-01-02')
    )

    vi.mocked(mockBoardRepository.findByIdWithDetails).mockResolvedValue(board)

    const result = await useCase.execute('board-1')

    expect(result.columns).toEqual([])
  })

  it('should return columns sorted by order', async () => {
    const column1 = Column.create({
      id: 'column-3',
      name: 'Done',
      order: 2,
      boardId: 'board-1',
    })

    const column2 = Column.create({
      id: 'column-1',
      name: 'To Do',
      order: 0,
      boardId: 'board-1',
    })

    const column3 = Column.create({
      id: 'column-2',
      name: 'In Progress',
      order: 1,
      boardId: 'board-1',
    })

    const board = Board.reconstitute(
      'board-1',
      'My Board',
      [column1, column2, column3],
      new Date('2024-01-01'),
      new Date('2024-01-02')
    )

    vi.mocked(mockBoardRepository.findByIdWithDetails).mockResolvedValue(board)

    const result = await useCase.execute('board-1')

    expect(result.columns[0].name).toBe('To Do')
    expect(result.columns[1].name).toBe('In Progress')
    expect(result.columns[2].name).toBe('Done')
  })
})
