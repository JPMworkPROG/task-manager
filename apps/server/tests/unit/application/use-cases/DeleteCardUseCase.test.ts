import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteCardUseCase } from '../../../../src/application/use-cases/card/DeleteCardUseCase.js'
import type { CardRepository } from '../../../../src/domain/repositories/CardRepository.js'
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

describe('DeleteCardUseCase', () => {
  let useCase: DeleteCardUseCase
  let mockCardRepository: CardRepository

  beforeEach(() => {
    mockCardRepository = {
      findById: vi.fn(),
      findByColumnId: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    }

    useCase = new DeleteCardUseCase(mockCardRepository)
  })

  it('should delete a card successfully', async () => {
    vi.mocked(mockCardRepository.exists).mockResolvedValue(true)
    vi.mocked(mockCardRepository.delete).mockResolvedValue(undefined)

    await useCase.execute('card-123')

    expect(mockCardRepository.exists).toHaveBeenCalledWith('card-123')
    expect(mockCardRepository.delete).toHaveBeenCalledWith('card-123')
    expect(mockCardRepository.delete).toHaveBeenCalledTimes(1)
  })

  it('should throw NotFoundError when card does not exist', async () => {
    vi.mocked(mockCardRepository.exists).mockResolvedValue(false)

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundError)
    await expect(useCase.execute('non-existent')).rejects.toThrow(
      "Card with id 'non-existent' not found"
    )
  })

  it('should not call delete when card does not exist', async () => {
    vi.mocked(mockCardRepository.exists).mockResolvedValue(false)

    try {
      await useCase.execute('non-existent')
    } catch {
      // Expected error
    }

    expect(mockCardRepository.delete).not.toHaveBeenCalled()
  })

  it('should return void on successful deletion', async () => {
    vi.mocked(mockCardRepository.exists).mockResolvedValue(true)
    vi.mocked(mockCardRepository.delete).mockResolvedValue(undefined)

    const result = await useCase.execute('card-123')

    expect(result).toBeUndefined()
  })
})
