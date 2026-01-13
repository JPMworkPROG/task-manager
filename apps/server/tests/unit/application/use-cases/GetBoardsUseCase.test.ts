import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetBoardsUseCase } from '../../../../src/application/use-cases/board/GetBoardsUseCase.js'
import type { BoardRepository } from '../../../../src/domain/repositories/BoardRepository.js'
import { Board } from '../../../../src/domain/entities/Board.js'

describe('GetBoardsUseCase', () => {
  let useCase: GetBoardsUseCase
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
    useCase = new GetBoardsUseCase(mockBoardRepository)
  })

  it('should return empty array when no boards exist', async () => {
    vi.mocked(mockBoardRepository.findAll).mockResolvedValue([])

    const result = await useCase.execute()

    expect(result).toEqual([])
    expect(mockBoardRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('should return all boards as DTOs', async () => {
    const board1 = Board.create({ id: 'board-1', name: 'Project Alpha' })
    const board2 = Board.create({ id: 'board-2', name: 'Project Beta' })

    vi.mocked(mockBoardRepository.findAll).mockResolvedValue([board1, board2])

    const result = await useCase.execute()

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      id: 'board-1',
      name: 'Project Alpha',
    })
    expect(result[1]).toEqual({
      id: 'board-2',
      name: 'Project Beta',
    })
  })

  it('should return boards in the order returned by repository', async () => {
    const boards = [
      Board.create({ id: 'board-c', name: 'Charlie' }),
      Board.create({ id: 'board-a', name: 'Alpha' }),
      Board.create({ id: 'board-b', name: 'Beta' }),
    ]

    vi.mocked(mockBoardRepository.findAll).mockResolvedValue(boards)

    const result = await useCase.execute()

    expect(result[0].name).toBe('Charlie')
    expect(result[1].name).toBe('Alpha')
    expect(result[2].name).toBe('Beta')
  })
})
