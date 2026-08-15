import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Baby,
} from 'lucide-react';

export const WithdrawalReceiptModal: React.FC = () => {
  const { selectedReceiptWithdrawal, setSelectedReceiptWithdrawal, partner, addToast } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!selectedReceiptWithdrawal) return null;

  const wd = selectedReceiptWithdrawal;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast({
      type: 'success',
      title: 'Kuitansi Berhasil Diunduh',
      message: `Bukti transfer ${wd.transactionNumber} berhasil disimpan sebagai dokumen digital.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header toolbar */}
        <div className="p-4 bg-gradient-to-r from-[#3B3B3B] to-[#1E293B] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A9D589] bg-[#A9D589]/20 px-2 py-0.5 rounded border border-[#82A859]/30">
              Bukti Transfer Resmi
            </span>
            <span className="text-xs text-slate-300 font-mono">{wd.transactionNumber}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center space-x-1 transition-colors cursor-pointer"
              title="Cetak Bukti"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center space-x-1 transition-colors cursor-pointer"
              title="Unduh PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedReceiptWithdrawal(null)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div ref={receiptRef} className="p-6 sm:p-8 overflow-y-auto bg-white space-y-6">
          {/* Company Brand & Watermark Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#EC8944] flex items-center justify-center text-white font-black text-sm">
                  ZR
                </div>
                <span className="text-lg font-black tracking-tight text-slate-950">ZielRental</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">PT Ziel Rental Perlengkapan Anak Indonesia</p>
              <p className="text-[10px] text-slate-400">Divisi Keuangan & Bagi Hasil Mitra</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Status Transfer
              </span>
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#48661D] bg-[#A9D589]/30 border border-[#82A859]/30 px-2 py-0.5 rounded-full mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-[#82A859]" />
                <span>BERHASIL DIKIRIM</span>
              </span>
            </div>
          </div>

          {/* Amount Display */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Jumlah Dana Dicairkan (Net)
            </p>
            <div className="text-3xl font-black text-slate-950 font-mono tracking-tight mt-1">
              Rp {wd.amount.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-[#48661D] font-semibold mt-1">
              Biaya Transfer: Rp 0 (100% Ditanggung Platform)
            </p>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nomor Referensi Bank</span>
              <span className="font-mono font-bold text-slate-800">{wd.referenceNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Waktu Eksekusi</span>
              <span className="font-medium text-slate-800">{wd.completedDate || wd.requestDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nama Penerima (Mitra)</span>
              <span className="font-bold text-slate-800">{wd.bankAccount.accountHolder}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">ID Kemitraan</span>
              <span className="font-mono text-slate-700">{partner.partnerCode}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bank Tujuan</span>
              <span className="font-bold text-slate-800">{wd.bankAccount.bankName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nomor Rekening</span>
              <span className="font-mono font-bold text-slate-800">{wd.bankAccount.accountNumber}</span>
            </div>
          </div>

          {/* Notes */}
          {wd.notes && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium block mb-0.5">Keterangan:</span>
              <p className="text-slate-800 font-medium">{wd.notes}</p>
            </div>
          )}

          {/* Digital Stamp & Verification Signature */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-5 h-5 text-[#82A859]" />
              <div>
                <p className="font-semibold text-slate-800">Verifikasi Sistem Otomatis ZielRental</p>
                <p className="text-[10px] text-slate-400">Keamanan Enkripsi Perbankan 256-bit</p>
              </div>
            </div>
            <div className="text-right font-mono text-[9px] text-slate-400">
              ZR-SYS-AUTH-{wd.id}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
          <button
            onClick={() => setSelectedReceiptWithdrawal(null)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Tutup Kuitansi
          </button>
        </div>
      </div>
    </div>
  );
};
