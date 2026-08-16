import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageView,
  VehicleUnit,
  ProfitShareTransaction,
  CashTransaction,
  WithdrawalTransaction,
  UnitDocument,
  BankAccount,
  NotificationItem,
  PartnerProfile,
  RegisterPartnerData,
} from '../types';
import {
  mockPartner,
  mockVehicles,
  mockProfitShareTransactions,
  mockCashTransactions,
  mockWithdrawals,
  mockAllDocuments,
  mockBankAccounts,
  mockNotifications,
} from '../data/mockData';
import { apiService, DbStatusResponse } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface PartnerAccountRecord extends PartnerProfile {
  password?: string;
  bankAccounts: BankAccount[];
  availableBalance: number;
  withdrawnTotal: number;
  lifetimeEarnings: number;
  thisMonthEarnings: number;
  pendingPayout: number;
  vehicles: VehicleUnit[];
  documents: UnitDocument[];
  profitShareTransactions: ProfitShareTransaction[];
  cashTransactions: CashTransaction[];
  withdrawals: WithdrawalTransaction[];
}

const defaultRizkyAccount: PartnerAccountRecord = {
  ...mockPartner,
  password: 'MitraZiel@2026',
  bankAccounts: mockBankAccounts,
  availableBalance: 7985000,
  withdrawnTotal: 17000000,
  lifetimeEarnings: 24985000,
  thisMonthEarnings: 12850000,
  pendingPayout: 2450000,
  vehicles: mockVehicles,
  documents: mockAllDocuments,
  profitShareTransactions: mockProfitShareTransactions,
  cashTransactions: mockCashTransactions,
  withdrawals: mockWithdrawals,
};

const defaultSitiAccount: PartnerAccountRecord = {
  id: 'MITRA-1052',
  partnerCode: 'ZR-PTN-00105',
  name: 'Siti Nurhaliza & Partner',
  email: 'siti.nurhaliza@gmail.com',
  phone: '081198765432',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  tier: 'Platinum Partner',
  tierBadgeColor: 'from-purple-500 to-indigo-600',
  profitShareRate: 75,
  joinDate: '10 Januari 2023',
  totalUnits: 38,
  activeUnits: 32,
  assignedAccountManager: {
    name: 'Budi Santoso, S.T.',
    role: 'Senior Fleet Partner Specialist',
    phone: '+62 813-8877-6655',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'budi.care@zielrental.co.id',
  },
  kycStatus: 'Verified',
  address: 'Jl. Kemang Raya No. 18, Mampang Prapatan, Jakarta Selatan',
  npwp: '08.112.443.2-014.000',
  idCardNumber: '3174094508900002',
  password: 'MitraZiel@2026',
  bankAccounts: [
    {
      id: 'BA-SN-01',
      bankName: 'Bank Mandiri',
      bankCode: 'MANDIRI',
      accountNumber: '1370099887766',
      accountHolder: 'SITI NURHALIZA',
      isPrimary: true,
    },
    {
      id: 'BA-SN-02',
      bankName: 'Bank Central Asia (BCA)',
      bankCode: 'BCA',
      accountNumber: '8839918273',
      accountHolder: 'SITI NURHALIZA',
      isPrimary: false,
    },
  ],
  availableBalance: 12850000,
  withdrawnTotal: 45000000,
  lifetimeEarnings: 57850000,
  thisMonthEarnings: 28400000,
  pendingPayout: 4800000,
  vehicles: mockVehicles.map(v => ({
    ...v,
    id: `SN-${v.id}`,
    currentMonthRevenue: Math.round(v.currentMonthRevenue * 1.4),
    totalLifetimeRevenue: Math.round(v.totalLifetimeRevenue * 1.5),
  })),
  documents: mockAllDocuments,
  profitShareTransactions: mockProfitShareTransactions,
  cashTransactions: mockCashTransactions,
  withdrawals: mockWithdrawals,
};

