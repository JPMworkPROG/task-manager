import { InvalidTitleError } from '../errors/DomainError.js'

export class Title {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Title {
    if (!value || value.trim().length === 0) {
      throw new InvalidTitleError('cannot be empty')
    }

    const trimmedValue = value.trim()

    if (trimmedValue.length > 200) {
      throw new InvalidTitleError('cannot exceed 200 characters')
    }

    return new Title(trimmedValue)
  }

  getValue(): string {
    return this.value
  }

  equals(other: Title): boolean {
    return this.value === other.value
  }
}
