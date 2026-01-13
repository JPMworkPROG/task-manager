import { describe, it, expect } from 'vitest'
import { Board } from '../../../../src/domain/entities/Board.js'
import { Column } from '../../../../src/domain/entities/Column.js'
import { InvalidNameError } from '../../../../src/domain/errors/DomainError.js'

describe('Board Entity', () => {
  describe('create', () => {
    it('should create a board with valid name', () => {
      const board = Board.create({ name: 'My Project' })

      expect(board.name).toBe('My Project')
      expect(board.id).toBeDefined()
      expect(board.columns).toEqual([])
      expect(board.createdAt).toBeInstanceOf(Date)
      expect(board.updatedAt).toBeInstanceOf(Date)
    })

    it('should trim whitespace from name', () => {
      const board = Board.create({ name: '  My Project  ' })

      expect(board.name).toBe('My Project')
    })

    it('should throw InvalidNameError for empty name', () => {
      expect(() => Board.create({ name: '' })).toThrow(InvalidNameError)
    })

    it('should throw InvalidNameError for whitespace-only name', () => {
      expect(() => Board.create({ name: '   ' })).toThrow(InvalidNameError)
    })

    it('should throw InvalidNameError for name exceeding 100 characters', () => {
      const longName = 'a'.repeat(101)
      expect(() => Board.create({ name: longName })).toThrow(InvalidNameError)
    })

    it('should accept name with exactly 100 characters', () => {
      const validName = 'a'.repeat(100)
      const board = Board.create({ name: validName })

      expect(board.name).toBe(validName)
    })
  })

  describe('reconstitute', () => {
    it('should reconstitute a board from database data', () => {
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-01-02')

      const board = Board.reconstitute(
        'uuid-123',
        'Existing Board',
        [],
        createdAt,
        updatedAt
      )

      expect(board.id).toBe('uuid-123')
      expect(board.name).toBe('Existing Board')
      expect(board.createdAt).toEqual(createdAt)
      expect(board.updatedAt).toEqual(updatedAt)
    })
  })

  describe('column management', () => {
    it('should add a column to the board', () => {
      const board = Board.create({ name: 'My Board' })
      const column = Column.create({ name: 'To Do', order: 0, boardId: board.id })

      board.addColumn(column)

      expect(board.columns).toHaveLength(1)
      expect(board.columns[0].name).toBe('To Do')
    })

    it('should check if column exists', () => {
      const board = Board.create({ name: 'My Board' })
      const column = Column.create({ name: 'To Do', order: 0, boardId: board.id })

      board.addColumn(column)

      expect(board.hasColumn(column.id)).toBe(true)
      expect(board.hasColumn('non-existent')).toBe(false)
    })

    it('should get the next column order', () => {
      const board = Board.create({ name: 'My Board' })

      expect(board.getNextColumnOrder()).toBe(0)

      const column1 = Column.create({ name: 'To Do', order: 0, boardId: board.id })
      board.addColumn(column1)

      expect(board.getNextColumnOrder()).toBe(1)

      const column2 = Column.create({ name: 'Done', order: 5, boardId: board.id })
      board.addColumn(column2)

      expect(board.getNextColumnOrder()).toBe(6)
    })

    it('should return columns sorted by order', () => {
      const board = Board.create({ name: 'My Board' })
      const column1 = Column.create({ name: 'Done', order: 2, boardId: board.id })
      const column2 = Column.create({ name: 'To Do', order: 0, boardId: board.id })
      const column3 = Column.create({ name: 'In Progress', order: 1, boardId: board.id })

      board.addColumn(column1)
      board.addColumn(column2)
      board.addColumn(column3)

      const columns = board.columns
      expect(columns[0].name).toBe('To Do')
      expect(columns[1].name).toBe('In Progress')
      expect(columns[2].name).toBe('Done')
    })
  })

  describe('equals', () => {
    it('should return true for same board', () => {
      const board = Board.create({ name: 'My Board' })
      expect(board.equals(board)).toBe(true)
    })

    it('should return false for different boards', () => {
      const board1 = Board.create({ name: 'Board 1' })
      const board2 = Board.create({ name: 'Board 2' })
      expect(board1.equals(board2)).toBe(false)
    })

    it('should return false for null or undefined', () => {
      const board = Board.create({ name: 'My Board' })
      expect(board.equals(null as unknown as Board)).toBe(false)
      expect(board.equals(undefined as unknown as Board)).toBe(false)
    })
  })
})
