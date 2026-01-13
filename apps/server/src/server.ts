import 'dotenv/config'
import { app } from './app.js'
import { env } from './infrastructure/config/env.js'
import { prisma } from './infrastructure/database/prisma.js'
import { logger } from './infrastructure/config/logger.js'

async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect()
    logger.info('Database connected successfully')

    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT, environment: env.NODE_ENV }, 'Server started')
    })
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server')
    await prisma.$disconnect()
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

bootstrap()
