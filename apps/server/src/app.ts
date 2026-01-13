import express, { type Express } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import { parse } from 'yaml'
import { resolve } from 'path'
import { errorHandler } from './interface/http/middlewares/errorHandler.js'
import { notFoundHandler } from './interface/http/middlewares/notFoundHandler.js'
import { requestIdMiddleware } from './interface/http/middlewares/requestId.js'
import { requestLoggerMiddleware } from './interface/http/middlewares/requestLogger.js'
import { boardRoutes } from './interface/http/routes/boardRoutes.js'
import { columnRoutes } from './interface/http/routes/columnRoutes.js'
import { cardRoutes } from './interface/http/routes/cardRoutes.js'

const app: Express = express()

app.use(cors())
app.use(express.json())
app.use(requestIdMiddleware)
app.use(requestLoggerMiddleware)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Swagger UI - OpenAPI Documentation
const openApiPath = resolve(process.cwd(), 'documentation/openapi.yaml')
const openApiSpec = parse(readFileSync(openApiPath, 'utf-8'))

app.use('/openapi', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Mini-Kanban API Documentation',
}))

app.use('/boards', boardRoutes)
app.use('/columns', columnRoutes)
app.use('/cards', cardRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export { app }
