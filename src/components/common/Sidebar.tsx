import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Boxes,
  TrendingUp,
  PieChart,
  Wallet,
  ArrowDownToLine,
  FileCheck2,
  ShieldCheck,
  Headphones,
  LogOut,
} from 'lucide-react';
import { PageView } from '../../types';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentPage, setCurrentPage, partner, vehicles, documents, availableBalance, logout } = useApp();

  const expiringDocsCount = documents.filter(
    d => d.status === 'expiring_soon' || d.status === 'expired'
  ).length;

  const rentedUnitsCount = vehicles.filter(v => v.status === 'rented').length;

  const navItems: {
    id: PageView;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Ringkasan Utama',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'assets',
      label: 'Aset & Unit Sewa',
      icon: <Boxes className="w-5 h-5" />,
      badge: `${rentedUnitsCount}/${vehicles.length} Disewa`,
      badgeColor: 'bg-[#A9D589]/20 text-[#A9D589] border border-[#82A859]/30',
    },
    {
      id: 'performance',
      label: 'Performa & Utilisasi',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'profit-share',
      label: 'Bagi Hasil',
      icon: <PieChart className="w-5 h-5" />,
    },
    {
      id: 'cashflow',
      label: 'Kas Mitra',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      id: 'withdrawal',
      label: 'Penarikan Dana',
      icon: <ArrowDownToLine className="w-5 h-5" />,
      badge: 'Instan',
      badgeColor: 'bg-[#FAAC57]/20 text-[#FAAC57] border border-[#FAAC57]/30',
    },
    {
      id: 'documents',
      label: 'Dokumen Unit',
      icon: <FileCheck2 className="w-5 h-5" />,
      badge: expiringDocsCount > 0 ? `${expiringDocsCount} Perlu Cek` : undefined,
      badgeColor: 'bg-[#D24B4B]/20 text-[#D24B4B] border border-[#D24B4B]/30',
    },
  ];

  const handleNavClick = (page: PageView) => {
    setCurrentPage(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#1e293b] text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800 shadow-xl`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FAAC57] via-[#F4904B] to-[#EC8944] flex items-center justify-center shadow-lg shadow-[#EC8944]/20 text-white font-black text-xl tracking-tight">
              ZR
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-white tracking-tight">ZielRental</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#A9D589]/20 text-[#A9D589] border border-[#82A859]/30">
                  Mitra
                </span>
              </div>
              <p className="text-xs text-slate-400">Baby Gear & Toy Rental</p>
            </div>
          </div>
        </div>

        {/* Balance Card Snapshot in Sidebar */}
        <div className="px-4 pt-4 pb-2">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400">Saldo Kas Mitra</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A9D589] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#82A859]"></span>
              </span>
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              Rp {availableBalance.toLocaleString('id-ID')}
            </div>
            <button
              onClick={() => handleNavClick('withdrawal')}
              className="mt-3 w-full py-2 px-3 bg-[#EC8944] hover:bg-[#F4904B] active:bg-[#EC8944] text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Tarik Saldo Instan</span>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu Mitra
          </div>
          {navItems.map(item => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'assets' && currentPage === 'unit-detail') ||
              (item.id === 'profit-share' && currentPage === 'profit-share-detail') ||
              (item.id === 'withdrawal' && currentPage === 'withdrawal-history');

            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#82A859] text-white shadow-md shadow-[#48661D]/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                    {item.icon}
                  </span>
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dedicated Support PIC */}
        <div className="p-3 border-t border-slate-800/90 bg-slate-900/60">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1 text-[11px] font-medium text-[#A9D589]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>PIC Care Mitra</span>
              </div>
              <span className="text-[10px] text-slate-400">Hub Perlengkapan Bayi</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <img
                src={partner.assignedAccountManager.avatar}
                alt={partner.assignedAccountManager.name}
                className="w-8 h-8 rounded-full object-cover border border-[#82A859]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {partner.assignedAccountManager.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {partner.assignedAccountManager.phone}
                </p>
              </div>
              <a
                href={`https://wa.me/${partner.assignedAccountManager.phone.replace(/[^0-9]/g, '')}?text=Halo%20ZielRental%2C%20saya%20Mitra%20${encodeURIComponent(partner.name)}%20(${partner.partnerCode})`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-[#A9D589]/20 hover:bg-[#A9D589]/30 text-[#A9D589] rounded-lg transition-colors"
                title="Chat WhatsApp PIC"
              >
                <Headphones className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Profile snippet */}
          <div className="mt-2.5 pt-2 flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 min-w-0">
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-7 h-7 rounded-full object-cover border border-[#FAAC57] shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[100px]">
                  {partner.name}
                </p>
                <p className="text-[10px] text-[#FAAC57] font-medium">{partner.tier}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsMobileOpen(false);
                logout();
              }}
              title="Keluar dari Akun Mitra"
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#D24B4B] hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
