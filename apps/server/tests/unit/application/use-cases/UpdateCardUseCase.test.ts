import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateCardUseCase } from '../../../../src/application/use-cases/card/UpdateCardUseCase.js'
import type { CardRepository } from '../../../../src/domain/repositories/CardRepository.js'
import { Card } from '../../../../src/domain/entities/Card.js'
import { NotFoundError, ValidationError } from '../../../../src/application/errors/ApplicationError.js'
import { InvalidTitleError, InvalidDescriptionError } from '../../../../src/domain/errors/DomainError.js'

// Mock logger
vi.mock('../../../../src/infrastructure/config/loggerHelper.js', () => ({
  getLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}))

describe('UpdateCardUseCase', () => {
  let useCase: UpdateCardUseCase
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

    useCase = new UpdateCardUseCase(mockCardRepository)
  })

  const createTestCard = () =>
    Card.create({
      id: 'card-123',
      title: 'Original Title',
      description: 'Original description',
      columnId: 'column-123',
    })

  it('should update card title', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockCardRepository.update).mockImplementation(async (c: Card) => c)

    const result = await useCase.execute('card-123', { title: 'Updated Title' })

    expect(result.title).toBe('Updated Title')
    expect(mockCardRepository.update).toHaveBeenCalledTimes(1)
  })

  it('should update card description', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockCardRepository.update).mockImplementation(async (c: Card) => c)

    const result = await useCase.execute('card-123', { description: 'New description' })

    expect(result.description).toBe('New description')
  })

  it('should update card description to null', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockCardRepository.update).mockImplementation(async (c: Card) => c)

    const result = await useCase.execute('card-123', { description: null })

    expect(result.description).toBeNull()
  })

  it('should update card priority', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockCardRepository.update).mockImplementation(async (c: Card) => c)

    const result = await useCase.execute('card-123', { priority: 'CRITICAL' })

    expect(result.priority).toBe('CRITICAL')
  })

  it('should update card workItemType', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockCardRepository.update).mockImplementation(async (c: Card) => c)

    const result = await useCase.execute('card-123', { workItemType: 'BUG' })

    expect(result.work_item_type).toBe('BUG')
  })

  it('should update card dates', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockCardRepository.update).mockImplementation(async (c: Card) => c)

    const result = await useCase.execute('card-123', {
      startDate: '2024-02-01',
      dueDate: '2024-02-15',
    })

    expect(result.start_date).toBeDefined()
    expect(result.due_date).toBeDefined()
  })

  it('should update multiple fields at once', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)
    vi.mocked(mockCardRepository.update).mockImplementation(async (c: Card) => c)

    const result = await useCase.execute('card-123', {
      title: 'New Title',
      description: 'New Description',
      priority: 'HIGH',
    })

    expect(result.title).toBe('New Title')
    expect(result.description).toBe('New Description')
    expect(result.priority).toBe('HIGH')
  })

  it('should throw NotFoundError when card does not exist', async () => {
    vi.mocked(mockCardRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('non-existent', { title: 'New' })).rejects.toThrow(NotFoundError)
    await expect(useCase.execute('non-existent', { title: 'New' })).rejects.toThrow(
      "Card with id 'non-existent' not found"
    )
  })

  it('should throw ValidationError when no fields provided', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)

    await expect(useCase.execute('card-123', {})).rejects.toThrow(ValidationError)
    await expect(useCase.execute('card-123', {})).rejects.toThrow('At least one field must be provided')
  })

  it('should throw InvalidTitleError for empty title', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)

    await expect(useCase.execute('card-123', { title: '' })).rejects.toThrow(InvalidTitleError)
  })

  it('should throw InvalidTitleError for title exceeding 200 characters', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)

    const longTitle = 'a'.repeat(201)
    await expect(useCase.execute('card-123', { title: longTitle })).rejects.toThrow(InvalidTitleError)
  })

  it('should throw InvalidDescriptionError for description exceeding 1000 characters', async () => {
    const card = createTestCard()
    vi.mocked(mockCardRepository.findById).mockResolvedValue(card)

    const longDescription = 'a'.repeat(1001)
    await expect(useCase.execute('card-123', { description: longDescription })).rejects.toThrow(
      InvalidDescriptionError
    )
  })
})
