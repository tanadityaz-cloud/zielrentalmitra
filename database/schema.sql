-- ====================================================================
-- DATABASE SCHEMA: ZIELRENTAL MITRA & ADMIN SHARED POSTGRESQL DATABASE
-- Gunakan skrip SQL ini di PostgreSQL / Supabase / Neon / Cloud SQL Anda
-- untuk menghubungkan Panel Mitra dan Panel Admin secara real-time.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL: PARTNERS (Data Mitra Pemilik Aset)
CREATE TABLE IF NOT EXISTS partners (
    id VARCHAR(64) PRIMARY KEY,
    partner_code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    nik VARCHAR(32),
    city VARCHAR(128),
    address TEXT,
    password_hash VARCHAR(255) NOT NULL,
    avatar TEXT,
    tier VARCHAR(64) DEFAULT 'Gold Partner',
    tier_badge_color VARCHAR(128) DEFAULT 'from-amber-400 to-amber-600',
    profit_share_rate NUMERIC(5, 2) DEFAULT 70.00,
    join_date VARCHAR(64),
    total_units INTEGER DEFAULT 0,
    active_units INTEGER DEFAULT 0,
    kyc_status VARCHAR(32) DEFAULT 'Verified',
    npwp VARCHAR(64) DEFAULT '00.000.000.0-000.000',
    id_card_number VARCHAR(64),
    account_manager_name VARCHAR(128) DEFAULT 'Siti Nurhaliza, S.Psi.',
    account_manager_role VARCHAR(128) DEFAULT 'Partner Relationship & Care Officer',
    account_manager_phone VARCHAR(64) DEFAULT '+62 811-9876-5432',
    account_manager_email VARCHAR(128) DEFAULT 'siti.care@zielrental.co.id',
    available_balance BIGINT DEFAULT 0,
    withdrawn_total BIGINT DEFAULT 0,
    lifetime_earnings BIGINT DEFAULT 0,
    this_month_earnings BIGINT DEFAULT 0,
    pending_payout BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL: PARTNER BANK ACCOUNTS (Rekening Pencairan Mitra)
CREATE TABLE IF NOT EXISTS partner_bank_accounts (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    bank_name VARCHAR(128) NOT NULL,
    bank_code VARCHAR(32) NOT NULL,
    account_number VARCHAR(64) NOT NULL,
    account_holder VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL: VEHICLE UNITS (Unit Aset Perlengkapan Bayi & Mainan Anak)
CREATE TABLE IF NOT EXISTS vehicle_units (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    product_code VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    brand VARCHAR(128) NOT NULL,
    license_plate VARCHAR(64), -- Serial Number / Kode Fisik Unit
    year INTEGER DEFAULT 2024,
    status VARCHAR(32) DEFAULT 'available', -- 'available' | 'rented' | 'maintenance' | 'inspection' | 'cleaning'
    daily_rate BIGINT DEFAULT 0,
    current_month_revenue BIGINT DEFAULT 0,
    total_lifetime_revenue BIGINT DEFAULT 0,
    image TEXT,
    condition VARCHAR(64) DEFAULT 'Sangat Baik (Grade A)',
    last_service_date VARCHAR(64),
    cleanliness_status VARCHAR(64) DEFAULT 'Telah Disterilisasi UV & Deep Cleaning',
    odometer_days INTEGER DEFAULT 0,
    specs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL: PROFIT SHARE TRANSACTIONS (Riwayat Bagi Hasil Sewa)
CREATE TABLE IF NOT EXISTS profit_share_transactions (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    transaction_number VARCHAR(64) NOT NULL,
    date VARCHAR(64) NOT NULL,
    period VARCHAR(64) NOT NULL,
    unit_code VARCHAR(64) NOT NULL,
    unit_name VARCHAR(255) NOT NULL,
    customer_name VARCHAR(128),
    rental_duration VARCHAR(64),
    gross_rental_amount BIGINT DEFAULT 0,
    partner_share_percentage NUMERIC(5, 2) DEFAULT 70.00,
    partner_share_amount BIGINT DEFAULT 0,
    operational_deduction BIGINT DEFAULT 0,
    net_payout_amount BIGINT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'paid', -- 'paid' | 'pending' | 'processing'
    invoice_number VARCHAR(64),
    payout_date VARCHAR(64),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL: CASH TRANSACTIONS (Arus Kas Masuk & Keluar)
CREATE TABLE IF NOT EXISTS cash_transactions (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    date VARCHAR(64) NOT NULL,
    type VARCHAR(32) NOT NULL, -- 'inflow' | 'outflow'
    category VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    reference_id VARCHAR(64),
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    status VARCHAR(32) DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABEL: WITHDRAWALS (Pengajuan & Riwayat Penarikan Saldo Mitra)
CREATE TABLE IF NOT EXISTS withdrawals (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    transaction_number VARCHAR(64) NOT NULL,
    request_date VARCHAR(64) NOT NULL,
    completed_date VARCHAR(64),
    amount BIGINT NOT NULL,
    admin_fee BIGINT DEFAULT 0,
    net_received BIGINT NOT NULL,
    bank_name VARCHAR(128) NOT NULL,
    bank_code VARCHAR(32) NOT NULL,
    account_number VARCHAR(64) NOT NULL,
    account_holder VARCHAR(255) NOT NULL,
    status VARCHAR(32) DEFAULT 'completed', -- 'completed' | 'processing' | 'pending' | 'rejected'
    reference_number VARCHAR(64),
    receipt_number VARCHAR(64),
    processed_by VARCHAR(128) DEFAULT 'Sistem Otomatis BI-FAST ZielRental',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABEL: UNIT DOCUMENTS (Dokumen Legalitas & QC Unit)
CREATE TABLE IF NOT EXISTS unit_documents (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    product_code VARCHAR(64) NOT NULL,
    unit_name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL, -- 'INVOICE_PURCHASE' | 'WARRANTY_CARD' | 'MANUAL_BOOK' | 'QC_CERTIFICATE' | 'INSURANCE' | 'CONTRACT'
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(32),
    upload_date VARCHAR(64) NOT NULL,
    expiry_date VARCHAR(64),
    status VARCHAR(32) DEFAULT 'valid', -- 'valid' | 'expiring_soon' | 'expired' | 'pending_verification'
    verified_by VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABEL: NOTIFICATIONS (Notifikasi Mitra)
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp VARCHAR(64) NOT NULL,
    type VARCHAR(32) DEFAULT 'info', -- 'maintenance' | 'rental' | 'finance' | 'document' | 'info'
    is_read BOOLEAN DEFAULT false,
    target_page VARCHAR(64),
    target_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES UNTUK PERFORMA QUERY
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_code ON partners(partner_code);
CREATE INDEX IF NOT EXISTS idx_vehicles_partner ON vehicle_units(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_share_partner ON profit_share_transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_partner ON withdrawals(partner_id);
CREATE INDEX IF NOT EXISTS idx_documents_partner ON unit_documents(partner_id);
