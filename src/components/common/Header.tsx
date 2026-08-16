import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Search,
  ArrowDownToLine,
  ShieldCheck,
  FileCheck2,
  ChevronDown,
  PhoneCall,
  Sparkles,
  Boxes,
} from 'lucide-react';
import { PageView } from '../../types';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    currentPage,
    setCurrentPage,
    partner,
    availableBalance,
    unreadNotificationCount,
    setIsNotificationOpen,
    setIsWithdrawModalOpen,
    searchQuery,
    setSearchQuery,
    vehicles,
    setSelectedUnit,
    logout,
  } = useApp();

  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Filter baby products matching search query
  const filteredProducts = searchQuery.trim()
    ? vehicles.filter(
        v =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (page: PageView) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard Mitra';
      case 'assets':
        return 'Aset & Unit Sewa';
      case 'unit-detail':
        return 'Detail Unit Sewa';
      case 'performance':
        return 'Performa & Utilisasi';
      case 'profit-share':
      case 'profit-share-detail':
        return 'Bagi Hasil';
      case 'cashflow':
        return 'Kas Mitra';
      case 'withdrawal':
      case 'withdrawal-history':
        return 'Penarikan Dana';
      case 'documents':
        return 'Dokumen Unit';
      default:
        return 'Dashboard Mitra';
    }
  };

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Hamburger & Page Title / Breadcrumb */}
        <div className="flex items-center space-x-3">
          <button
            id="mobile-sidebar-toggle"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <span className="text-[#EC8944] font-bold">ZielRental</span>
              <span>/</span>
              <span className="text-[#48661D] font-semibold">Portal Mitra Bayi & Anak</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              {getPageTitle(currentPage)}
            </h1>
          </div>
        </div>

        {/* Middle: Universal Search Bar for Baby Gear, IDs, Categories */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              placeholder="Cari produk (mis. Stroller Babyelle, Box Pliko, U-ST-00098)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#EC8944] rounded-xl outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 focus:ring-2 focus:ring-[#FAAC57]/30"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchDropdownOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchDropdownOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 flex justify-between">
                <span>Hasil Pencarian Aset Perlengkapan Bayi</span>
                <span>{filteredProducts.length} produk</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(v => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedUnit(v);
                        setCurrentPage('unit-detail');
                        setIsSearchDropdownOpen(false);
                      }}
                      className="p-3 hover:bg-[#FFF2C5]/50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={v.thumbnail}
                          alt={v.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{v.name}</p>
                          <p className="text-[11px] font-mono text-slate-500">
                            {v.productCode} • {v.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            v.status === 'rented'
                              ? 'bg-[#A9D589]/30 text-[#48661D]'
                              : v.status === 'available'
                              ? 'bg-[#FFF2C5] text-[#EC8944]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {v.status === 'rented'
                            ? 'Sedang Disewa'
                            : v.status === 'available'
                            ? 'Tersedia'
                            : 'Maintenance/Laundry'}
                        </span>
                        <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                          Rp {v.dailyRate.toLocaleString('id-ID')}/hari
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Tidak ditemukan produk bayi yang cocok dengan kata kunci "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Available Balance, Quick Actions, Notification, Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Balance Button */}
          <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-[#A9D589]/20 border border-[#82A859]/30 rounded-xl">
            <span className="text-[10px] font-bold text-[#48661D] uppercase tracking-wider">
              Saldo Kas Tersedia
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#3B3B3B] font-mono tracking-tight">
              Rp {availableBalance.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Quick Withdraw CTA */}
          <button
            id="quick-withdraw-btn"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#EC8944] hover:bg-[#F4904B] active:bg-[#EC8944] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tarik Dana</span>
          </button>

          {/* Notification Bell Button */}
          <button
            id="notification-bell-btn"
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Buka notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D24B4B] text-[9px] font-bold text-white shadow-xs">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
            >
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-8 h-8 rounded-lg object-cover border border-[#FAAC57]"
              />
              <div className="hidden xl:block text-left pr-1">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                  {partner.name}
                </p>
                <p className="text-[10px] font-medium text-[#48661D]">{partner.tier}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Menu Popover */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 bg-[#1e293b] text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-11 h-11 rounded-xl object-cover border-2 border-[#FAAC57]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{partner.name}</h4>
                      <p className="text-xs text-slate-300">{partner.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold bg-[#FAAC57]/20 text-[#FAAC57] border border-[#FAAC57]/40 px-2 py-0.5 rounded">
                        {partner.tier} (Bagi Hasil {partner.profitShareRate}%)
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-700/60 flex justify-between text-[11px] text-slate-300">
                    <span>ID Mitra:</span>
                    <span className="font-mono text-[#A9D589] font-bold">{partner.partnerCode}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Status Kemitraan:</span>
                    <span className="text-[#A9D589] font-semibold">✓ Terverifikasi Legal</span>
                  </div>
                </div>

                <div className="p-2 divide-y divide-slate-100 text-xs">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCurrentPage('documents');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 flex items-center space-x-2 text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <FileCheck2 className="w-4 h-4 text-slate-500" />
                      <span>Sertifikat SNI & Dokumen Aset</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('withdrawal');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 flex items-center space-x-2 text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <ArrowDownToLine className="w-4 h-4 text-slate-500" />
                      <span>Rekening Bank & Pencairan</span>
                    </button>
                  </div>

                  <div className="p-3 bg-[#FFF2C5]/40 rounded-xl m-1 border border-[#FAAC57]/30">
                    <div className="text-[11px] font-semibold text-slate-700 mb-1">
                      PIC Care Mitra Anda:
                    </div>
                    <p className="text-xs font-bold text-slate-900">{partner.assignedAccountManager.name}</p>
                    <p className="text-[11px] text-slate-500 mb-2">{partner.assignedAccountManager.phone}</p>
                    <a
                      href={`tel:${partner.assignedAccountManager.phone}`}
                      className="w-full py-1.5 px-2 bg-[#82A859] hover:bg-[#48661D] text-white rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Hubungi PIC Care</span>
                    </a>
                  </div>

                  <div className="pt-1 mt-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 flex items-center space-x-2 text-[#D24B4B] hover:bg-[#D24B4B]/10 rounded-lg text-left font-medium transition-colors cursor-pointer"
                    >
                      <span>Keluar dari Panel Mitra</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
