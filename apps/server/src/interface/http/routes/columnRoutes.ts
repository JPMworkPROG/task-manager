import { Router } from 'express'
import { cardController } from '../controllers/CardController.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { columnIdParamSchema } from '../../validators/columnValidators.js'
import { createCardSchema } from '../../validators/cardValidators.js'

const router = Router()

router.post(
  '/:columnId/cards',
  validateRequest({ params: columnIdParamSchema, body: createCardSchema }),
  (req, res, next) => cardController.create(req, res, next)
)

export { router as columnRoutes }
