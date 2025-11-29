import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import appointmentRoutes from './appointmentRoutes';
import stockRoutes from './stockRoutes';
import catalogRoutes from './catalogRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/stock', stockRoutes);
router.use('/catalog', catalogRoutes);
router.use('/reports', reportRoutes);

export default router;
