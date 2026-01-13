import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateBoardUseCase } from '../../../../src/application/use-cases/board/CreateBoardUseCase.js'
import type { BoardRepository } from '../../../../src/domain/repositories/BoardRepository.js'
import { Board } from '../../../../src/domain/entities/Board.js'

describe('CreateBoardUseCase', () => {
  let useCase: CreateBoardUseCase
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
    useCase = new CreateBoardUseCase(mockBoardRepository)
  })

  it('should create a board and return DTO', async () => {
    const input = { name: 'My New Board' }

    vi.mocked(mockBoardRepository.save).mockImplementation(async (board: Board) => {
      return Board.reconstitute(
        board.id,
        board.name,
        [],
        board.createdAt,
        board.updatedAt
      )
    })

    const result = await useCase.execute(input)

    expect(result.name).toBe('My New Board')
    expect(result.id).toBeDefined()
    expect(mockBoardRepository.save).toHaveBeenCalledTimes(1)
  })

  it('should throw error for invalid board name', async () => {
    const input = { name: '' }

    await expect(useCase.execute(input)).rejects.toThrow()
  })
})
