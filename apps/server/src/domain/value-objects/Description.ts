import { InvalidDescriptionError } from '../errors/DomainError.js'

export class Description {
  private readonly value: string | null

  private constructor(value: string | null) {
    this.value = value
  }

  static create(value: string | null | undefined): Description {
    if (value === null || value === undefined) {
      return new Description(null)
    }

    const trimmedValue = value.trim()

    if (trimmedValue.length === 0) {
      return new Description(null)
    }

    if (trimmedValue.length > 1000) {
      throw new InvalidDescriptionError('cannot exceed 1000 characters')
    }

    return new Description(trimmedValue)
  }

  getValue(): string | null {
    return this.value
  }

  isEmpty(): boolean {
    return this.value === null
  }

  equals(other: Description): boolean {
    return this.value === other.value
  }
}
