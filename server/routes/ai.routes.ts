import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validation';

const router = Router();

router.use(authMiddleware);

router.get('/tips', AIController.getHealthTips);
router.post('/explain', validateBody(['name', 'dosage']), AIController.explainMedication);

export default router;
