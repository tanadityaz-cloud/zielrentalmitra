import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool Setup
let pool: pg.Pool | null = null;
let isConnected = false;
let connectionError: string | null = null;

export function getDbPool(): pg.Pool | null {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  const host = process.env.PGHOST || process.env.SQL_HOST;
  const user = process.env.PGUSER || process.env.SQL_USER;
  const password = process.env.PGPASSWORD || process.env.SQL_PASSWORD;
  const database = process.env.PGDATABASE || process.env.SQL_DB_NAME;
  const port = parseInt(process.env.PGPORT || '5432', 10);
  const sslMode = process.env.PGSSLMODE || process.env.DB_SSL;

  // If connection parameters are configured
  if (connectionString || (host && database && user)) {
    try {
      const config: pg.PoolConfig = connectionString
        ? {
            connectionString,
            ssl: sslMode === 'disable' ? false : { rejectUnauthorized: false },
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
          }
        : {
            host,
            port,
            database,
            user,
            password,
            ssl: sslMode === 'require' || sslMode === 'true' ? { rejectUnauthorized: false } : false,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
          };

      pool = new Pool(config);

      pool.on('error', (err) => {
        console.error('Unexpected error on idle PostgreSQL client:', err);
        isConnected = false;
        connectionError = err.message;
      });

      // Probe connection in background
      pool.query('SELECT NOW() as current_time', (err, res) => {
        if (err) {
          console.warn('[PostgreSQL] Could not connect to external DB:', err.message);
          isConnected = false;
          connectionError = err.message;
        } else {
          console.log('[PostgreSQL] Successfully connected to database at:', res.rows[0]?.current_time);
          isConnected = true;
          connectionError = null;
        }
      });
    } catch (err: any) {
      console.warn('[PostgreSQL] Failed to initialize connection pool:', err.message);
      isConnected = false;
      connectionError = err.message;
    }
  } else {
    connectionError = 'No PostgreSQL credentials configured (DATABASE_URL / PGHOST). Running in local synced memory mode.';
  }

  return pool;
}

export async function checkDbConnection(): Promise<{
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
}> {
  const currentPool = getDbPool();
  if (!currentPool) {
    return {
      connected: false,
      type: 'synced_storage',
      message: 'PostgreSQL belum dikonfigurasi di file environment (.env). Menggunakan Local Sync Storage aktif.',
    };
  }

  try {
    const res = await currentPool.query('SELECT NOW() as current_time, current_database() as db_name, version() as pg_version');
    return {
      connected: true,
      type: 'postgresql',
      message: `Terhubung langsung ke PostgreSQL Database: ${res.rows[0]?.db_name}`,
      timestamp: res.rows[0]?.current_time,
      config: {
        host: process.env.PGHOST || 'custom_url',
        database: res.rows[0]?.db_name,
        user: process.env.PGUSER,
        port: parseInt(process.env.PGPORT || '5432', 10),
      },
    };
  } catch (err: any) {
    return {
      connected: false,
      type: 'synced_storage',
      message: `Koneksi PostgreSQL gagal: ${err.message}. Sistem berjalan dengan fallback synced storage.`,
    };
  }
}
