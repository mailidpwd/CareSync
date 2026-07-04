/**
 * CareSync - Shared Type Definitions
 * Good Health and Well-being (UN SDG 3)
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  reminderPreferences: {
    browserNotifications: boolean;
    emailReminders: boolean;
  };
  dailyWaterGoal: number; // in ml
  dailySleepGoal: number; // in hours
  dailyExerciseGoal: number; // in minutes
}

export interface Medicine {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string; // 'daily' | 'weekly' | 'custom'
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  beforeFood: boolean;
  afterFood: boolean;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  notes: string;
  reminderStatus: boolean; // active/inactive
  missedDoseCounter: number;
  adherenceStreak: number;
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  timeSlot: 'morning' | 'afternoon' | 'night';
  scheduledDate: string; // YYYY-MM-DD
  status: 'pending' | 'taken' | 'missed';
  takenAt?: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  emoji: string; // 😢, 😐, 🙂, 😄, 🤩
  stressLevel: number; // 1 to 10
  energyLevel: number; // 1 to 10
  journal: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface WaterEntry {
  id: string;
  userId: string;
  amountMl: number;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface SleepEntry {
  id: string;
  userId: string;
  sleepStart: string; // ISO String
  wakeTime: string; // ISO String
  durationHours: number;
  quality: number; // 1 to 5
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  durationMinutes: number;
  caloriesBurned: number;
  steps: number;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'milestone' | 'alert';
  isRead: boolean;
  createdAt: string;
}

export interface HealthScore {
  score: number; // 0 to 100
  breakdown: {
    medicineAdherence: number;
    waterIntake: number;
    sleepDuration: number;
    exerciseProgress: number;
    moodStability: number;
  };
  weeklyTrend: { date: string; score: number }[];
}

export interface AIHealthTip {
  id: string;
  category: 'medication' | 'lifestyle' | 'sleep' | 'hydration' | 'general';
  title: string;
  content: string;
  actionable: string;
  createdAt: string;
}