interface AppContextType {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  partner: PartnerProfile;
  setPartner: React.Dispatch<React.SetStateAction<PartnerProfile>>;
  vehicles: VehicleUnit[];
  setVehicles: React.Dispatch<React.SetStateAction<VehicleUnit[]>>;
  selectedUnit: VehicleUnit | null;
  setSelectedUnit: (unit: VehicleUnit | null) => void;
  profitShareTransactions: ProfitShareTransaction[];
  selectedProfitShare: ProfitShareTransaction | null;
  setSelectedProfitShare: (trx: ProfitShareTransaction | null) => void;
  cashTransactions: CashTransaction[];
  withdrawals: WithdrawalTransaction[];
  documents: UnitDocument[];
  bankAccounts: BankAccount[];
  setBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Financial balances
  availableBalance: number;
  withdrawnTotal: number;
  lifetimeEarnings: number;
  thisMonthEarnings: number;
  pendingPayout: number;

  // Account & Auth operations
  registerPartner: (data: RegisterPartnerData) => PartnerProfile;
  loginWithCredentials: (identifier: string, password: string) => { success: boolean; message: string; partner?: PartnerProfile };
  loginDemo: (tier: 'Gold Partner' | 'Platinum Partner') => void;
  loginWithOtp: (phone: string, otp: string) => { success: boolean; message: string; partner?: PartnerProfile };
  logout: () => void;

  // Actions
  requestWithdrawal: (amount: number, bankAccountId: string, notes?: string) => Promise<boolean>;
  addDocument: (doc: Omit<UnitDocument, 'id'>) => void;
  updateVehicleStatus: (unitId: string, status: VehicleUnit['status']) => void;
  
  // UI states
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Modal states
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  isDocUploadModalOpen: boolean;
  setIsDocUploadModalOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  selectedReceiptWithdrawal: WithdrawalTransaction | null;
  setSelectedReceiptWithdrawal: (wd: WithdrawalTransaction | null) => void;
  selectedDocForPreview: UnitDocument | null;
  setSelectedDocForPreview: (doc: UnitDocument | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');
  
  // Accounts Storage
  const [accounts, setAccounts] = useState<PartnerAccountRecord[]>(() => {
    try {
      const saved = localStorage.getItem('zielrental_partner_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure default accounts exist if missing
          const hasRizky = parsed.some((a: any) => a.email.toLowerCase().includes('rizky.pratama'));
          const hasSiti = parsed.some((a: any) => a.email.toLowerCase().includes('siti.nurhaliza'));
          const result = [...parsed];
          if (!hasRizky) result.push(defaultRizkyAccount);
          if (!hasSiti) result.push(defaultSitiAccount);
          return result;
        }
      }
    } catch (e) {
      console.warn('Failed to load accounts from localStorage', e);
    }
    return [defaultRizkyAccount, defaultSitiAccount];
  });

