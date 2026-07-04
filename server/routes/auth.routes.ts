import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validation';

const router = Router();

router.post('/login', validateBody(['email', 'password']), AuthController.login);
router.post('/signup', validateBody(['name', 'email', 'password']), AuthController.signup);
router.get('/me', authMiddleware, AuthController.getCurrentUser);
router.put('/settings', authMiddleware, AuthController.updateSettings);
router.put('/profile', authMiddleware, validateBody(['name', 'email']), AuthController.updateProfile);

export default router;
