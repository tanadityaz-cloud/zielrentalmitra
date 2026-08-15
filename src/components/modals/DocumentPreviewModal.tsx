import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileCheck2,
  AlertTriangle,
  Download,
  ShieldCheck,
  Boxes,
} from 'lucide-react';

export const DocumentPreviewModal: React.FC = () => {
  const { selectedDocForPreview, setSelectedDocForPreview, addToast } = useApp();

  if (!selectedDocForPreview) return null;

  const doc = selectedDocForPreview;

  const getStatusBadge = () => {
    switch (doc.status) {
      case 'valid':
        return (
          <span className="px-2.5 py-1 bg-[#A9D589]/30 text-[#48661D] border border-[#82A859]/40 text-xs font-bold rounded-lg flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Valid & Terverifikasi SNI</span>
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-lg flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Segera Berakhir (Perlu Uji Ulang)</span>
          </span>
        );
      case 'expired':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold rounded-lg flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Kadaluarsa / Perlu QC</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold rounded-lg">
            Dalam Proses Verifikasi
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#3B3B3B] to-[#1E293B] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#A9D589]/20 text-[#A9D589] border border-[#82A859]/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {doc.type} - {doc.unitName}
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                {doc.productCode} • No: {doc.docNumber}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedDocForPreview(null)}
            className="text-white/70 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Status and summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status Legalitas</span>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Masa Berlaku Sampai</span>
              <span className="font-bold text-sm text-slate-900 font-mono mt-1 block">
                {doc.expiryDate}
              </span>
            </div>
            {doc.verifiedBy && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Divalidasi Oleh</span>
                <span className="font-medium text-slate-700 mt-1 block">{doc.verifiedBy}</span>
              </div>
            )}
          </div>

          {doc.notes && (
            <div className="p-3.5 bg-[#FFF2C5]/70 rounded-xl border border-[#FAAC57]/50 text-slate-800">
              <span className="font-bold block mb-1">Catatan Verifikasi Tim QC & Legal:</span>
              <p>{doc.notes}</p>
            </div>
          )}

          {/* Document Preview Frame/Image */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 relative group">
            <div className="p-3 bg-slate-200/80 flex items-center justify-between border-b border-slate-300">
              <span className="font-mono text-[11px] text-slate-600 font-semibold">{doc.fileName}</span>
              <span className="text-[10px] text-slate-500 font-mono">{doc.fileSize}</span>
            </div>
            <div className="p-4 flex items-center justify-center min-h-[260px] bg-slate-900">
              <img
                src={doc.fileUrl}
                alt={doc.fileName}
                className="max-h-[320px] rounded-lg shadow-md object-contain border border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={() => {
              addToast({
                type: 'success',
                title: 'Dokumen Diunduh',
                message: `${doc.fileName} berhasil disimpan ke perangkat Anda.`,
              });
            }}
            className="px-4 py-2 bg-[#EC8944] hover:bg-[#F4904B] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Berkas ({doc.fileSize})</span>
          </button>
          <button
            onClick={() => setSelectedDocForPreview(null)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
