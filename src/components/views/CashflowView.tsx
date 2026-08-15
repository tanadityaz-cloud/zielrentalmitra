import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Download,
  ArrowDownToLine,
} from 'lucide-react';
import { CashTransaction } from '../../types';

export const CashflowView: React.FC = () => {
  const { cashTransactions, availableBalance, withdrawnTotal, lifetimeEarnings, setIsWithdrawModalOpen, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'inflow' | 'outflow'>('all');

  const filteredTransactions = cashTransactions.filter(trx => {
    const matchSearch =
      trx.description.toLowerCase().includes(search.toLowerCase()) ||
      trx.category.toLowerCase().includes(search.toLowerCase()) ||
      (trx.referenceId && trx.referenceId.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || trx.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalInflow = cashTransactions
    .filter(t => t.type === 'inflow')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalOutflow = cashTransactions
    .filter(t => t.type === 'outflow')
    .reduce((acc, t) => acc + t.amount, 0);

  const handleExportStatement = () => {
    addToast({
      type: 'success',
      title: 'Rekening Koran Berhasil Diekspor',
      message: 'Buku mutasi kas sewa perlengkapan bayi telah diunduh dalam format PDF resmi.',
    });
  };

  return (
    <div id="cashflow-view-container" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Arus Kas & Buku Mutasi Saldo Mitra
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Catatan pembukuan uang masuk (Bagi Hasil Sewa Baby Gear) dan uang keluar (Pencairan Kas ke Rekening).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportStatement}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Rekening Koran (PDF)</span>
          </button>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-4 py-2 bg-[#EC8944] hover:bg-[#F4904B] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Tarik Saldo</span>
          </button>
        </div>
      </div>

      {/* Account Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-[#3B3B3B] to-[#1E293B] text-white rounded-3xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider block">
            Saldo Kas Saat Ini (Tersedia)
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight mt-2 text-[#A9D589]">
            Rp {availableBalance.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-300 mt-2">Dapat dicairkan kapan saja tanpa batasan minimum hari.</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Mutasi Masuk (Inflow)</span>
            <div className="w-8 h-8 rounded-lg bg-[#A9D589]/20 text-[#48661D] flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">
            Rp {totalInflow.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Akumulasi penerimaan sewa bersih unit mitra</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Mutasi Keluar (Penarikan)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">
            Rp {totalOutflow.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Sudah sukses ditransfer ke rekening bank</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari transaksi, nomor referensi, atau keterangan..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#EC8944] focus:bg-white text-slate-800 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              typeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Mutasi
          </button>
          <button
            onClick={() => setTypeFilter('inflow')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              typeFilter === 'inflow' ? 'bg-[#82A859] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Masuk (Inflow)
          </button>
          <button
            onClick={() => setTypeFilter('outflow')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              typeFilter === 'outflow' ? 'bg-[#EC8944] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Keluar (Penarikan)
          </button>
        </div>
      </div>

      {/* Cashflow Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Tanggal & Waktu</th>
                <th className="py-3.5 px-3">Kategori</th>
                <th className="py-3.5 px-4">Keterangan & Referensi</th>
                <th className="py-3.5 px-3 text-right">Nominal Mutasi</th>
                <th className="py-3.5 px-4 text-right">Saldo Kas Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(trx => (
                <tr key={trx.id} className="hover:bg-[#FFF2C5]/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {trx.date}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                        trx.type === 'inflow'
                          ? 'bg-[#A9D589]/25 text-[#48661D]'
                          : 'bg-[#FFF2C5] text-[#EC8944] border border-[#FAAC57]/40'
                      }`}
                    >
                      {trx.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{trx.description}</p>
                    {trx.referenceId && (
                      <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                        Ref: {trx.referenceId}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold whitespace-nowrap">
                    <span
                      className={trx.type === 'inflow' ? 'text-[#48661D]' : 'text-[#EC8944]'}
                    >
                      {trx.type === 'inflow' ? '+ ' : '- '}
                      Rp {trx.amount.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    Rp {trx.balanceAfter.toLocaleString('id-ID')}
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
