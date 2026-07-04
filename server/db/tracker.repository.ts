import { Database } from './database';
import { MoodEntry, WaterEntry, SleepEntry, Workout, Notification } from '../../src/types';

export class TrackerRepository {
  // Mood Tracker
  static getMoods(userId: string): MoodEntry[] {
    return Database.get().moodEntries.filter(m => m.userId === userId);
  }

  static addMood(userId: string, entry: Omit<MoodEntry, 'id' | 'userId' | 'createdAt'>): MoodEntry {
    const newEntry: MoodEntry = {
      ...entry,
      id: 'mood-' + Math.random().toString(36).substr(2, 9),
      userId,
      createdAt: new Date().toISOString()
    };
    Database.update(db => {
      db.moodEntries.push(newEntry);
    });
    return newEntry;
  }

  // Water Tracker
  static getWater(userId: string, dateStr?: string): WaterEntry[] {
    const db = Database.get();
    let entries = db.waterEntries.filter(w => w.userId === userId);
    if (dateStr) {
      entries = entries.filter(w => w.date === dateStr);
    }
    return entries;
  }

  static addWater(userId: string, amountMl: number, dateStr: string): WaterEntry {
    const newEntry: WaterEntry = {
      id: 'water-' + Math.random().toString(36).substr(2, 9),
      userId,
      amountMl,
      date: dateStr,
      createdAt: new Date().toISOString()
    };
    Database.update(db => {
      db.waterEntries.push(newEntry);
    });
    return newEntry;
  }

  // Sleep Tracker
  static getSleep(userId: string): SleepEntry[] {
    return Database.get().sleepEntries.filter(s => s.userId === userId);
  }

  static addSleep(userId: string, entry: Omit<SleepEntry, 'id' | 'userId' | 'createdAt'>): SleepEntry {
    const newEntry: SleepEntry = {
      ...entry,
      id: 'sleep-' + Math.random().toString(36).substr(2, 9),
      userId,
      createdAt: new Date().toISOString()
    };
    Database.update(db => {
      db.sleepEntries.push(newEntry);
    });
    return newEntry;
  }

  // Exercise/Workout Tracker
  static getWorkouts(userId: string): Workout[] {
    return Database.get().workouts.filter(w => w.userId === userId);
  }

  static addWorkout(userId: string, entry: Omit<Workout, 'id' | 'userId' | 'createdAt'>): Workout {
    const newEntry: Workout = {
      ...entry,
      id: 'work-' + Math.random().toString(36).substr(2, 9),
      userId,
      createdAt: new Date().toISOString()
    };
    Database.update(db => {
      db.workouts.push(newEntry);
    });
    return newEntry;
  }

  // Notifications
  static getNotifications(userId: string): Notification[] {
    return Database.get().notifications.filter(n => n.userId === userId);
  }

  static addNotification(userId: string, title: string, message: string, type: 'reminder' | 'milestone' | 'alert'): Notification {
    const newNotif: Notification = {
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    Database.update(db => {
      db.notifications.push(newNotif);
    });
    return newNotif;
  }

  static markNotificationsAsRead(userId: string): void {
    Database.update(db => {
      db.notifications.forEach(n => {
        if (n.userId === userId) {
          n.isRead = true;
        }
      });
    });
  }
}
