import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ApplicationError } from '../../../application/errors/ApplicationError.js'
import { DomainError } from '../../../domain/errors/DomainError.js'
import { logger } from '../../../infrastructure/config/logger.js'

interface ErrorResponse {
  message: string
  code: string
  details?: Record<string, unknown>
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void {
  const requestId = req.headers['x-request-id'] as string || 'unknown'
  const childLogger = logger.child({ requestId })

  childLogger.error({ err: error }, 'Request error')

  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: {
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    })
    return
  }

  if (error instanceof ApplicationError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    })
    return
  }

  if (error instanceof DomainError) {
    res.status(400).json({
      message: error.message,
      code: error.code,
    })
    return
  }

  res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  })
}
