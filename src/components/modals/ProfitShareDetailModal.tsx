import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  PieChart,
  CheckCircle2,
  Printer,
  Receipt,
  Boxes,
} from 'lucide-react';

export const ProfitShareDetailModal: React.FC = () => {
  const { selectedProfitShare, setSelectedProfitShare, partner, addToast } = useApp();

  if (!selectedProfitShare) return null;

  const trx = selectedProfitShare;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#3B3B3B] to-[#1E293B] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#A9D589]/20 text-[#A9D589] border border-[#82A859]/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Rincian Bagi Hasil Sewa</h3>
                <span className="text-[10px] font-mono bg-slate-700 px-2 py-0.5 rounded text-[#A9D589]">
                  {trx.transactionCode}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">Invoice: {trx.invoiceCode} • {trx.date}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedProfitShare(null)}
            className="text-white/70 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Top Banner: Unit & Renter Info */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Produk Perlengkapan Bayi</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{trx.unitName}</p>
              <p className="font-mono text-[#EC8944] font-semibold">{trx.productCode}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Penyewa & Durasi</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{trx.renterName}</p>
              <p className="text-slate-600">{trx.rentalDurationDays} Hari Masa Sewa</p>
            </div>
          </div>

          {/* Breakdown Calculation Formula (70 / 15 / 10 / 5) */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <PieChart className="w-4 h-4 text-[#82A859]" />
              <span>Transparansi Komposisi Bagi Hasil</span>
            </h4>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {/* Gross Rental Fee */}
              <div className="p-3.5 bg-slate-100/70 flex justify-between items-center font-bold text-slate-900 text-sm">
                <span>Pendapatan Kotor Sewa (Gross)</span>
                <span className="font-mono">Rp {trx.grossAmount.toLocaleString('id-ID')}</span>
              </div>

              {/* Partner Share (70%) */}
              <div className="p-3.5 bg-[#A9D589]/20 flex justify-between items-center text-[#48661D]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm">Hak Bersih Mitra ({trx.partnerSharePercent}%)</span>
                    <span className="text-[10px] bg-[#82A859] text-white font-bold px-1.5 py-0.2 rounded">
                      Masuk Saldo Kas Mitra
                    </span>
                  </div>
                  <p className="text-[11px] text-[#48661D]">
                    Berdasarkan status kemitraan {partner.tier} ({partner.profitShareRate}%)
                  </p>
                </div>
                <span className="font-mono font-black text-base text-[#48661D]">
                  Rp {trx.partnerShareAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Platform Fee (15%) */}
              <div className="p-3 flex justify-between items-center text-slate-700">
                <div>
                  <span className="font-semibold text-slate-900">
                    Biaya Platform ZielRental ({trx.platformFeePercent}%)
                  </span>
                  <p className="text-[10px] text-slate-500">Aplikasi penyewa, logistik hub pengantaran & CS 24/7</p>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  Rp {trx.platformFeeAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Sanitasi & Laundry UV (10%) */}
              <div className="p-3 flex justify-between items-center text-slate-700">
                <div>
                  <span className="font-semibold text-slate-900">
                    Sanitasi, Laundry & QC ({trx.operationalMaintenancePercent}%)
                  </span>
                  <p className="text-[10px] text-slate-500">Pencucian sabun food-grade & sterilisasi sinar UV-C setelah pengembalian</p>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  Rp {trx.operationalMaintenanceAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Insurance & Protection (5%) */}
              <div className="p-3 flex justify-between items-center text-slate-700">
                <div>
                  <span className="font-semibold text-slate-900">
                    Proteksi & Garansi Part ({trx.insuranceProtectionPercent}%)
                  </span>
                  <p className="text-[10px] text-slate-500">Iuran dana proteksi kerusakan komponen & aksesoris</p>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  Rp {trx.insuranceProtectionAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Process */}
          {trx.timeline && trx.timeline.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Linimasa Verifikasi & Pencairan
              </h4>
              <div className="space-y-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                {trx.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#82A859] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0 flex justify-between">
                      <p className="text-slate-800 font-medium">{step.step}</p>
                      <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={() => {
              addToast({
                type: 'success',
                title: 'Faktur Bagi Hasil Diunduh',
                message: `Invoice ${trx.invoiceCode} berhasil diekspor ke PDF.`,
              });
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Ekspor Faktur</span>
          </button>
          <button
            onClick={() => setSelectedProfitShare(null)}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
