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

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  partner: PartnerProfile;
  vehicles: VehicleUnit[];
  selectedUnit: VehicleUnit | null;
  setSelectedUnit: (unit: VehicleUnit | null) => void;
  profitShareTransactions: ProfitShareTransaction[];
  selectedProfitShare: ProfitShareTransaction | null;
  setSelectedProfitShare: (trx: ProfitShareTransaction | null) => void;
  cashTransactions: CashTransaction[];
  withdrawals: WithdrawalTransaction[];
  documents: UnitDocument[];
  bankAccounts: BankAccount[];
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
  const [partner] = useState<PartnerProfile>(mockPartner);
  const [vehicles, setVehicles] = useState<VehicleUnit[]>(mockVehicles);
  const [selectedUnit, setSelectedUnit] = useState<VehicleUnit | null>(mockVehicles[0]);
  const [profitShareTransactions, setProfitShareTransactions] = useState<ProfitShareTransaction[]>(mockProfitShareTransactions);
  const [selectedProfitShare, setSelectedProfitShare] = useState<ProfitShareTransaction | null>(null);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>(mockCashTransactions);
  const [withdrawals, setWithdrawals] = useState<WithdrawalTransaction[]>(mockWithdrawals);
  const [documents, setDocuments] = useState<UnitDocument[]>(mockAllDocuments);
  const [bankAccounts] = useState<BankAccount[]>(mockBankAccounts);
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
  const [availableBalance, setAvailableBalance] = useState(7985000);
  const [withdrawnTotal, setWithdrawnTotal] = useState(17000000);
  const [lifetimeEarnings, setLifetimeEarnings] = useState(24985000);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(12850000);
  const [pendingPayout] = useState(2450000);

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

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    setCashTransactions(prev => [newCashTrx, ...prev]);
    setAvailableBalance(prev => prev - amount);
    setWithdrawnTotal(prev => prev + amount);

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
        vehicles,
        selectedUnit,
        setSelectedUnit,
        profitShareTransactions,
        selectedProfitShare,
        setSelectedProfitShare,
        cashTransactions,
        withdrawals,
        documents,
        bankAccounts,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        availableBalance,
        withdrawnTotal,
        lifetimeEarnings,
        thisMonthEarnings,
        pendingPayout,
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
