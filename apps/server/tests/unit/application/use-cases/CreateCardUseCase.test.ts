import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateCardUseCase } from '../../../../src/application/use-cases/card/CreateCardUseCase.js'
import type { CardRepository } from '../../../../src/domain/repositories/CardRepository.js'
import type { ColumnRepository } from '../../../../src/domain/repositories/ColumnRepository.js'
import { Card } from '../../../../src/domain/entities/Card.js'
import { NotFoundError } from '../../../../src/application/errors/ApplicationError.js'
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

describe('CreateCardUseCase', () => {
   let useCase: CreateCardUseCase
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

      useCase = new CreateCardUseCase(mockCardRepository, mockColumnRepository)
   })

   it('should create a card successfully', async () => {
      vi.mocked(mockColumnRepository.exists).mockResolvedValue(true)
      vi.mocked(mockCardRepository.save).mockImplementation(async (card: Card) => card)

      const result = await useCase.execute('column-123', {
         title: 'New Task',
         description: 'Task description',
         startDate: '2024-01-15',
         priority: 'HIGH',
         workItemType: 'FEATURE',
      })

      expect(result.title).toBe('New Task')
      expect(result.description).toBe('Task description')
      expect(result.column_id).toBe('column-123')
      expect(result.priority).toBe('HIGH')
      expect(result.work_item_type).toBe('FEATURE')
      expect(mockCardRepository.save).toHaveBeenCalledTimes(1)
   })

   it('should create a card with minimal data', async () => {
      vi.mocked(mockColumnRepository.exists).mockResolvedValue(true)
      vi.mocked(mockCardRepository.save).mockImplementation(async (card: Card) => card)

      const result = await useCase.execute('column-123', {
         title: 'Simple Task',
         startDate: '2024-01-15',
         priority: 'LOW',
         workItemType: 'BUG',
      })

      expect(result.title).toBe('Simple Task')
      expect(result.description).toBeNull()
   })

   it('should create a card with due date', async () => {
      vi.mocked(mockColumnRepository.exists).mockResolvedValue(true)
      vi.mocked(mockCardRepository.save).mockImplementation(async (card: Card) => card)

      const result = await useCase.execute('column-123', {
         title: 'Task with due date',
         startDate: '2024-01-15',
         dueDate: '2024-01-20',
         priority: 'MEDIUM',
         workItemType: 'IMPROVEMENT',
      })

      expect(result.due_date).toBeDefined()
      expect(result.due_date).not.toBeNull()
   })

   it('should throw NotFoundError when column does not exist', async () => {
      vi.mocked(mockColumnRepository.exists).mockResolvedValue(false)

      await expect(
         useCase.execute('non-existent', {
            title: 'Task',
            startDate: '2024-01-15',
            priority: 'LOW',
            workItemType: 'BUG',
         })
      ).rejects.toThrow(NotFoundError)
   })

   it('should throw InvalidTitleError for empty title', async () => {
      vi.mocked(mockColumnRepository.exists).mockResolvedValue(true)

      await expect(
         useCase.execute('column-123', {
            title: '',
            startDate: '2024-01-15',
            priority: 'LOW',
            workItemType: 'BUG',
         })
      ).rejects.toThrow(InvalidTitleError)
   })

   it('should throw InvalidTitleError for title exceeding 200 characters', async () => {
      vi.mocked(mockColumnRepository.exists).mockResolvedValue(true)

      const longTitle = 'a'.repeat(201)
      await expect(
         useCase.execute('column-123', {
            title: longTitle,
            startDate: '2024-01-15',
            priority: 'LOW',
            workItemType: 'BUG',
         })
      ).rejects.toThrow(InvalidTitleError)
   })

   it('should throw InvalidDescriptionError for description exceeding 1000 characters', async () => {
      vi.mocked(mockColumnRepository.exists).mockResolvedValue(true)

      const longDescription = 'a'.repeat(1001)
      await expect(
         useCase.execute('column-123', {
            title: 'Valid Task',
            description: longDescription,
            startDate: '2024-01-15',
            priority: 'LOW',
            workItemType: 'BUG',
         })
      ).rejects.toThrow(InvalidDescriptionError)
   })
})
