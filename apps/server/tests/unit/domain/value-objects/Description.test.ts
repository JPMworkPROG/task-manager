import { describe, it, expect } from 'vitest'
import { Description } from '../../../../src/domain/value-objects/Description.js'
import { InvalidDescriptionError } from '../../../../src/domain/errors/DomainError.js'

describe('Description Value Object', () => {
  describe('create', () => {
    it('should create a valid description', () => {
      const description = Description.create('This is a valid description')
      expect(description.getValue()).toBe('This is a valid description')
    })

    it('should trim whitespace from description', () => {
      const description = Description.create('  Trimmed description  ')
      expect(description.getValue()).toBe('Trimmed description')
    })

    it('should accept description with exactly 1000 characters', () => {
      const validDescription = 'a'.repeat(1000)
      const description = Description.create(validDescription)
      expect(description.getValue()).toBe(validDescription)
    })

    it('should return null for null input', () => {
      const description = Description.create(null)
      expect(description.getValue()).toBeNull()
      expect(description.isEmpty()).toBe(true)
    })

    it('should return null for undefined input', () => {
      const description = Description.create(undefined)
      expect(description.getValue()).toBeNull()
      expect(description.isEmpty()).toBe(true)
    })

    it('should return null for empty string', () => {
      const description = Description.create('')
      expect(description.getValue()).toBeNull()
      expect(description.isEmpty()).toBe(true)
    })

    it('should return null for whitespace-only string', () => {
      const description = Description.create('   ')
      expect(description.getValue()).toBeNull()
      expect(description.isEmpty()).toBe(true)
    })

    it('should throw InvalidDescriptionError for description exceeding 1000 characters', () => {
      const longDescription = 'a'.repeat(1001)
      expect(() => Description.create(longDescription)).toThrow(InvalidDescriptionError)
      expect(() => Description.create(longDescription)).toThrow('Invalid card description: cannot exceed 1000 characters')
    })
  })

  describe('isEmpty', () => {
    it('should return true for null description', () => {
      const description = Description.create(null)
      expect(description.isEmpty()).toBe(true)
    })

    it('should return false for valid description', () => {
      const description = Description.create('Some content')
      expect(description.isEmpty()).toBe(false)
    })
  })

  describe('equals', () => {
    it('should return true for descriptions with same value', () => {
      const desc1 = Description.create('Same description')
      const desc2 = Description.create('Same description')
      expect(desc1.equals(desc2)).toBe(true)
    })

    it('should return false for descriptions with different values', () => {
      const desc1 = Description.create('Description One')
      const desc2 = Description.create('Description Two')
      expect(desc1.equals(desc2)).toBe(false)
    })

    it('should return true for both null descriptions', () => {
      const desc1 = Description.create(null)
      const desc2 = Description.create(null)
      expect(desc1.equals(desc2)).toBe(true)
    })

    it('should return false when one is null and other is not', () => {
      const desc1 = Description.create(null)
      const desc2 = Description.create('Some value')
      expect(desc1.equals(desc2)).toBe(false)
    })
  })
})
