import { describe, it, expect } from 'vitest'
import { Title } from '../../../../src/domain/value-objects/Title.js'
import { InvalidTitleError } from '../../../../src/domain/errors/DomainError.js'

describe('Title Value Object', () => {
  describe('create', () => {
    it('should create a valid title', () => {
      const title = Title.create('Valid Task Title')
      expect(title.getValue()).toBe('Valid Task Title')
    })

    it('should trim whitespace from title', () => {
      const title = Title.create('  Trimmed Title  ')
      expect(title.getValue()).toBe('Trimmed Title')
    })

    it('should accept title with exactly 200 characters', () => {
      const validTitle = 'a'.repeat(200)
      const title = Title.create(validTitle)
      expect(title.getValue()).toBe(validTitle)
    })

    it('should throw InvalidTitleError for empty title', () => {
      expect(() => Title.create('')).toThrow(InvalidTitleError)
      expect(() => Title.create('')).toThrow('Invalid card title: cannot be empty')
    })

    it('should throw InvalidTitleError for whitespace-only title', () => {
      expect(() => Title.create('   ')).toThrow(InvalidTitleError)
    })

    it('should throw InvalidTitleError for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201)
      expect(() => Title.create(longTitle)).toThrow(InvalidTitleError)
      expect(() => Title.create(longTitle)).toThrow('Invalid card title: cannot exceed 200 characters')
    })
  })

  describe('equals', () => {
    it('should return true for titles with same value', () => {
      const title1 = Title.create('Same Title')
      const title2 = Title.create('Same Title')
      expect(title1.equals(title2)).toBe(true)
    })

    it('should return false for titles with different values', () => {
      const title1 = Title.create('Title One')
      const title2 = Title.create('Title Two')
      expect(title1.equals(title2)).toBe(false)
    })

    it('should handle trimmed equality', () => {
      const title1 = Title.create('  Same Title  ')
      const title2 = Title.create('Same Title')
      expect(title1.equals(title2)).toBe(true)
    })
  })
})
