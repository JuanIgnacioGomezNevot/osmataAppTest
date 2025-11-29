import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { getMe, updateMe, adminListUsers, changeRole, createStaff } from '../controllers/userController';
import { validateRequest } from '../middlewares/validateRequest';
import { Roles } from '../types/domain';

const router = Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, [body('nombre').notEmpty(), body('apellido').notEmpty()], validateRequest, updateMe);

router.get('/', authenticate, authorize(['ADMIN', 'EMPLEADO']), adminListUsers);
router.patch(
  '/:id/role',
  authenticate,
  authorize(['ADMIN']),
  [body('role').isIn([...Roles])],
  validateRequest,
  changeRole
);
router.post(
  '/',
  authenticate,
  authorize(['ADMIN']),
  [body('email').isEmail(), body('password').isLength({ min: 6 }), body('role').isIn(['EMPLEADO', 'ADMIN'])],
  validateRequest,
  createStaff
);

export default router;
