export abstract class DomainError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}

export class InvalidNameError extends DomainError {
  constructor(entityName: string, reason: string) {
    super(`Invalid ${entityName} name: ${reason}`, 'INVALID_NAME')
  }
}

export class InvalidTitleError extends DomainError {
  constructor(reason: string) {
    super(`Invalid card title: ${reason}`, 'INVALID_TITLE')
  }
}

export class InvalidDescriptionError extends DomainError {
  constructor(reason: string) {
    super(`Invalid card description: ${reason}`, 'INVALID_DESCRIPTION')
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id '${id}' not found`, 'NOT_FOUND')
  }
}

export class InvalidOperationError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_OPERATION')
  }
}
