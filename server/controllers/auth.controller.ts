import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { UserRepository } from '../db/user.repository';
import { User } from '../../src/types';

export class AuthController {
  static login(req: AuthenticatedRequest, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
       res.status(400).json({ error: 'Email and password are required' });
       return;
    }

    const user = UserRepository.getByEmail(email);
    if (!user) {
       res.status(401).json({ error: 'Invalid email or password' });
       return;
    }

    // Success - return user as session token (token is simply user ID)
    res.json({
      user,
      token: user.id
    });
  }

  static signup(req: AuthenticatedRequest, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
       res.status(400).json({ error: 'Name, email, and password are required' });
       return;
    }

    const existing = UserRepository.getByEmail(email);
    if (existing) {
       res.status(400).json({ error: 'Email already registered' });
       return;
    }

    const newUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'light',
        reminderPreferences: {
          browserNotifications: true,
          emailReminders: false
        },
        dailyWaterGoal: 2000,
        dailySleepGoal: 8,
        dailyExerciseGoal: 30
      }
    };

    UserRepository.create(newUser);

    res.status(201).json({
      user: newUser,
      token: newUser.id
    });
  }

  static getCurrentUser(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Not authenticated' });
       return;
    }
    const user = UserRepository.getById(req.user.id);
    res.json({ user });
  }

  static updateSettings(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Not authenticated' });
       return;
    }
    const updated = UserRepository.updateSettings(req.user.id, req.body);
    if (!updated) {
       res.status(404).json({ error: 'User not found' });
       return;
    }
    res.json({ user: updated });
  }

  static updateProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Not authenticated' });
       return;
    }
    const { name, email } = req.body;
    const updated = UserRepository.updateProfile(req.user.id, name, email);
    if (!updated) {
       res.status(404).json({ error: 'User not found' });
       return;
    }
    res.json({ user: updated });
  }
}
