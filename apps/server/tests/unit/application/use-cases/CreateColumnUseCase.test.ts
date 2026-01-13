import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateColumnUseCase } from '../../../../src/application/use-cases/column/CreateColumnUseCase.js'
import type { ColumnRepository } from '../../../../src/domain/repositories/ColumnRepository.js'
import type { BoardRepository } from '../../../../src/domain/repositories/BoardRepository.js'
import { Column } from '../../../../src/domain/entities/Column.js'
import { NotFoundError } from '../../../../src/application/errors/ApplicationError.js'
import { InvalidNameError } from '../../../../src/domain/errors/DomainError.js'

// Mock logger
vi.mock('../../../../src/infrastructure/config/loggerHelper.js', () => ({
  getLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}))

describe('CreateColumnUseCase', () => {
  let useCase: CreateColumnUseCase
  let mockColumnRepository: ColumnRepository
  let mockBoardRepository: BoardRepository

  beforeEach(() => {
    mockColumnRepository = {
      findById: vi.fn(),
      findByBoardId: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
      getMaxOrderByBoardId: vi.fn(),
    }

    mockBoardRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByIdWithDetails: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    }

    useCase = new CreateColumnUseCase(mockColumnRepository, mockBoardRepository)
  })

  it('should create a column successfully', async () => {
    vi.mocked(mockBoardRepository.exists).mockResolvedValue(true)
    vi.mocked(mockColumnRepository.getMaxOrderByBoardId).mockResolvedValue(0)
    vi.mocked(mockColumnRepository.save).mockImplementation(async (column: Column) => column)

    const result = await useCase.execute('board-123', { name: 'To Do' })

    expect(result.name).toBe('To Do')
    expect(result.board_id).toBe('board-123')
    expect(mockColumnRepository.save).toHaveBeenCalledTimes(1)
  })

  it('should assign correct order to new column', async () => {
    vi.mocked(mockBoardRepository.exists).mockResolvedValue(true)
    vi.mocked(mockColumnRepository.getMaxOrderByBoardId).mockResolvedValue(2)
    vi.mocked(mockColumnRepository.save).mockImplementation(async (column: Column) => column)

    await useCase.execute('board-123', { name: 'New Column' })

    const savedColumn = vi.mocked(mockColumnRepository.save).mock.calls[0][0]
    expect(savedColumn.order).toBe(3)
  })

  it('should assign order 1 for first column (maxOrder is 0)', async () => {
    vi.mocked(mockBoardRepository.exists).mockResolvedValue(true)
    vi.mocked(mockColumnRepository.getMaxOrderByBoardId).mockResolvedValue(0)
    vi.mocked(mockColumnRepository.save).mockImplementation(async (column: Column) => column)

    await useCase.execute('board-123', { name: 'First Column' })

    const savedColumn = vi.mocked(mockColumnRepository.save).mock.calls[0][0]
    expect(savedColumn.order).toBe(1)
  })

  it('should throw NotFoundError when board does not exist', async () => {
    vi.mocked(mockBoardRepository.exists).mockResolvedValue(false)

    await expect(useCase.execute('non-existent', { name: 'To Do' })).rejects.toThrow(NotFoundError)
    await expect(useCase.execute('non-existent', { name: 'To Do' })).rejects.toThrow(
      "Board with id 'non-existent' not found"
    )
  })

  it('should throw InvalidNameError for empty column name', async () => {
    vi.mocked(mockBoardRepository.exists).mockResolvedValue(true)
    vi.mocked(mockColumnRepository.getMaxOrderByBoardId).mockResolvedValue(0)

    await expect(useCase.execute('board-123', { name: '' })).rejects.toThrow(InvalidNameError)
  })

  it('should throw InvalidNameError for name exceeding 100 characters', async () => {
    vi.mocked(mockBoardRepository.exists).mockResolvedValue(true)
    vi.mocked(mockColumnRepository.getMaxOrderByBoardId).mockResolvedValue(0)

    const longName = 'a'.repeat(101)
    await expect(useCase.execute('board-123', { name: longName })).rejects.toThrow(InvalidNameError)
  })
})
