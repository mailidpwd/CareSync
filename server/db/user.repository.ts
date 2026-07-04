import { Database } from './database';
import { User, UserSettings } from '../../src/types';

export class UserRepository {
  static getById(id: string): User | undefined {
    const db = Database.get();
    return db.users.find(u => u.id === id);
  }

  static getByEmail(email: string): User | undefined {
    const db = Database.get();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  static create(user: User): User {
    Database.update(db => {
      db.users.push(user);
    });
    return user;
  }

  static updateSettings(userId: string, settings: Partial<UserSettings>): User | undefined {
    let updatedUser: User | undefined;
    Database.update(db => {
      const idx = db.users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        db.users[idx].settings = {
          ...db.users[idx].settings,
          ...settings,
          reminderPreferences: {
            ...db.users[idx].settings.reminderPreferences,
            ...(settings.reminderPreferences || {})
          }
        };
        updatedUser = db.users[idx];
      }
    });
    return updatedUser;
  }

  static updateProfile(userId: string, name: string, email: string): User | undefined {
    let updatedUser: User | undefined;
    Database.update(db => {
      const idx = db.users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        db.users[idx].name = name;
        db.users[idx].email = email;
        updatedUser = db.users[idx];
      }
    });
    return updatedUser;
  }
}
