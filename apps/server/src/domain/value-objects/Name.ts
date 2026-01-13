import { InvalidNameError } from '../errors/DomainError.js'

export class Name {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string, entityName: string): Name {
    if (!value || value.trim().length === 0) {
      throw new InvalidNameError(entityName, 'cannot be empty')
    }

    const trimmedValue = value.trim()

    if (trimmedValue.length > 100) {
      throw new InvalidNameError(entityName, 'cannot exceed 100 characters')
    }

    return new Name(trimmedValue)
  }

  getValue(): string {
    return this.value
  }

  equals(other: Name): boolean {
    return this.value === other.value
  }
}
