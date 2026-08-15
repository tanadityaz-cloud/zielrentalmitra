import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  ShoppingBag,
  PieChart as PieChartIcon,
  TrendingUp,
  Wallet,
  FileCheck2,
  ArrowDownToLine,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    partner,
    setCurrentPage,
    setIsWithdrawModalOpen,
  } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('Mei 2024');

  // Exact data specified for Dashboard Mitra
  // 1. Dashboard Aset
  const totalAssets = 24;
  const activeAssets = 20;
  const inactiveAssets = 4;
  const utilizationRate = 78;

  // 2. Total Pembelian (Historical acquisition value of existing rental inventory)
  const totalPurchaseValue = 19000000; // Rp 19.000.000
  const totalUnitsPurchased = 24;
  const latestPurchaseValue = 2500000;
  const latestPurchaseDate = '18 Mei 2024';

  // 3. Status Unit
  const unitStatusData = [
    { name: 'Sedang Disewa', count: 16, color: '#82A859' },
    { name: 'Tersedia', count: 4, color: '#FAAC57' },
    { name: 'Laundry', count: 2, color: '#A9D589' },
    { name: 'Maintenance', count: 2, color: '#EC8944' },
  ];

  // 4. Bagi Hasil
  const totalBagiHasil = 7985000;
  const bagiHasilTersedia = 3450000;
  const bagiHasilDiproses = 1250000;
  const bagiHasilDicairkan = 3285000;

  // 5. Kas Mitra + Penarikan
  const saldoKasTotal = 5235000;
  const saldoTersedia = 5235000;
  const saldoMengendap = 2150000;
  const totalPenarikan = 4780000;
  const latestWithdrawalAmount = 2000000;
  const latestWithdrawalDate = '18 Mei 2024';
  const latestWithdrawalStatus = 'Berhasil Ditransfer';

  // 6. Dokumen Unit
  const totalDokumen = 48;
  const dokumenValid = 42;
  const segeraExpired = 4;
  const expired = 2;

  return (
    <div id="dashboard-mitra-container" className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* ==================================================
          PAGE HEADER
          ================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#A9D589]/25 text-[#48661D] border border-[#82A859]/30 uppercase tracking-wider">
              {partner.tier || 'Gold Partner'}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {partner.partnerCode || 'ZR-MTR-88219'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Selamat datang, {partner.name || 'Rizky Pratama'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ringkasan aset, pembelian, status unit, bagi hasil, kas, dan dokumen Anda.
          </p>
        </div>

        {/* Date / Period Selector */}
        <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start md:self-center shrink-0">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden pr-3 py-1 cursor-pointer"
          >
            <option value="Mei 2024">Periode: Mei 2024</option>
            <option value="April 2024">Periode: April 2024</option>
            <option value="Maret 2024">Periode: Maret 2024</option>
            <option value="Tahun 2024">Tahun 2024</option>
          </select>
        </div>
      </div>

      {/* ==================================================
          ROW 1: DASHBOARD ASET & TOTAL PEMBELIAN
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. DASHBOARD ASET */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF2C5] text-[#EC8944] flex items-center justify-center border border-[#FAAC57]/30 shrink-0">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Dashboard Aset</h2>
                  <p className="text-xs text-slate-500">Ringkasan unit aset sewa yang Anda miliki</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Aset</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1">
                  {totalAssets} <span className="text-xs font-normal text-slate-500">Unit</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#A9D589]/15 border border-[#82A859]/30">
                <span className="text-[11px] font-semibold text-[#48661D] uppercase tracking-wider block">Aset Aktif</span>
                <div className="text-xl sm:text-2xl font-bold text-[#48661D] font-mono mt-1">
                  {activeAssets} <span className="text-xs font-normal text-[#48661D]/70">Unit</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Tidak Aktif</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-700 font-mono mt-1">
                  {inactiveAssets} <span className="text-xs font-normal text-slate-500">Unit</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF2C5]/60 border border-[#FAAC57]/40">
                <span className="text-[11px] font-semibold text-[#EC8944] uppercase tracking-wider block">Utilisasi</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1">
                  {utilizationRate}%
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Contoh Aset: </span>
              Stroller Babyelle S2, Car Seat Joie, Box Bayi Pliko, Bouncer Mastela, Walker Family.
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentPage('assets')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Lihat Aset</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. TOTAL PEMBELIAN */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#A9D589]/20 text-[#48661D] flex items-center justify-center border border-[#82A859]/30 shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Total Pembelian</h2>
                  <p className="text-xs text-slate-500">Total nilai perolehan aset sewa yang telah dimiliki</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Nilai Pembelian Aset
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono mt-1">
                  Rp {totalPurchaseValue.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {totalUnitsPurchased} Unit • Total nilai pembelian aset yang telah dimiliki.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Pembelian Terakhir</span>
                  <span className="text-xs text-slate-700 font-medium">Tanggal {latestPurchaseDate}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  Rp {latestPurchaseValue.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentPage('assets')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <span>Lihat Riwayat Pembelian</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          ROW 2: STATUS UNIT & BAGI HASIL
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. STATUS UNIT */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF2C5] text-[#EC8944] flex items-center justify-center border border-[#FAAC57]/30 shrink-0">
                  <PieChartIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Status Unit</h2>
                  <p className="text-xs text-slate-500">Distribusi operasional 24 unit sewa saat ini</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-5">
              <div className="sm:col-span-5 h-36 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={unitStatusData}
                      innerRadius={36}
                      outerRadius={54}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {unitStatusData.map((entry, index) => (
                        <Cell key={`status-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any) => [`${val} Unit`, name]}
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px',
                        border: 'none',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="sm:col-span-7 space-y-2 text-xs">
                {unitStatusData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">
                      {item.count} <span className="text-[11px] font-normal text-slate-500">Unit</span>
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-1.5 pt-1 text-[11px] text-slate-400 font-semibold">
                  <span>Total Unit Terdaftar</span>
                  <span className="font-mono text-slate-700 font-bold">{totalAssets} Unit</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentPage('assets')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <span>Lihat Semua Unit</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. BAGI HASIL */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#A9D589]/20 text-[#48661D] flex items-center justify-center border border-[#82A859]/30 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Bagi Hasil</h2>
                  <p className="text-xs text-slate-500">Akumulasi pendapatan sewa bersih mitra</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Bagi Hasil
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono mt-1">
                  Rp {totalBagiHasil.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#A9D589]/15 border border-[#82A859]/30">
                  <span className="text-[10px] font-bold text-[#48661D] uppercase tracking-wider block">Tersedia</span>
                  <span className="text-xs sm:text-sm font-bold text-[#48661D] font-mono mt-1 block">
                    Rp {bagiHasilTersedia.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FFF2C5]/60 border border-[#FAAC57]/40">
                  <span className="text-[10px] font-bold text-[#EC8944] uppercase tracking-wider block">Diproses</span>
                  <span className="text-xs sm:text-sm font-bold text-[#EC8944] font-mono mt-1 block">
                    Rp {bagiHasilDiproses.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Dicairkan</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 font-mono mt-1 block">
                    Rp {bagiHasilDicairkan.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage('profit-share')}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Lihat Bagi Hasil</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage('profit-share')}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Detail Transaksi
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          ROW 3: KAS MITRA + PENARIKAN & DOKUMEN UNIT
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. KAS MITRA + PENARIKAN */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF2C5] text-[#EC8944] flex items-center justify-center border border-[#FAAC57]/30 shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Kas Mitra</h2>
                  <p className="text-xs text-slate-500">Saldo kas dan ringkasan penarikan dana</p>
                </div>
              </div>
            </div>

            {/* Balances Grid */}
            <div className="grid grid-cols-3 gap-2.5 mt-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Saldo Kas</span>
                <div className="text-sm sm:text-base font-bold text-slate-900 font-mono mt-0.5">
                  Rp {saldoKasTotal.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#A9D589]/15 border border-[#82A859]/30">
                <span className="text-[10px] font-semibold text-[#48661D] uppercase tracking-wider block">Tersedia</span>
                <div className="text-sm sm:text-base font-bold text-[#48661D] font-mono mt-0.5">
                  Rp {saldoTersedia.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Mengendap</span>
                <div className="text-sm sm:text-base font-bold text-slate-700 font-mono mt-0.5">
                  Rp {saldoMengendap.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Total Penarikan & Penarikan Terakhir */}
            <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Total Penarikan:</span>
                <span className="font-mono font-bold text-slate-800">Rp {totalPenarikan.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Penarikan Terakhir ({latestWithdrawalDate})
                  </span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    Rp {latestWithdrawalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#48661D] bg-[#A9D589]/25 border border-[#82A859]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#82A859]" />
                  <span>{latestWithdrawalStatus}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex-1 py-2.5 px-3 bg-[#EC8944] hover:bg-[#F4904B] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Tarik Dana</span>
            </button>
            <button
              onClick={() => setCurrentPage('cashflow')}
              className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Lihat Kas
            </button>
            <button
              onClick={() => setCurrentPage('withdrawal')}
              className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Riwayat Penarikan
            </button>
          </div>
        </div>

        {/* 6. DOKUMEN UNIT */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Dokumen Unit</h2>
                  <p className="text-xs text-slate-500">Status sertifikasi SNI & kelengkapan dokumen</p>
                </div>
              </div>
            </div>

            {/* Document Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total</span>
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono mt-0.5">
                  {totalDokumen}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#A9D589]/15 border border-[#82A859]/30">
                <span className="text-[10px] font-semibold text-[#48661D] uppercase tracking-wider block">Valid</span>
                <div className="text-lg sm:text-xl font-bold text-[#48661D] font-mono mt-0.5">
                  {dokumenValid}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF2C5]/60 border border-[#FAAC57]/40">
                <span className="text-[10px] font-semibold text-[#EC8944] uppercase tracking-wider block">Segera Expired</span>
                <div className="text-lg sm:text-xl font-bold text-[#EC8944] font-mono mt-0.5">
                  {segeraExpired}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#D24B4B]/10 border border-[#D24B4B]/30">
                <span className="text-[10px] font-semibold text-[#D24B4B] uppercase tracking-wider block">Expired</span>
                <div className="text-lg sm:text-xl font-bold text-[#D24B4B] font-mono mt-0.5">
                  {expired}
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#FFF2C5]/60 border border-[#FAAC57]/60 flex items-center space-x-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-[#EC8944] shrink-0" />
              <p className="text-slate-800 font-medium">
                <span className="font-bold text-[#EC8944]">⚠ {expired} dokumen perlu diperbarui.</span>
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentPage('documents')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Kelola Dokumen</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          FOOTER
          ================================================== */}
      <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
        ZielRental © 2024 - Portal Mitra
      </div>
    </div>
  );
};
