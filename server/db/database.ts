import fs from 'fs';
import path from 'path';
import { 
  User, Medicine, Reminder, MoodEntry, 
  WaterEntry, SleepEntry, Workout, Notification 
} from '../../src/types';

const DB_PATH = path.join(process.cwd(), 'server', 'db', 'db.json');

// Ensure db directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export interface DatabaseSchema {
  users: User[];
  medicines: Medicine[];
  reminders: Reminder[];
  moodEntries: MoodEntry[];
  waterEntries: WaterEntry[];
  sleepEntries: SleepEntry[];
  workouts: Workout[];
  notifications: Notification[];
}

const DEFAULT_USER_ID = 'user-123';

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: DEFAULT_USER_ID,
      name: 'Michael',
      email: 'michaelkillgta@gmail.com',
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'light',
        reminderPreferences: {
          browserNotifications: true,
          emailReminders: false
        },
        dailyWaterGoal: 2500,
        dailySleepGoal: 8,
        dailyExerciseGoal: 30
      }
    }
  ],
  medicines: [
    {
      id: 'med-1',
      userId: DEFAULT_USER_ID,
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'daily',
      morning: true,
      afternoon: true,
      night: true,
      beforeFood: false,
      afterFood: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Take with full glass of water. Finish entire course.',
      reminderStatus: true,
      missedDoseCounter: 0,
      adherenceStreak: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'med-2',
      userId: DEFAULT_USER_ID,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'daily',
      morning: true,
      afternoon: false,
      night: false,
      beforeFood: true,
      afterFood: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Blood pressure medication. Take at same time every morning.',
      reminderStatus: true,
      missedDoseCounter: 1,
      adherenceStreak: 12,
      createdAt: new Date().toISOString()
    }
  ],
  reminders: [],
  moodEntries: [
    {
      id: 'mood-1',
      userId: DEFAULT_USER_ID,
      emoji: '😄',
      stressLevel: 3,
      energyLevel: 8,
      journal: 'Felt really productive today. Had a good run in the morning.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'mood-2',
      userId: DEFAULT_USER_ID,
      emoji: '🙂',
      stressLevel: 5,
      energyLevel: 6,
      journal: 'Slept a bit late, but overall a decent day at work.',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  waterEntries: [
    {
      id: 'water-1',
      userId: DEFAULT_USER_ID,
      amountMl: 500,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    },
    {
      id: 'water-2',
      userId: DEFAULT_USER_ID,
      amountMl: 250,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    }
  ],
  sleepEntries: [
    {
      id: 'sleep-1',
      userId: DEFAULT_USER_ID,
      sleepStart: new Date(Date.now() - 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000).toISOString(),
      wakeTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      durationHours: 8,
      quality: 4,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
  ],
  workouts: [
    {
      id: 'work-1',
      userId: DEFAULT_USER_ID,
      name: 'Morning Jog',
      durationMinutes: 30,
      caloriesBurned: 320,
      steps: 4200,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      userId: DEFAULT_USER_ID,
      title: 'Welcome to CareSync!',
      message: 'Track your health adherence, water, sleep, exercise and mood daily.',
      type: 'milestone',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ]
};

// Auto-seed reminders for today
const todayStr = new Date().toISOString().split('T')[0];
INITIAL_DATA.reminders = [
  {
    id: 'rem-1',
    userId: DEFAULT_USER_ID,
    medicineId: 'med-1',
    medicineName: 'Amoxicillin',
    dosage: '500mg',
    timeSlot: 'morning',
    scheduledDate: todayStr,
    status: 'taken',
    takenAt: new Date(new Date().setHours(8, 0, 0)).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'rem-2',
    userId: DEFAULT_USER_ID,
    medicineId: 'med-1',
    medicineName: 'Amoxicillin',
    dosage: '500mg',
    timeSlot: 'afternoon',
    scheduledDate: todayStr,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rem-3',
    userId: DEFAULT_USER_ID,
    medicineId: 'med-2',
    medicineName: 'Lisinopril',
    dosage: '10mg',
    timeSlot: 'morning',
    scheduledDate: todayStr,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export class Database {
  private static load(): DatabaseSchema {
    if (!fs.existsSync(DB_PATH)) {
      this.save(INITIAL_DATA);
      return INITIAL_DATA;
    }
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error loading database, resetting...', e);
      this.save(INITIAL_DATA);
      return INITIAL_DATA;
    }
  }

  private static save(data: DatabaseSchema): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }

  public static get(): DatabaseSchema {
    return this.load();
  }

  public static update(updater: (data: DatabaseSchema) => void): DatabaseSchema {
    const data = this.load();
    updater(data);
    this.save(data);
    return data;
  }
}
