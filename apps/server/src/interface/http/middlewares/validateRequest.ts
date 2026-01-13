import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

interface ValidateOptions {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

export function validateRequest(options: ValidateOptions) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (options.body) {
        req.body = options.body.parse(req.body)
      }
      if (options.params) {
        req.params = options.params.parse(req.params) as typeof req.params
      }
      if (options.query) {
        req.query = options.query.parse(req.query) as typeof req.query
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
