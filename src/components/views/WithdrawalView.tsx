import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  Zap,
  Receipt,
} from 'lucide-react';

export const WithdrawalView: React.FC = () => {
  const {
    availableBalance,
    withdrawnTotal,
    withdrawals,
    bankAccounts,
    setIsWithdrawModalOpen,
    setSelectedReceiptWithdrawal,
  } = useApp();

  return (
    <div id="withdrawal-view-container" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Pusat Penarikan Kas & Rekening Bank
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Cairkan saldo kas bagi hasil sewa perlengkapan bayi Anda secara instan ke rekening perbankan nasional tanpa potongan biaya admin.
          </p>
        </div>
      </div>

      {/* Main Withdrawal Action Card & Balance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Balance & Fast Action (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#3B3B3B] via-[#2A2A2A] to-[#1E293B] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A9D589]">
                Saldo Kas Siap Dicairkan
              </span>
              <div className="flex items-center space-x-1 text-xs text-[#A9D589] bg-[#A9D589]/20 px-2.5 py-1 rounded-full border border-[#82A859]/40">
                <Zap className="w-3.5 h-3.5" />
                <span>BI-FAST 0 Menit</span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-2">
              Rp {availableBalance.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-md">
              Semua pencairan dana ditransfer 100% utuh tanpa potongan biaya administrasi perbankan.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Akumulasi Dicairkan</span>
              <span className="font-mono text-sm font-bold text-slate-200">
                Rp {withdrawnTotal.toLocaleString('id-ID')}
              </span>
            </div>
            <button
              id="initiate-withdrawal-cta-btn"
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-6 py-3 bg-[#EC8944] hover:bg-[#F4904B] active:bg-[#EC8944] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#EC8944]/30 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Cairkan Saldo Sekarang</span>
            </button>
          </div>
        </div>

        {/* Registered Bank Accounts (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Rekening Bank Terdaftar
              </h3>
              <span className="text-[11px] text-[#48661D] font-bold">KYC Terverifikasi</span>
            </div>

            <div className="space-y-2.5">
              {bankAccounts.map(bank => (
                <div
                  key={bank.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    bank.isPrimary
                      ? 'border-[#FAAC57] bg-[#FFF2C5]/30'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-slate-700" />
                      <span className="font-bold text-xs text-slate-900">{bank.bankName}</span>
                      {bank.isPrimary && (
                        <span className="text-[10px] bg-[#EC8944] text-white px-2 py-0.2 rounded-full font-bold">
                          Rekening Utama
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    <p className="font-mono font-bold text-slate-800 text-sm">{bank.accountNumber}</p>
                    <p className="text-slate-500 font-medium mt-0.5">a.n {bank.accountHolder}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500">
            Untuk merubah atau menambahkan nomor rekening baru, silakan hubungi Customer Relations Partner ZielRental.
          </div>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Riwayat Pencairan Dana
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Semua riwayat transfer dana bagi hasil ke rekening Anda</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">No. Transaksi</th>
                <th className="py-3.5 px-3">Tanggal Pencairan</th>
                <th className="py-3.5 px-3">Rekening Penerima</th>
                <th className="py-3.5 px-3 text-right">Nominal Bersih</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Kuitansi Resmi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {withdrawals.map(wd => (
                <tr key={wd.id} className="hover:bg-[#FFF2C5]/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-mono font-bold text-slate-900">{wd.transactionNumber}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Ref: {wd.referenceNumber}</span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {wd.completedDate || wd.requestDate}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-800">{wd.bankAccount.bankName}</p>
                    <p className="text-[11px] font-mono text-slate-500">
                      {wd.bankAccount.accountNumber} • {wd.bankAccount.accountHolder}
                    </p>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                    Rp {wd.netReceived.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#A9D589]/30 text-[#48661D]">
                      <CheckCircle2 className="w-3 h-3 text-[#82A859]" />
                      <span>Berhasil Terkirim</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedReceiptWithdrawal(wd)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-[#FFF2C5] hover:text-[#EC8944] text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] flex items-center space-x-1 mx-auto"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Lihat Bukti</span>
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
