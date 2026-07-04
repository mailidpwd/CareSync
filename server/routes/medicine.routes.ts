import { Router } from 'express';
import { MedicineController } from '../controllers/medicine.controller';
import { authMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validation';

const router = Router();

router.use(authMiddleware);

router.get('/', MedicineController.getMedicines);
router.post('/', validateBody(['name', 'dosage']), MedicineController.createMedicine);
router.put('/:id', MedicineController.updateMedicine);
router.delete('/:id', MedicineController.deleteMedicine);

// Reminders
router.get('/reminders', MedicineController.getReminders);
router.put('/reminders/:id/status', validateBody(['status']), MedicineController.updateReminderStatus);

export default router;
