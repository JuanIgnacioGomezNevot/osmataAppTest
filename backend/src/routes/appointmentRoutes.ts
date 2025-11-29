import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import {
  adminAppointments,
  cancel,
  createAppointment,
  deleteAppointment,
  getAvailableAppointments,
  myAppointments,
  reserve,
} from '../controllers/appointmentController';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.get('/available', authenticate, authorize(['AFILIADO']), getAvailableAppointments);
router.post(
  '/:id/reserve',
  authenticate,
  authorize(['AFILIADO', 'EMPLEADO', 'ADMIN']),
  [
    body('afiliadoId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('afiliadoId debe ser numérico')
      .toInt()
      .custom((value, { req }) => {
        if (req.user?.role !== 'AFILIADO' && !value) {
          throw new Error('Debes indicar el afiliado para reservar.');
        }
        return true;
      }),
  ],
  validateRequest,
  reserve
);
router.post('/:id/cancel', authenticate, authorize(['AFILIADO', 'EMPLEADO', 'ADMIN']), cancel);
router.get('/my', authenticate, authorize(['AFILIADO']), myAppointments);
router.get('/', authenticate, authorize(['EMPLEADO', 'ADMIN']), adminAppointments);
router.post(
  '/',
  authenticate,
  authorize(['EMPLEADO', 'ADMIN']),
  [
    body('sectorId').isInt({ min: 1 }),
    body('doctorId').isInt({ min: 1 }),
    body('appointmentTypeId').isInt({ min: 1 }),
    body('fechaHoraInicio').isISO8601(),
    body('fechaHoraFin').optional().isISO8601(),
  ],
  validateRequest,
  createAppointment
);
router.delete('/:id', authenticate, authorize(['EMPLEADO', 'ADMIN']), deleteAppointment);

export default router;
