import { describe, it, expect } from 'vitest'
import { Card } from '../../../../src/domain/entities/Card.js'
import { InvalidTitleError, InvalidDescriptionError } from '../../../../src/domain/errors/DomainError.js'

describe('Card Entity', () => {
  describe('create', () => {
    it('should create a card with valid title', () => {
      const card = Card.create({
        title: 'My Task',
        columnId: 'column-123',
      })

      expect(card.title).toBe('My Task')
      expect(card.description).toBeNull()
      expect(card.columnId).toBe('column-123')
      expect(card.id).toBeDefined()
    })

    it('should create a card with description', () => {
      const card = Card.create({
        title: 'My Task',
        description: 'Task description',
        columnId: 'column-123',
      })

      expect(card.description).toBe('Task description')
    })

    it('should throw InvalidTitleError for empty title', () => {
      expect(() =>
        Card.create({ title: '', columnId: 'column-123' })
      ).toThrow(InvalidTitleError)
    })

    it('should throw InvalidTitleError for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201)
      expect(() =>
        Card.create({ title: longTitle, columnId: 'column-123' })
      ).toThrow(InvalidTitleError)
    })

    it('should throw InvalidDescriptionError for description exceeding 1000 characters', () => {
      const longDescription = 'a'.repeat(1001)
      expect(() =>
        Card.create({
          title: 'My Task',
          description: longDescription,
          columnId: 'column-123',
        })
      ).toThrow(InvalidDescriptionError)
    })

    it('should set description to null for empty string', () => {
      const card = Card.create({
        title: 'My Task',
        description: '   ',
        columnId: 'column-123',
      })

      expect(card.description).toBeNull()
    })
  })

  describe('updateTitle', () => {
    it('should update the title', () => {
      const card = Card.create({
        title: 'Original Title',
        columnId: 'column-123',
      })

      card.updateTitle('New Title')

      expect(card.title).toBe('New Title')
    })

    it('should throw InvalidTitleError for invalid new title', () => {
      const card = Card.create({
        title: 'Original Title',
        columnId: 'column-123',
      })

      expect(() => card.updateTitle('')).toThrow(InvalidTitleError)
    })
  })

  describe('updateDescription', () => {
    it('should update the description', () => {
      const card = Card.create({
        title: 'My Task',
        columnId: 'column-123',
      })

      card.updateDescription('New description')

      expect(card.description).toBe('New description')
    })

    it('should set description to null', () => {
      const card = Card.create({
        title: 'My Task',
        description: 'Original description',
        columnId: 'column-123',
      })

      card.updateDescription(null)

      expect(card.description).toBeNull()
    })
  })

  describe('moveTo', () => {
    it('should move card to a new column', () => {
      const card = Card.create({
        title: 'My Task',
        columnId: 'column-123',
      })

      card.moveTo('column-456')

      expect(card.columnId).toBe('column-456')
    })
  })
})
