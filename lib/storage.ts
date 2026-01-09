import { IDBPDatabase, openDB } from 'idb';

const DB_NAME = 'degen-analyst-db';
const DB_VERSION = 1;
const STORE_ANALYSIS = 'analyses';
const STORE_LOGS = 'logs';

interface AnalysisRecord {
  id: string;
  ticker: string;
  timestamp: number;
  score: number;
  result: 'PASS' | 'RISK' | 'FAIL';
  identity?: any; // TokenIdentity
  data: any; // Full snapshot
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_ANALYSIS)) {
          const store = db.createObjectStore(STORE_ANALYSIS, { keyPath: 'id' });
          store.createIndex('ticker', 'ticker');
          store.createIndex('timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains(STORE_LOGS)) {
          db.createObjectStore(STORE_LOGS, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

export const storage = {
  async saveAnalysis(record: AnalysisRecord) {
    const db = await getDB();
    await db.put(STORE_ANALYSIS, record);
  },

  async getAnalysis(id: string): Promise<AnalysisRecord | undefined> {
    const db = await getDB();
    return db.get(STORE_ANALYSIS, id);
  },

  async getAllAnalyses(): Promise<AnalysisRecord[]> {
    const db = await getDB();
    return db.getAllFromIndex(STORE_ANALYSIS, 'timestamp');
  },

  async deleteAnalysis(id: string) {
    const db = await getDB();
    await db.delete(STORE_ANALYSIS, id);
  },

  // Auth Helpers (LocalStorage is sufficient for simple auth tokens/state)
  setAuth(authenticated: boolean) {
    if (typeof window === 'undefined') return;
    if (authenticated) {
      localStorage.setItem('auth_session', Date.now().toString());
    } else {
      localStorage.removeItem('auth_session');
      // API Key is env-based now, no need to clear.
    }
  },

  checkAuth(timeoutMinutes = 60): boolean {
    if (typeof window === 'undefined') return false;
    const session = localStorage.getItem('auth_session');
    if (!session) return false;

    const age = Date.now() - parseInt(session, 10);
    const maxAge = timeoutMinutes * 60 * 1000;

    if (age > maxAge) {
      this.setAuth(false);
      return false;
    }

    // Refresh session on activity
    this.setAuth(true);
    return true;
  },

  // API Key now managed via ENV
  saveApiKey(key: string) {
    // No-op: User requested ENV storage only.
    console.warn("API Key saving is disabled. Use NEXT_PUBLIC_OPENAI_API_KEY in .env");
  },

  getApiKey(): string | null {
    return process.env.NEXT_PUBLIC_OPENAI_API_KEY || null;
  }
};
