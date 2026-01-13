import { Router } from 'express'
import { boardController } from '../controllers/BoardController.js'
import { columnController } from '../controllers/ColumnController.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { createBoardSchema, boardIdParamSchema } from '../../validators/boardValidators.js'
import { createColumnSchema } from '../../validators/columnValidators.js'

const router = Router()

router.get('/', (req, res, next) => boardController.getAll(req, res, next))

router.post(
  '/',
  validateRequest({ body: createBoardSchema }),
  (req, res, next) => boardController.create(req, res, next)
)

router.get(
  '/:boardId',
  validateRequest({ params: boardIdParamSchema }),
  (req, res, next) => boardController.getById(req, res, next)
)

router.post(
  '/:boardId/columns',
  validateRequest({ params: boardIdParamSchema, body: createColumnSchema }),
  (req, res, next) => columnController.create(req, res, next)
)

export { router as boardRoutes }
