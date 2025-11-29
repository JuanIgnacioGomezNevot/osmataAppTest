import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { getHistorialStock, getTurnosPorSector } from '../controllers/reportController';

const router = Router();

router.use(authenticate, authorize(['ADMIN']));
router.get('/turnos', getTurnosPorSector);
router.get('/stock', getHistorialStock);

export default router;
