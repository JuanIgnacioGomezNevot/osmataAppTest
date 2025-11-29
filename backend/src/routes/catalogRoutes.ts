import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import {
  createSectorHandler,
  deleteSectorHandler,
  getSectors,
  updateSectorHandler,
} from '../controllers/sectorController';
import {
  createDoctorHandler,
  deleteDoctorHandler,
  getDoctors,
  updateDoctorHandler,
} from '../controllers/doctorController';
import { validateRequest } from '../middlewares/validateRequest';
import { getAppointmentTypes } from '../controllers/appointmentTypeController';

const router = Router();

router.get('/sectors', authenticate, getSectors);
router.get('/doctors', authenticate, getDoctors);
router.get('/appointment-types', authenticate, getAppointmentTypes);

router.post(
  '/sectors',
  authenticate,
  authorize(['ADMIN']),
  [body('nombre').notEmpty()],
  validateRequest,
  createSectorHandler
);
router.put('/sectors/:id', authenticate, authorize(['ADMIN']), updateSectorHandler);
router.delete('/sectors/:id', authenticate, authorize(['ADMIN']), deleteSectorHandler);

router.post(
  '/doctors',
  authenticate,
  authorize(['ADMIN']),
  [body('nombre').notEmpty(), body('apellido').notEmpty(), body('sectorId').isInt()],
  validateRequest,
  createDoctorHandler
);
router.put('/doctors/:id', authenticate, authorize(['ADMIN']), updateDoctorHandler);
router.delete('/doctors/:id', authenticate, authorize(['ADMIN']), deleteDoctorHandler);

export default router;
