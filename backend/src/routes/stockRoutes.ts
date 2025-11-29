import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { adjustStock, createStock, deleteStock, getStock, updateStock } from '../controllers/stockController';
import { validateRequest } from '../middlewares/validateRequest';
import { StockCategories } from '../types/domain';

const router = Router();

router.use(authenticate, authorize(['EMPLEADO', 'ADMIN']));

router.get('/', getStock);
router.post(
  '/',
  [
    body('nombre').notEmpty(),
    body('categoria').isIn([...StockCategories]),
    body('cantidadActual').isInt({ min: 0 }),
  ],
  validateRequest,
  createStock
);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);
router.post(
  '/:id/adjust',
  [
    body('delta')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Debés enviar un entero')
      .custom((value) => Number(value) !== 0)
      .withMessage('La variación no puede ser 0'),
  ],
  validateRequest,
  adjustStock
);

export default router;
