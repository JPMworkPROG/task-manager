import { describe, it, expect } from 'vitest'
import { Name } from '../../../../src/domain/value-objects/Name.js'
import { InvalidNameError } from '../../../../src/domain/errors/DomainError.js'

describe('Name Value Object', () => {
  describe('create', () => {
    it('should create a valid name', () => {
      const name = Name.create('Valid Name', 'Board')
      expect(name.getValue()).toBe('Valid Name')
    })

    it('should trim whitespace', () => {
      const name = Name.create('  Trimmed Name  ', 'Board')
      expect(name.getValue()).toBe('Trimmed Name')
    })

    it('should throw for empty value', () => {
      expect(() => Name.create('', 'Board')).toThrow(InvalidNameError)
    })

    it('should throw for whitespace-only value', () => {
      expect(() => Name.create('   ', 'Board')).toThrow(InvalidNameError)
    })

    it('should throw for value exceeding 100 characters', () => {
      const longName = 'a'.repeat(101)
      expect(() => Name.create(longName, 'Board')).toThrow(InvalidNameError)
    })

    it('should accept exactly 100 characters', () => {
      const validName = 'a'.repeat(100)
      const name = Name.create(validName, 'Board')
      expect(name.getValue()).toBe(validName)
    })
  })

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = Name.create('Test', 'Board')
      const name2 = Name.create('Test', 'Board')
      expect(name1.equals(name2)).toBe(true)
    })

    it('should return false for different names', () => {
      const name1 = Name.create('Test1', 'Board')
      const name2 = Name.create('Test2', 'Board')
      expect(name1.equals(name2)).toBe(false)
    })
  })
})
