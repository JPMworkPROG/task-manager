import { AsyncLocalStorage } from 'async_hooks'
import type { Request } from 'express'
import { logger } from './logger.js'

const REQUEST_ID_HEADER = 'x-request-id'

const requestIdStorage = new AsyncLocalStorage<string>()

export function runWithRequestId(requestId: string, callback: () => void): void {
  requestIdStorage.run(requestId, callback)
}

export function getLogger() {
  const requestId = requestIdStorage.getStore()
  
  if (requestId) {
    return logger.child({ requestId })
  }
  
  return logger
}

export function getLoggerFromRequest(req: Request) {
  const requestId = req.headers[REQUEST_ID_HEADER] as string || 'unknown'
  return logger.child({ requestId })
}
