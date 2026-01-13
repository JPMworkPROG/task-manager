import type { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { runWithRequestId } from '../../../infrastructure/config/loggerHelper.js'

const REQUEST_ID_HEADER = 'x-request-id'

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.headers[REQUEST_ID_HEADER] as string || uuidv4()

  req.headers[REQUEST_ID_HEADER] = requestId
  res.setHeader(REQUEST_ID_HEADER, requestId)

  runWithRequestId(requestId, () => {
    next()
  })
}
