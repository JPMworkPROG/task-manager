import { Router } from 'express'
import { cardController } from '../controllers/CardController.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { cardIdParamSchema, updateCardSchema, moveCardSchema } from '../../validators/cardValidators.js'

const router = Router()

router.put(
  '/:cardId',
  validateRequest({ params: cardIdParamSchema, body: updateCardSchema }),
  (req, res, next) => cardController.update(req, res, next)
)

router.delete(
  '/:cardId',
  validateRequest({ params: cardIdParamSchema }),
  (req, res, next) => cardController.delete(req, res, next)
)

router.patch(
  '/:cardId/move',
  validateRequest({ params: cardIdParamSchema, body: moveCardSchema }),
  (req, res, next) => cardController.move(req, res, next)
)

export { router as cardRoutes }
