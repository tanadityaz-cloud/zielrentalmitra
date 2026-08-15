import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PieChart,
  Search,
  Download,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ProfitShareTransaction } from '../../types';

export const ProfitShareView: React.FC = () => {
  const { profitShareTransactions, setSelectedProfitShare, partner, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTransactions = profitShareTransactions.filter(trx => {
    const matchSearch =
      trx.unitName.toLowerCase().includes(search.toLowerCase()) ||
      trx.productCode.toLowerCase().includes(search.toLowerCase()) ||
      trx.renterName.toLowerCase().includes(search.toLowerCase()) ||
      trx.transactionCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || trx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalGross = filteredTransactions.reduce((acc, t) => acc + t.grossAmount, 0);
  const totalPartnerNet = filteredTransactions.reduce((acc, t) => acc + t.partnerShareAmount, 0);
  const totalLaundry = filteredTransactions.reduce((acc, t) => acc + t.operationalMaintenanceAmount, 0);

  const handleExportCSV = () => {
    addToast({
      type: 'success',
      title: 'Laporan Bagi Hasil Diekspor',
      message: 'Rekapitulasi transaksi sewa perlengkapan bayi berhasil diunduh dalam format spreadsheet.',
    });
  };

  return (
    <div id="profit-share-view-container" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Transparansi Transaksi & Bagi Hasil Sewa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Perhitungan real-time hak bersih mitra {partner.profitShareRate}% dari setiap kontrak pemesanan perlengkapan bayi & mainan.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Faktur & Rekap Excel</span>
          </button>
        </div>
      </div>

      {/* Formula Transparency Card */}
      <div className="p-5 rounded-3xl bg-[#1e293b] text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A9D589] bg-[#A9D589]/20 px-2.5 py-0.5 rounded-full border border-[#82A859]/30">
              Formula Resmi Kemitraan ZielRental
            </span>
            <span className="text-xs text-slate-300">Tier: {partner.tier}</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">100% Transparan & Adil</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#A9D589]/20 border border-[#82A859]/30 rounded-2xl">
            <span className="text-[10px] text-[#A9D589] uppercase font-bold block">Hak Bersih Mitra</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">70%</div>
            <p className="text-[10px] text-slate-300 mt-1">Langsung masuk saldo kas cair mitra</p>
          </div>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Biaya Platform & CS</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">15%</div>
            <p className="text-[10px] text-slate-400 mt-1">Aplikasi, logistik hub, customer service</p>
          </div>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Sanitasi, Laundry & QC</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">10%</div>
            <p className="text-[10px] text-slate-400 mt-1">Sterilisasi UV-C, cuci hipoalergenik</p>
          </div>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Proteksi & Asuransi</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">5%</div>
            <p className="text-[10px] text-slate-400 mt-1">Dana garansi kerusakan / penggantian part</p>
          </div>
        </div>
      </div>

      {/* Summary KPI totals based on current filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Nilai Sewa Kotor (Gross)</span>
          <div className="text-xl font-black text-slate-900 font-mono mt-1">
            Rp {totalGross.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-slate-400">{filteredTransactions.length} Transaksi Terverifikasi</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-[#48661D] font-semibold uppercase">Total Hak Bersih Mitra (70%)</span>
          <div className="text-xl font-black text-[#48661D] font-mono mt-1">
            Rp {totalPartnerNet.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-[#48661D] font-semibold">Tercatat di Saldo Kas Siap Tarik</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Dana Laundry & Sterilisasi UV (10%)</span>
          <div className="text-xl font-black text-slate-700 font-mono mt-1">
            Rp {totalLaundry.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-slate-400">Dikelola Standar Medis ZielCare</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari transaksi, produk, ID aset..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#EC8944] focus:bg-white text-slate-800 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-[#EC8944]"
          >
            <option value="all">Semua Status Payout</option>
            <option value="settled">Settled (Masuk Saldo)</option>
            <option value="pending">Pending Verifikasi</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">No. Transaksi & Invoice</th>
                <th className="py-3.5 px-3">Produk Perlengkapan Bayi</th>
                <th className="py-3.5 px-3">Penyewa & Durasi</th>
                <th className="py-3.5 px-3 text-right">Sewa Kotor (100%)</th>
                <th className="py-3.5 px-3 text-right">Hak Bersih Mitra (70%)</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(trx => (
                <tr
                  key={trx.id}
                  onClick={() => setSelectedProfitShare(trx)}
                  className="hover:bg-[#FFF2C5]/30 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <p className="font-mono font-bold text-slate-900">{trx.transactionCode}</p>
                    <p className="text-[11px] text-slate-400">{trx.invoiceCode} • {trx.date}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-800">{trx.unitName}</p>
                    <p className="font-mono text-[11px] text-[#EC8944] font-semibold">{trx.productCode}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-medium text-slate-800">{trx.renterName}</p>
                    <p className="text-[11px] text-slate-500">{trx.rentalDurationDays} Hari</p>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                    Rp {trx.grossAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-mono font-bold text-[#48661D] bg-[#A9D589]/25 px-2 py-0.5 rounded-lg border border-[#82A859]/30">
                      Rp {trx.partnerShareAmount.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        trx.status === 'settled'
                          ? 'bg-[#A9D589]/30 text-[#48661D]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {trx.status === 'settled' ? 'Selesai Dicairkan' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProfitShare(trx);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-[#FFF2C5] hover:text-[#EC8944] text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer text-[11px]"
                    >
                      Buka Rincian
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
