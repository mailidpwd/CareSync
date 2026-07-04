import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AIService } from '../services/ai.service';
import { MedicineRepository } from '../db/medicine.repository';
import { TrackerRepository } from '../db/tracker.repository';

export class AIController {
  static async getHealthTips(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }

    // Build context string about user's current health metrics
    const medicines = MedicineRepository.getAll(req.user.id);
    const water = TrackerRepository.getWater(req.user.id);
    const workouts = TrackerRepository.getWorkouts(req.user.id);
    const moods = TrackerRepository.getMoods(req.user.id);

    const context = `
      User: ${req.user.name}
      Medicines active: ${medicines.map(m => `${m.name} (${m.dosage}, streak: ${m.adherenceStreak} days, missed: ${m.missedDoseCounter} times)`).join(', ') || 'none'}
      Water tracked entries count: ${water.length}
      Workouts recorded count: ${workouts.length}
      Recent mood logs count: ${moods.length}
    `;

    const tips = await AIService.generateHealthTips(context);
    res.json({ tips });
  }

  static async explainMedication(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }
    const { name, dosage, notes } = req.body;
    if (!name || !dosage) {
       res.status(400).json({ error: 'Medication name and dosage are required' });
       return;
    }

    const explanation = await AIService.explainMedication(name, dosage, notes || '');
    res.json({ explanation });
  }
}
