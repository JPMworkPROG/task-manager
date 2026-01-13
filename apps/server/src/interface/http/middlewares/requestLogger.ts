import type { Request, Response, NextFunction } from 'express'
import { logger } from '../../../infrastructure/config/logger.js'

const REQUEST_ID_HEADER = 'x-request-id'

function sanitizeBody(body: unknown): unknown {
   if (!body || typeof body !== 'object') {
      return body
   }

   const sanitized = { ...body } as Record<string, unknown>
   const sensitiveFields = ['password', 'token', 'secret', 'authorization']

   for (const field of sensitiveFields) {
      if (field in sanitized) {
         sanitized[field] = '***REDACTED***'
      }
   }

   return sanitized
}

export function requestLoggerMiddleware(
   req: Request,
   res: Response,
   next: NextFunction
): void {
   const startTime = Date.now()
   const requestId = req.headers[REQUEST_ID_HEADER] as string || 'unknown'

   const childLogger = logger.child({ requestId })

   const requestLog: Record<string, unknown> = {
      method: req.method,
      url: req.url,
      path: req.path,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
   }

   if (Object.keys(req.query).length > 0) {
      requestLog.query = req.query
   }

   if (Object.keys(req.params).length > 0) {
      requestLog.params = req.params
   }

   if (req.body && Object.keys(req.body).length > 0) {
      requestLog.body = sanitizeBody(req.body)
   }

   childLogger.info(requestLog, 'Incoming request')

   res.on('finish', () => {
      const durationMs = Date.now() - startTime
      const responseLog = {
         method: req.method,
         url: req.url,
         statusCode: res.statusCode,
         duration: `${durationMs}ms`,
      }

      const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'
      childLogger[logLevel](responseLog, 'Request completed')
   })

   next()
}
