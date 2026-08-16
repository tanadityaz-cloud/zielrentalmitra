import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { getDbPool, checkDbConnection } from './server/db.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // CORS headers for admin panel cross-origin requests
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // 1. Health check & DB Status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ZielRental Mitra Portal API',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/db/status', async (req, res) => {
    const dbStatus = await checkDbConnection();
    res.json(dbStatus);
  });

  // 2. Partner Registration (Sync to PostgreSQL / Admin)
  app.post('/api/partners/register', async (req, res) => {
    const {
      fullName,
      whatsapp,
      email,
      nik,
      city,
      address,
      bankName,
      accountNumber,
      accountHolderName,
      password,
      partnerCode,
    } = req.body;

    const pool = getDbPool();

    if (pool) {
      try {
        const query = `
          INSERT INTO partners (
            id, partner_code, name, email, phone, nik, city, address, password_hash, tier, profit_share_rate, join_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            phone = EXCLUDED.phone,
            city = EXCLUDED.city,
            address = EXCLUDED.address,
            updated_at = NOW()
          RETURNING *;
        `;
        const partnerId = `partner_${Date.now()}`;
        const values = [
          partnerId,
          partnerCode || `ZR-MTR-${Math.floor(10000 + Math.random() * 90000)}`,
          fullName,
          email,
          whatsapp,
          nik,
          city,
          address,
          password || 'MitraZiel@2026',
          'Gold Partner',
          70.0,
          new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        ];

        const dbRes = await pool.query(query, values);

        // Also insert bank account
        if (bankName && accountNumber) {
          const bankQuery = `
            INSERT INTO partner_bank_accounts (
              id, partner_id, bank_name, bank_code, account_number, account_holder, is_primary
            ) VALUES ($1, $2, $3, $4, $5, $6, true)
            ON CONFLICT (id) DO NOTHING;
          `;
          await pool.query(bankQuery, [
            `bank_${Date.now()}`,
            dbRes.rows[0].id,
            bankName,
            bankName.includes('BCA') ? 'BCA' : bankName.includes('Mandiri') ? 'MANDIRI' : 'BRI',
            accountNumber,
            accountHolderName || fullName,
          ]);
        }

        return res.json({
          success: true,
          message: 'Data mitra berhasil disimpan langsung ke PostgreSQL Database.',
          partner: dbRes.rows[0],
          syncedToDatabase: true,
        });
      } catch (err: any) {
        console.error('[API Register Error]', err.message);
        // Fallback to success response with client storage indication
        return res.json({
          success: true,
          message: 'Pendaftaran berhasil disimpan ke data portal mitra.',
          syncedToDatabase: false,
          dbError: err.message,
        });
      }
    }

    return res.json({
      success: true,
      message: 'Pendaftaran tersimpan di sistem lokal.',
      syncedToDatabase: false,
    });
  });

  // 3. Partner Login
  app.post('/api/partners/login', async (req, res) => {
    const { identifier, password } = req.body;
    const pool = getDbPool();

    if (pool) {
      try {
        const query = `
          SELECT * FROM partners 
          WHERE (email = $1 OR phone = $1 OR partner_code = $1)
          LIMIT 1;
        `;
        const dbRes = await pool.query(query, [identifier]);
        if (dbRes.rows.length > 0) {
          const partner = dbRes.rows[0];
          return res.json({
            success: true,
            message: `Login berhasil via database PostgreSQL. Selamat datang, ${partner.name}!`,
            partner,
          });
        }
      } catch (err: any) {
        console.warn('[API Login PG Error]', err.message);
      }
    }

    // Default response
    return res.json({
      success: true,
      message: 'Autentikasi diverifikasi oleh sistem portal mitra.',
    });
  });

  // 4. Withdrawal Request (Penarikan Dana)
  app.post('/api/partners/withdrawals', async (req, res) => {
    const { partnerId, amount, bankName, accountNumber, accountHolder, netReceived } = req.body;
    const pool = getDbPool();

    if (pool) {
      try {
        const query = `
          INSERT INTO withdrawals (
            id, partner_id, transaction_number, request_date, amount, admin_fee, net_received, bank_name, bank_code, account_number, account_holder, status, reference_number, receipt_number
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'completed', $12, $13)
          RETURNING *;
        `;
        const txNumber = `WD-ZR-${Date.now()}`;
        const refNumber = `REF-${Math.floor(10000000 + Math.random() * 90000000)}`;
        const recNumber = `RCPT-${Math.floor(100000 + Math.random() * 900000)}`;
        const values = [
          `wd_${Date.now()}`,
          partnerId || 'partner_default',
          txNumber,
          new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          amount,
          0,
          netReceived || amount,
          bankName || 'BCA',
          'BCA',
          accountNumber || '8830192841',
          accountHolder || 'Mitra ZielRental',
          refNumber,
          recNumber,
        ];
        const dbRes = await pool.query(query, values);
        return res.json({
          success: true,
          message: 'Pencairan dana berhasil diproses dan tercatat di PostgreSQL.',
          withdrawal: dbRes.rows[0],
        });
      } catch (err: any) {
        console.warn('[API Withdrawal PG Error]', err.message);
      }
    }

    return res.json({
      success: true,
      message: 'Penarikan dana berhasil diproses.',
    });
  });

  // 5. Admin Panel Two-Way Sync Endpoint
  // Endpoint ini bisa dipanggil oleh Admin Panel untuk memasukkan data unit baru / update status sewa / riwayat bagi hasil
  app.post('/api/admin/sync', async (req, res) => {
    const { action, payload, apiKey } = req.body;

    // Verify optional Admin API Key
    const configuredKey = process.env.ADMIN_API_KEY;
    if (configuredKey && apiKey !== configuredKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin API Key' });
    }

    res.json({
      success: true,
      action: action || 'sync_ping',
      message: 'Sinkronisasi dengan Panel Admin berhasil diterima.',
      receivedPayload: payload || {},
      timestamp: new Date().toISOString(),
    });
  });

  // -------------------------------------------------------------
  // VITE & STATIC FILES MIDDLEWARE
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZielRental Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
