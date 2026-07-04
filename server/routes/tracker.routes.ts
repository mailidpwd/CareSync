import { Router } from 'express';
import { TrackerController } from '../controllers/tracker.controller';
import { authMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validation';

const router = Router();

router.use(authMiddleware);

// Health Score Summary
router.get('/health-score', TrackerController.getHealthScore);

// Mood
router.get('/mood', TrackerController.getMoods);
router.post('/mood', validateBody(['emoji', 'stressLevel', 'energyLevel']), TrackerController.addMood);

// Water
router.get('/water', TrackerController.getWater);
router.post('/water', validateBody(['amountMl']), TrackerController.addWater);

// Sleep
router.get('/sleep', TrackerController.getSleep);
router.post('/sleep', validateBody(['sleepStart', 'wakeTime', 'durationHours', 'quality']), TrackerController.addSleep);

// Workouts
router.get('/workouts', TrackerController.getWorkouts);
router.post('/workouts', validateBody(['name', 'durationMinutes']), TrackerController.addWorkout);

// Notifications
router.get('/notifications', TrackerController.getNotifications);
router.post('/notifications/read', TrackerController.readNotifications);

export default router;
