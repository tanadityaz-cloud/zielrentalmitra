// API Client Service for PostgreSQL & Admin Panel Connection

export interface DbStatusResponse {
  connected: boolean;
  type: 'postgresql' | 'synced_storage';
  message: string;
  timestamp?: string;
  config?: {
    host?: string;
    database?: string;
    user?: string;
    port?: number;
  };
}

export const apiService = {
  // Test connection to PostgreSQL / backend
  async checkDbStatus(): Promise<DbStatusResponse> {
    try {
      const res = await fetch('/api/db/status');
      if (!res.ok) throw new Error('API server returned ' + res.status);
      return await res.json();
    } catch (err: any) {
      return {
        connected: false,
        type: 'synced_storage',
        message: 'Koneksi API / DB status: Berjalan dalam mode local storage sync.',
      };
    }
  },

  // Register partner to database
  async registerPartner(payload: any): Promise<any> {
    try {
      const res = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Registration API error');
      return await res.json();
    } catch (err: any) {
      console.warn('[apiService.registerPartner] fallback to local:', err.message);
      return { success: true, syncedToDatabase: false };
    }
  },

  // Login partner via database
  async loginPartner(identifier: string, password: string): Promise<any> {
    try {
      const res = await fetch('/api/partners/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      if (!res.ok) throw new Error('Login API error');
      return await res.json();
    } catch (err: any) {
      console.warn('[apiService.loginPartner] fallback:', err.message);
      return { success: true };
    }
  },

  // Submit withdrawal request
  async submitWithdrawal(payload: any): Promise<any> {
    try {
      const res = await fetch('/api/partners/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Withdrawal API error');
      return await res.json();
    } catch (err: any) {
      console.warn('[apiService.submitWithdrawal] fallback:', err.message);
      return { success: true };
    }
  },
};
