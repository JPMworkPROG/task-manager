import { describe, it, expect } from 'vitest'
import { Column } from '../../../../src/domain/entities/Column.js'
import { Card } from '../../../../src/domain/entities/Card.js'
import { InvalidNameError } from '../../../../src/domain/errors/DomainError.js'

describe('Column Entity', () => {
  describe('create', () => {
    it('should create a column with valid name', () => {
      const column = Column.create({
        name: 'To Do',
        order: 0,
        boardId: 'board-123',
      })

      expect(column.name).toBe('To Do')
      expect(column.order).toBe(0)
      expect(column.boardId).toBe('board-123')
      expect(column.cards).toEqual([])
      expect(column.id).toBeDefined()
    })

    it('should throw InvalidNameError for empty name', () => {
      expect(() =>
        Column.create({ name: '', order: 0, boardId: 'board-123' })
      ).toThrow(InvalidNameError)
    })

    it('should throw InvalidNameError for name exceeding 100 characters', () => {
      const longName = 'a'.repeat(101)
      expect(() =>
        Column.create({ name: longName, order: 0, boardId: 'board-123' })
      ).toThrow(InvalidNameError)
    })
  })

  describe('card management', () => {
    it('should add a card to the column', () => {
      const column = Column.create({
        name: 'To Do',
        order: 0,
        boardId: 'board-123',
      })
      const card = Card.create({
        title: 'My Task',
        columnId: column.id,
      })

      column.addCard(card)

      expect(column.cards).toHaveLength(1)
      expect(column.cards[0].title).toBe('My Task')
    })

    it('should remove a card from the column', () => {
      const column = Column.create({
        name: 'To Do',
        order: 0,
        boardId: 'board-123',
      })
      const card = Card.create({
        title: 'My Task',
        columnId: column.id,
      })

      column.addCard(card)
      column.removeCard(card.id)

      expect(column.cards).toHaveLength(0)
    })

    it('should check if card exists in column', () => {
      const column = Column.create({
        name: 'To Do',
        order: 0,
        boardId: 'board-123',
      })
      const card = Card.create({
        title: 'My Task',
        columnId: column.id,
      })

      column.addCard(card)

      expect(column.hasCard(card.id)).toBe(true)
      expect(column.hasCard('non-existent')).toBe(false)
    })

    it('should return card count', () => {
      const column = Column.create({
        name: 'To Do',
        order: 0,
        boardId: 'board-123',
      })

      expect(column.getCardCount()).toBe(0)

      const card1 = Card.create({ title: 'Task 1', columnId: column.id })
      const card2 = Card.create({ title: 'Task 2', columnId: column.id })

      column.addCard(card1)
      column.addCard(card2)

      expect(column.getCardCount()).toBe(2)
    })
  })
})
