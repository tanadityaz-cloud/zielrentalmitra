export type PageView =
  | 'login'
  | 'register'
  | 'dashboard'
  | 'assets'
  | 'unit-detail'
  | 'performance'
  | 'profit-share'
  | 'cashflow'
  | 'withdrawal'
  | 'withdrawal-history'
  | 'documents'
  | 'profit-share-detail';

export type UnitStatus =
  | 'rented' // Sedang Disewa
  | 'available' // Tersedia di Gudang / Siap Sewa
  | 'maintenance' // Perlu Perbaikan / Pengecekan
  | 'laundry' // Sedang Laundry & Sterilisasi UV
  | 'inspection' // Pemeriksaan Pasca Pengembalian
  | 'idle'; // Standby

export type UnitCategory =
  | 'Peralatan Bayi (Gear)'
  | 'Perlengkapan Jalan-jalan'
  | 'Perlengkapan Tidur'
  | 'Perlengkapan Makan'
  | 'Mainan & Edukasi'
  | 'Perlengkapan Mandi'
  | 'Outdoor & Playground';

export type CleanlinessGrade = 'Steril & Higienis (UV-C)' | 'Bersih & Siap Pakai' | 'Perlu Laundry' | 'Dalam Proses Cuci';

export interface BabyProductSpec {
  ageRecommendation: string; // e.g. '0 - 36 Bulan', '6 Bulan - 4 Tahun'
  maxWeight: string; // e.g. 'Hingga 22 kg'
  dimensions: string; // e.g. '85 x 50 x 105 cm'
  productWeight: string; // e.g. '6.8 kg'
  color: string; // e.g. 'Sage Green / Matte Gray'
  material: string; // e.g. 'Aluminium Alloy & Organic Cotton Breathable Fabric'
  storageLocation: string; // e.g. 'Hub Cilandak - Rak B2'
  cleanlinessStatus: CleanlinessGrade;
  lastSterilizationDate: string; // e.g. '12 Mei 2025'
  safetyCertification: string; // e.g. 'SNI ISO 9001, EN 1888-2 Certified'
  completenessChecklist: string[]; // ['Unit Utama', 'Kanopi UV50+', 'Raincover Transparan', 'Bumper Bar', 'Buku Manual', 'Bantal Newborn']
}

export interface UnitDocument {
  id: string;
  unitId: string;
  unitName: string;
  productCode: string; // e.g. 'U-ST-00098'
  type: 'Sertifikat Keamanan SNI' | 'Faktur Pembelian Unit' | 'Buku Manual & Garansi' | 'Polis Asuransi Barang' | 'Sertifikat Higienis / Lab' | 'Foto Inspeksi Masuk';
  docNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired' | 'pending_verification';
  fileUrl: string;
  fileName: string;
  fileSize: string;
  verifiedBy?: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  unitId: string;
  date: string;
  maintenanceType: 'Sterilisasi & Laundry UV-C' | 'Pemeriksaan Keamanan & Baut' | 'Deep Cleaning & Sanitasi' | 'Penggantian Roda / Aksesoris' | 'Perbaikan Rangka / Mekanikal';
  workshop: string; // e.g. 'ZielCare Hygiene Hub Jakarta'
  cost: number;
  status: 'Selesai' | 'Dalam Pengerjaan' | 'Dijadwalkan';
  description: string;
  hygieneSealNumber?: string;
}

export interface RentalBooking {
  id: string;
  unitId: string;
  bookingCode: string;
  renterName: string;
  renterPhone: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  grossAmount: number;
  netPartnerShare: number;
  status: 'Selesai' | 'Sedang Berjalan' | 'Mendatang' | 'Dibatalkan';
  deliveryArea: string; // e.g. 'Kebayoran Baru, Jakarta Selatan'
  hygieneSealNumber: string;
  rating?: number;
  review?: string;
}

export interface BabyAssetUnit {
  id: string;
  productCode: string; // e.g. 'U-ST-00098'
  name: string;
  brand: string;
  model: string;
  category: UnitCategory;
  purchaseYear: number;
  status: UnitStatus;
  dailyRate: number; // e.g. 50000 / day
  weeklyRate?: number;
  monthlyRate?: number;
  thumbnail: string;
  images: string[];
  specs: BabyProductSpec;
  currentMonthRevenue: number;
  totalLifetimeRevenue: number;
  utilizationRate: number; // percentage e.g. 88.5
  totalBookings: number;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  contractExpiryDate: string;
  nextMaintenanceDate: string;
  documents: UnitDocument[];
  maintenanceHistory: MaintenanceRecord[];
  rentalHistory: RentalBooking[];
}

// Alias for seamless context compatibility
export type VehicleUnit = BabyAssetUnit;

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: 'BCA' | 'MANDIRI' | 'BNI' | 'BRI' | 'BSI' | 'CIMB';
  accountNumber: string;
  accountHolder: string;
  isPrimary: boolean;
  logoUrl?: string;
}

export interface WithdrawalTransaction {
  id: string;
  transactionNumber: string;
  requestDate: string;
  completedDate?: string;
  amount: number;
  adminFee: number;
  netReceived: number;
  bankAccount: BankAccount;
  status: 'completed' | 'processing' | 'cancelled' | 'rejected';
  referenceNumber: string;
  notes?: string;
  receiptNumber: string;
  processedBy?: string;
}

export interface ProfitShareTransaction {
  id: string;
  transactionCode: string;
  invoiceCode: string;
  bookingId: string;
  unitId: string;
  unitName: string;
  productCode: string;
  date: string;
  renterName: string;
  rentalDuration: string;
  grossAmount: number;
  platformFeePercent: number; // e.g. 15
  platformFeeAmount: number;
  operationalMaintenancePercent: number; // e.g. 10 (Laundry, Hygiene & Maintenance)
  operationalMaintenanceAmount: number;
  insuranceProtectionPercent: number; // e.g. 5 (Product Damage Protection)
  insuranceProtectionAmount: number;
  taxAmount: number;
  partnerSharePercent: number; // e.g. 70
  partnerShareAmount: number;
  status: 'available' | 'processing' | 'withdrawn' | 'cancelled';
  payoutStatus: 'Tersedia' | 'Diproses' | 'Sudah Dicairkan';
  timeline: {
    step: string;
    date: string;
    completed: boolean;
  }[];
}

export interface CashTransaction {
  id: string;
  date: string;
  type: 'inflow' | 'outflow';
  category: 'Bagi Hasil Sewa' | 'Penarikan Kas' | 'Bonus Performa' | 'Penyesuaian' | 'Klaim Proteksi';
  description: string;
  referenceId: string;
  amount: number;
  balanceAfter: number;
  status: 'success' | 'pending' | 'failed';
}

export interface PartnerProfile {
  id: string;
  partnerCode: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: 'Gold Partner' | 'Platinum Partner' | 'Silver Partner';
  tierBadgeColor: string;
  profitShareRate: number; // 70%
  joinDate: string;
  totalUnits: number;
  activeUnits: number;
  assignedAccountManager: {
    name: string;
    role: string;
    phone: string;
    avatar: string;
    email: string;
  };
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  address: string;
  npwp: string;
  idCardNumber: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'finance' | 'document' | 'maintenance' | 'booking' | 'system';
  isRead: boolean;
  targetPage?: PageView;
  targetId?: string;
}
