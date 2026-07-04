/**
 * Strongly-typed API client for CareSync
 */

const API_BASE = '/api';

export class APIClient {
  private static getToken(): string | null {
    return localStorage.getItem('caresync_token') || 'user-123'; // Seed fallback
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // Auth API
  static async login(credentials: any): Promise<any> {
    const res = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    localStorage.setItem('caresync_token', res.token);
    return res;
  }

  static async signup(userData: any): Promise<any> {
    const res = await this.request<any>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    localStorage.setItem('caresync_token', res.token);
    return res;
  }

  static async getCurrentUser(): Promise<any> {
    return this.request<any>('/auth/me');
  }

  static async updateSettings(settings: any): Promise<any> {
    return this.request<any>('/auth/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  static async updateProfile(profile: { name: string; email: string }): Promise<any> {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }

  // Medicines API
  static async getMedicines(): Promise<any> {
    return this.request<any>('/medicines');
  }

  static async createMedicine(medicine: any): Promise<any> {
    return this.request<any>('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicine)
    });
  }

  static async updateMedicine(id: string, medicine: any): Promise<any> {
    return this.request<any>('/medicines/' + id, {
      method: 'PUT',
      body: JSON.stringify(medicine)
    });
  }

  static async deleteMedicine(id: string): Promise<any> {
    return this.request<any>('/medicines/' + id, {
      method: 'DELETE'
    });
  }

  // Reminders API
  static async getReminders(date?: string): Promise<any> {
    const query = date ? `?date=${date}` : '';
    return this.request<any>(`/medicines/reminders${query}`);
  }

  static async updateReminderStatus(id: string, status: 'taken' | 'missed' | 'pending'): Promise<any> {
    return this.request<any>(`/medicines/reminders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Trackers API
  static async getHealthScore(): Promise<any> {
    return this.request<any>('/trackers/health-score');
  }

  static async getMoods(): Promise<any> {
    return this.request<any>('/trackers/mood');
  }

  static async addMood(mood: any): Promise<any> {
    return this.request<any>('/trackers/mood', {
      method: 'POST',
      body: JSON.stringify(mood)
    });
  }

  static async getWater(date?: string): Promise<any> {
    const query = date ? `?date=${date}` : '';
    return this.request<any>(`/trackers/water${query}`);
  }

  static async addWater(amountMl: number, date?: string): Promise<any> {
    return this.request<any>('/trackers/water', {
      method: 'POST',
      body: JSON.stringify({ amountMl, date })
    });
  }

  static async getSleep(): Promise<any> {
    return this.request<any>('/trackers/sleep');
  }

  static async addSleep(sleep: any): Promise<any> {
    return this.request<any>('/trackers/sleep', {
      method: 'POST',
      body: JSON.stringify(sleep)
    });
  }

  static async getWorkouts(): Promise<any> {
    return this.request<any>('/trackers/workouts');
  }

  static async addWorkout(workout: any): Promise<any> {
    return this.request<any>('/trackers/workouts', {
      method: 'POST',
      body: JSON.stringify(workout)
    });
  }

  static async getNotifications(): Promise<any> {
    return this.request<any>('/trackers/notifications');
  }

  static async markNotificationsRead(): Promise<any> {
    return this.request<any>('/trackers/notifications/read', {
      method: 'POST'
    });
  }

  // AI Advice API
  static async getAITips(): Promise<any> {
    return this.request<any>('/ai/tips');
  }

  static async explainMedicine(name: string, dosage: string, notes: string): Promise<any> {
    return this.request<any>('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ name, dosage, notes })
    });
  }
}
export default APIClient;
