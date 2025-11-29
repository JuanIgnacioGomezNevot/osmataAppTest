import { Router } from 'express';
import { body } from 'express-validator';
import { forgotPassword, register, resetPassword, signIn } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post(
  '/register',
  [
    body('nombre').notEmpty().withMessage('Nombre obligatorio'),
    body('apellido').notEmpty(),
    body('dni').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validateRequest,
  signIn
);

router.post('/password/forgot', [body('email').isEmail()], validateRequest, forgotPassword);
router.post(
  '/password/reset',
  [body('token').notEmpty(), body('password').isLength({ min: 6 })],
  validateRequest,
  resetPassword
);

export default router;
