import { Database } from './database';
import { Medicine, Reminder } from '../../src/types';

export class MedicineRepository {
  static getAll(userId: string): Medicine[] {
    return Database.get().medicines.filter(m => m.userId === userId);
  }

  static getById(id: string): Medicine | undefined {
    return Database.get().medicines.find(m => m.id === id);
  }

  static create(medicine: Omit<Medicine, 'id' | 'createdAt' | 'missedDoseCounter' | 'adherenceStreak'>): Medicine {
    const newMed: Medicine = {
      ...medicine,
      id: 'med-' + Math.random().toString(36).substr(2, 9),
      missedDoseCounter: 0,
      adherenceStreak: 0,
      createdAt: new Date().toISOString()
    };

    Database.update(db => {
      db.medicines.push(newMed);
    });

    // Auto generate reminders for today and next 3 days
    this.generateRemindersForMedicine(newMed);

    return newMed;
  }

  static update(id: string, medicineData: Partial<Medicine>): Medicine | undefined {
    let updated: Medicine | undefined;
    Database.update(db => {
      const idx = db.medicines.findIndex(m => m.id === id);
      if (idx !== -1) {
        db.medicines[idx] = {
          ...db.medicines[idx],
          ...medicineData
        } as Medicine;
        updated = db.medicines[idx];
      }
    });

    if (updated) {
      // Regenerate pending reminders
      this.regenerateRemindersForMedicine(updated);
    }

    return updated;
  }

  static delete(id: string): boolean {
    let deleted = false;
    Database.update(db => {
      const initialLength = db.medicines.length;
      db.medicines = db.medicines.filter(m => m.id !== id);
      // Clean up reminders for this medicine as well
      db.reminders = db.reminders.filter(r => r.medicineId !== id);
      deleted = db.medicines.length < initialLength;
    });
    return deleted;
  }

  // Reminders Repositories
  static getReminders(userId: string, dateStr?: string): Reminder[] {
    const db = Database.get();
    let reminders = db.reminders.filter(r => r.userId === userId);
    if (dateStr) {
      reminders = reminders.filter(r => r.scheduledDate === dateStr);
    }
    return reminders;
  }

  static updateReminderStatus(reminderId: string, status: 'taken' | 'missed' | 'pending'): Reminder | undefined {
    let updatedReminder: Reminder | undefined;
    
    Database.update(db => {
      const idx = db.reminders.findIndex(r => r.id === reminderId);
      if (idx !== -1) {
        const reminder = db.reminders[idx];
        reminder.status = status;
        reminder.takenAt = status === 'taken' ? new Date().toISOString() : undefined;
        updatedReminder = reminder;

        // Adherence streak / missed counter update
        const medicine = db.medicines.find(m => m.id === reminder.medicineId);
        if (medicine) {
          if (status === 'taken') {
            medicine.adherenceStreak += 1;
            if (medicine.missedDoseCounter > 0) {
              medicine.missedDoseCounter = Math.max(0, medicine.missedDoseCounter - 1);
            }
          } else if (status === 'missed') {
            medicine.adherenceStreak = 0;
            medicine.missedDoseCounter += 1;
          }
        }
      }
    });

    return updatedReminder;
  }

  private static generateRemindersForMedicine(medicine: Medicine) {
    const today = new Date();
    Database.update(db => {
      for (let i = 0; i < 4; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        // Check if reminders already exist for this medicine & date
        const exists = db.reminders.some(r => r.medicineId === medicine.id && r.scheduledDate === dateStr);
        if (exists) continue;

        const timeSlots: ('morning' | 'afternoon' | 'night')[] = [];
        if (medicine.morning) timeSlots.push('morning');
        if (medicine.afternoon) timeSlots.push('afternoon');
        if (medicine.night) timeSlots.push('night');

        for (const slot of timeSlots) {
          db.reminders.push({
            id: 'rem-' + Math.random().toString(36).substr(2, 9),
            userId: medicine.userId,
            medicineId: medicine.id,
            medicineName: medicine.name,
            dosage: medicine.dosage,
            timeSlot: slot,
            scheduledDate: dateStr,
            status: 'pending',
            createdAt: new Date().toISOString()
          });
        }
      }
    });
  }

  private static regenerateRemindersForMedicine(medicine: Medicine) {
    Database.update(db => {
      // Delete pending reminders for this medicine
      db.reminders = db.reminders.filter(r => r.medicineId === medicine.id && r.status !== 'pending');
    });
    // Generate new reminders
    this.generateRemindersForMedicine(medicine);
  }

  // Public scheduler trigger to ensure reminders are auto-populated for today if none exist
  static ensureRemindersForToday(userId: string) {
    const todayStr = new Date().toISOString().split('T')[0];
    const db = Database.get();
    const todayReminders = db.reminders.filter(r => r.userId === userId && r.scheduledDate === todayStr);
    
    if (todayReminders.length === 0) {
      const userMedicines = db.medicines.filter(m => m.userId === userId && m.reminderStatus);
      for (const med of userMedicines) {
        this.generateRemindersForMedicine(med);
      }
    }
  }
}
