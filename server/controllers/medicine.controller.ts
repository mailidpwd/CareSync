import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { MedicineRepository } from '../db/medicine.repository';

export class MedicineController {
  static getMedicines(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }
    const medicines = MedicineRepository.getAll(req.user.id);
    res.json({ medicines });
  }

  static createMedicine(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }
    const { 
      name, dosage, frequency, morning, afternoon, night, 
      beforeFood, afterFood, startDate, endDate, notes, reminderStatus 
    } = req.body;

    if (!name || !dosage) {
       res.status(400).json({ error: 'Name and dosage are required' });
       return;
    }

    const med = MedicineRepository.create({
      userId: req.user.id,
      name,
      dosage,
      frequency: frequency || 'daily',
      morning: !!morning,
      afternoon: !!afternoon,
      night: !!night,
      beforeFood: !!beforeFood,
      afterFood: !!afterFood,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      notes: notes || '',
      reminderStatus: reminderStatus !== false
    });

    res.status(201).json({ medicine: med });
  }

  static updateMedicine(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }
    const { id } = req.params;
    const med = MedicineRepository.getById(id);
    if (!med || med.userId !== req.user.id) {
       res.status(404).json({ error: 'Medicine not found or access denied' });
       return;
    }

    const updated = MedicineRepository.update(id, req.body);
    res.json({ medicine: updated });
  }

  static deleteMedicine(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }
    const { id } = req.params;
    const med = MedicineRepository.getById(id);
    if (!med || med.userId !== req.user.id) {
       res.status(404).json({ error: 'Medicine not found or access denied' });
       return;
    }

    MedicineRepository.delete(id);
    res.json({ success: true });
  }

  static getReminders(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }
    const { date } = req.query;
    // Make sure today's reminders exist
    MedicineRepository.ensureRemindersForToday(req.user.id);
    
    const reminders = MedicineRepository.getReminders(req.user.id, date as string);
    res.json({ reminders });
  }

  static updateReminderStatus(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }
    const { id } = req.params;
    const { status } = req.body;

    if (!['taken', 'missed', 'pending'].includes(status)) {
       res.status(400).json({ error: 'Invalid reminder status' });
       return;
    }

    const updated = MedicineRepository.updateReminderStatus(id, status);
    if (!updated) {
       res.status(404).json({ error: 'Reminder not found' });
       return;
    }

    res.json({ reminder: updated });
  }
}