  // Current active account
  const [activeAccountId, setActiveAccountId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('zielrental_active_partner_id');
      if (savedId) return savedId;
    } catch (e) {
      console.warn(e);
    }
    return defaultRizkyAccount.id;
  });

  // Active user data
  const currentAccount = accounts.find(a => a.id === activeAccountId) || accounts[0] || defaultRizkyAccount;

  const [partner, setPartner] = useState<PartnerProfile>(currentAccount);
  const [vehicles, setVehicles] = useState<VehicleUnit[]>(currentAccount.vehicles || mockVehicles);
  const [selectedUnit, setSelectedUnit] = useState<VehicleUnit | null>(currentAccount.vehicles?.[0] || mockVehicles[0]);
  const [profitShareTransactions, setProfitShareTransactions] = useState<ProfitShareTransaction[]>(
    currentAccount.profitShareTransactions || mockProfitShareTransactions
  );
  const [selectedProfitShare, setSelectedProfitShare] = useState<ProfitShareTransaction | null>(null);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>(
    currentAccount.cashTransactions || mockCashTransactions
  );
  const [withdrawals, setWithdrawals] = useState<WithdrawalTransaction[]>(
    currentAccount.withdrawals || mockWithdrawals
  );
  const [documents, setDocuments] = useState<UnitDocument[]>(
    currentAccount.documents || mockAllDocuments
  );
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(
    currentAccount.bankAccounts || mockBankAccounts
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  
  // UI & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDocUploadModalOpen, setIsDocUploadModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedReceiptWithdrawal, setSelectedReceiptWithdrawal] = useState<WithdrawalTransaction | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<UnitDocument | null>(null);

  // Financial calculations
  const [availableBalance, setAvailableBalance] = useState(currentAccount.availableBalance);
  const [withdrawnTotal, setWithdrawnTotal] = useState(currentAccount.withdrawnTotal);
  const [lifetimeEarnings, setLifetimeEarnings] = useState(currentAccount.lifetimeEarnings);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(currentAccount.thisMonthEarnings);
  const [pendingPayout, setPendingPayout] = useState(currentAccount.pendingPayout);

  // Save accounts when changed
  useEffect(() => {
    try {
      localStorage.setItem('zielrental_partner_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save accounts to localStorage', e);
    }
  }, [accounts]);

  // Save active account ID
  useEffect(() => {
    try {
      localStorage.setItem('zielrental_active_partner_id', activeAccountId);
    } catch (e) {
      console.warn('Failed to save active account ID', e);
    }
  }, [activeAccountId]);

  // Sync state when active account switches
  const loadAccountData = (acc: PartnerAccountRecord) => {
    setActiveAccountId(acc.id);
    setPartner(acc);
    setVehicles(acc.vehicles && acc.vehicles.length > 0 ? acc.vehicles : mockVehicles);
    setSelectedUnit(acc.vehicles?.[0] || mockVehicles[0]);
    setBankAccounts(acc.bankAccounts && acc.bankAccounts.length > 0 ? acc.bankAccounts : mockBankAccounts);
    setAvailableBalance(acc.availableBalance ?? 0);
    setWithdrawnTotal(acc.withdrawnTotal ?? 0);
    setLifetimeEarnings(acc.lifetimeEarnings ?? 0);
    setThisMonthEarnings(acc.thisMonthEarnings ?? 0);
    setPendingPayout(acc.pendingPayout ?? 0);
    setDocuments(acc.documents && acc.documents.length > 0 ? acc.documents : mockAllDocuments);
    setProfitShareTransactions(
      acc.profitShareTransactions && acc.profitShareTransactions.length > 0
        ? acc.profitShareTransactions
        : mockProfitShareTransactions
    );
    setCashTransactions(
      acc.cashTransactions && acc.cashTransactions.length > 0 ? acc.cashTransactions : mockCashTransactions
    );
    setWithdrawals(
      acc.withdrawals && acc.withdrawals.length > 0 ? acc.withdrawals : mockWithdrawals
    );
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    addToast({
      type: 'info',
      title: 'Notifikasi',
      message: 'Semua notifikasi telah ditandai dibaca.',
    });
  };

  // Helper to extract bank code
  const getBankCode = (bName: string): BankAccount['bankCode'] => {
    const upper = bName.toUpperCase();
    if (upper.includes('BCA')) return 'BCA';
    if (upper.includes('MANDIRI')) return 'MANDIRI';
    if (upper.includes('BNI')) return 'BNI';
    if (upper.includes('BRI')) return 'BRI';
    if (upper.includes('BSI') || upper.includes('SYARIAH')) return 'BSI';
    if (upper.includes('CIMB')) return 'CIMB';
    return 'BCA';
  };

  // ==================== AUTH & REGISTRATION LOGIC ====================

  const registerPartner = (data: RegisterPartnerData): PartnerProfile => {
    const newPartnerCode = data.partnerCode || `ZR-MTR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newId = `MITRA-${Date.now()}`;
    const initials = data.fullName
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const userBank: BankAccount = {
      id: `BA-${Date.now()}`,
      bankName: data.bankName,
      bankCode: getBankCode(data.bankName),
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolderName.toUpperCase(),
      isPrimary: true,
    };

    // User's starter assigned units from mock catalog
    const userVehicles: VehicleUnit[] = mockVehicles.slice(0, 4).map((v, i) => ({
      ...v,
      id: `USR-UNIT-${i + 1}`,
      productCode: `U-MTR-${String(i + 1).padStart(4, '0')}`,
      status: i === 0 ? 'available' : i === 1 ? 'rented' : 'inspection',
    }));

    const newRecord: PartnerAccountRecord = {
      id: newId,
      partnerCode: newPartnerCode,
      name: data.fullName,
      email: data.email,
      phone: data.whatsapp,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=FAAC57&color=ffffff&bold=true`,
      tier: 'Gold Partner',
      tierBadgeColor: 'from-amber-400 to-amber-600',
      profitShareRate: 70,
      joinDate: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      totalUnits: userVehicles.length,
      activeUnits: userVehicles.filter(u => u.status === 'rented' || u.status === 'available').length,
      assignedAccountManager: {
        name: 'Siti Nurhaliza, S.Psi.',
        role: 'Partner Relationship & Care Officer',
        phone: '+62 811-9876-5432',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        email: 'siti.care@zielrental.co.id',
      },
      kycStatus: 'Verified',
      address: `${data.address}, ${data.city}`,
      npwp: '00.000.000.0-000.000',
      idCardNumber: data.nik,
      password: data.password,
      bankAccounts: [userBank],
      availableBalance: 1750000,
      withdrawnTotal: 0,
      lifetimeEarnings: 1750000,
      thisMonthEarnings: 1750000,
      pendingPayout: 350000,
      vehicles: userVehicles,
      documents: mockAllDocuments.slice(0, 3),
      profitShareTransactions: mockProfitShareTransactions.slice(0, 3),
      cashTransactions: [
        {
          id: `CSH-INIT-${Date.now()}`,
          date: 'Hari ini',
          type: 'inflow',
          category: 'Bagi Hasil Sewa',
          description: `Bagi hasil sewa perdana kemitraan ${data.fullName}`,
          referenceId: `INV-INIT-${newPartnerCode}`,
          amount: 1750000,
          balanceAfter: 1750000,
          status: 'success',
        },
      ],
      withdrawals: [],
    };

    // Save into accounts array
    setAccounts(prev => {
      // replace if existing with same email, else prepend
      const filtered = prev.filter(
        a => a.email.toLowerCase() !== data.email.toLowerCase() && a.phone !== data.whatsapp
      );
      return [newRecord, ...filtered];
    });

    // Automatically set as active logged in account
    loadAccountData(newRecord);

    // Sync to PostgreSQL backend / Admin database asynchronously
    apiService.registerPartner({
      fullName: data.fullName,
      whatsapp: data.whatsapp,
      email: data.email,
      nik: data.nik,
      city: data.city,
      address: data.address,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolderName: data.accountHolderName,
      password: data.password,
      partnerCode: newPartnerCode,
    }).catch(err => console.warn('DB Sync Error:', err));

    return newRecord;
  };

  const loginWithCredentials = (identifier: string, pass: string): { success: boolean; message: string; partner?: PartnerProfile } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check in registered accounts
    const match = accounts.find(a => {
      const emailMatch = a.email.toLowerCase() === cleanId;
      const phoneMatch = a.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '');
      const codeMatch = a.partnerCode.toLowerCase() === cleanId;
      return emailMatch || phoneMatch || codeMatch;
    });

    if (!match) {
      return {
        success: false,
        message: 'Akun tidak ditemukan. Pastikan email atau nomor WhatsApp terdaftar dengan benar, atau daftar baru.',
      };
    }

    // Check password (allow default demo pass or matched password)
    if (match.password && match.password !== cleanPass && cleanPass !== '123456' && cleanPass !== '••••••••••••') {
      return {
        success: false,
        message: 'Kata sandi / PIN yang Anda masukkan tidak sesuai.',
      };
    }

    loadAccountData(match);
    return {
      success: true,
      message: `Selamat datang kembali, ${match.name}!`,
      partner: match,
    };
  };

  const loginDemo = (tier: 'Gold Partner' | 'Platinum Partner') => {
    if (tier === 'Platinum Partner') {
      const siti = accounts.find(a => a.id === defaultSitiAccount.id) || defaultSitiAccount;
      loadAccountData(siti);
    } else {
      const rizky = accounts.find(a => a.id === defaultRizkyAccount.id) || defaultRizkyAccount;
      loadAccountData(rizky);
    }
  };

  const loginWithOtp = (phone: string, _otp: string): { success: boolean; message: string; partner?: PartnerProfile } => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const match = accounts.find(a => a.phone.replace(/[^0-9]/g, '').includes(cleanPhone) || cleanPhone.includes(a.phone.replace(/[^0-9]/g, '')));

    if (match) {
      loadAccountData(match);
      return {
        success: true,
        message: `Verifikasi OTP berhasil. Selamat datang, ${match.name}!`,
        partner: match,
      };
    }

    // Default to first account if phone matches demo
    const defaultAcc = accounts[0] || defaultRizkyAccount;
    loadAccountData(defaultAcc);
    return {
      success: true,
      message: `Verifikasi OTP berhasil. Selamat datang, ${defaultAcc.name}!`,
      partner: defaultAcc,
    };
  };

  const logout = () => {
    setCurrentPage('login');
    addToast({
      type: 'info',
      title: 'Sesi Selesai',
      message: 'Anda telah berhasil keluar dari Panel Mitra ZielRental.',
    });
  };

  // ==================== TRANSACTIONS & WITHDRAWAL ====================

  const requestWithdrawal = async (amount: number, bankAccountId: string, notes?: string): Promise<boolean> => {
    if (amount <= 0) {
      addToast({
        type: 'error',
        title: 'Gagal Menarik Dana',
        message: 'Nominal penarikan harus lebih besar dari Rp 0.',
      });
      return false;
    }
    if (amount > availableBalance) {
      addToast({
        type: 'error',
        title: 'Saldo Tidak Mencukupi',
        message: `Saldo kas tersedia Anda saat ini adalah Rp ${availableBalance.toLocaleString('id-ID')}.`,
      });
      return false;
    }

    const selectedBank = bankAccounts.find(b => b.id === bankAccountId) || bankAccounts[0];
    const newTrxNumber = `WD-202505-${String(withdrawals.length + 43).padStart(4, '0')}`;
    const dateStr = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date()) + ' WIB';

    const newWithdrawal: WithdrawalTransaction = {
      id: `WD-${Date.now()}`,
      transactionNumber: newTrxNumber,
      requestDate: dateStr,
      completedDate: dateStr,
      amount: amount,
      adminFee: 0,
      netReceived: amount,
      bankAccount: selectedBank,
      status: 'completed',
      referenceNumber: `REF-${selectedBank.bankCode}-${Date.now().toString().slice(-8)}`,
      receiptNumber: `REC-ZR-${newTrxNumber}`,
      processedBy: 'Sistem Pembayaran Otomatis BI-FAST ZielRental',
      notes: notes || 'Pencairan Bagi Hasil Mitra ZielRental',
    };

    const newCashTrx: CashTransaction = {
      id: `CSH-${Date.now()}`,
      date: dateStr,
      type: 'outflow',
      category: 'Penarikan Kas',
      description: `Penarikan kas ke rekening ${selectedBank.bankName} ${selectedBank.accountNumber} a.n ${selectedBank.accountHolder} (${newTrxNumber})`,
      referenceId: newTrxNumber,
      amount: amount,
      balanceAfter: availableBalance - amount,
      status: 'success',
    };

    const newAvailable = availableBalance - amount;
    const newWithdrawn = withdrawnTotal + amount;

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    setCashTransactions(prev => [newCashTrx, ...prev]);
    setAvailableBalance(newAvailable);
    setWithdrawnTotal(newWithdrawn);

    // Persist to accounts
    setAccounts(prev =>
      prev.map(a => {
        if (a.id === activeAccountId) {
          return {
            ...a,
            availableBalance: newAvailable,
            withdrawnTotal: newWithdrawn,
            withdrawals: [newWithdrawal, ...(a.withdrawals || [])],
            cashTransactions: [newCashTrx, ...(a.cashTransactions || [])],
          };
        }
        return a;
      })
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Penarikan Dana Berhasil',
      message: `Pencairan dana sebesar Rp ${amount.toLocaleString('id-ID')} ke ${selectedBank.bankName} telah selesai diproses.`,
      timestamp: 'Baru saja',
      type: 'finance',
      isRead: false,
      targetPage: 'withdrawal-history',
      targetId: newWithdrawal.id,
    };
    setNotifications(prev => [newNotif, ...prev]);

    addToast({
      type: 'success',
      title: 'Penarikan Berhasil Diproses',
      message: `Dana Rp ${amount.toLocaleString('id-ID')} telah sukses ditransfer ke ${selectedBank.bankName}.`,
    });

    setSelectedReceiptWithdrawal(newWithdrawal);

    // Sync to PostgreSQL backend / Admin database asynchronously
    apiService.submitWithdrawal({
      partnerId: activeAccountId,
      amount,
      bankName: selectedBank.bankName,
      accountNumber: selectedBank.accountNumber,
      accountHolder: selectedBank.accountHolder,
      netReceived: amount,
    }).catch(err => console.warn('Withdrawal DB Sync Error:', err));

    return true;
  };

  const addDocument = (doc: Omit<UnitDocument, 'id'>) => {
    const newDoc: UnitDocument = {
      ...doc,
      id: `DOC-${Date.now()}`,
      verifiedBy: 'Sedang diverifikasi Tim Legal',
    };
    setDocuments(prev => [newDoc, ...prev]);
    addToast({
      type: 'success',
      title: 'Dokumen Berhasil Diunggah',
      message: `Berkas ${doc.type} untuk produk ${doc.productCode} sedang dalam verifikasi QC & Legalitas.`,
    });
  };

  const updateVehicleStatus = (unitId: string, status: VehicleUnit['status']) => {
    setVehicles(prev =>
      prev.map(v => (v.id === unitId ? { ...v, status } : v))
    );
    if (selectedUnit && selectedUnit.id === unitId) {
      setSelectedUnit(prev => prev ? { ...prev, status } : null);
    }
    addToast({
      type: 'info',
      title: 'Status Unit Diperbarui',
      message: `Status unit berhasil diubah menjadi ${status}.`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        partner,
        setPartner,
        vehicles,
        setVehicles,
        selectedUnit,
        setSelectedUnit,
        profitShareTransactions,
        selectedProfitShare,
        setSelectedProfitShare,
        cashTransactions,
        withdrawals,
        documents,
        bankAccounts,
        setBankAccounts,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        availableBalance,
        withdrawnTotal,
        lifetimeEarnings,
        thisMonthEarnings,
        pendingPayout,
        registerPartner,
        loginWithCredentials,
        loginDemo,
        loginWithOtp,
        logout,
        requestWithdrawal,
        addDocument,
        updateVehicleStatus,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        isDocUploadModalOpen,
        setIsDocUploadModalOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        selectedReceiptWithdrawal,
        setSelectedReceiptWithdrawal,
        selectedDocForPreview,
        setSelectedDocForPreview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
