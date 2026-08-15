import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  UploadCloud,
  FileCheck,
  Calendar,
  Boxes,
  AlertCircle,
} from 'lucide-react';
import { UnitDocument } from '../../types';

export const DocumentUploadModal: React.FC = () => {
  const { isDocUploadModalOpen, setIsDocUploadModalOpen, vehicles, addDocument } = useApp();

  const [unitId, setUnitId] = useState<string>(vehicles[0]?.id || '');
  const [docType, setDocType] = useState<UnitDocument['type']>('Sertifikat SNI');
  const [docNumber, setDocNumber] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>('2025-01-01');
  const [expiryDate, setExpiryDate] = useState<string>('2026-01-01');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isDocUploadModalOpen) return null;

  const selectedVehicle = vehicles.find(v => v.id === unitId) || vehicles[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) {
      setError('Harap masukkan nomor resmi sertifikat / garansi');
      return;
    }
    if (!selectedFileName) {
      setError('Harap pilih file scan sertifikat PDF / Gambar');
      return;
    }

    addDocument({
      unitId: selectedVehicle.id,
      unitName: selectedVehicle.name,
      productCode: selectedVehicle.productCode,
      type: docType,
      docNumber: docNumber,
      issueDate: issueDate,
      expiryDate: expiryDate,
      status: 'pending_verification',
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      fileName: selectedFileName,
      fileSize: '2.4 MB',
    });

    setIsDocUploadModalOpen(false);
    setDocNumber('');
    setSelectedFileName('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#3B3B3B] to-[#1E293B] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#A9D589]/20 text-[#A9D589] flex items-center justify-center border border-[#82A859]/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Unggah Dokumen Sertifikasi Produk
              </h3>
              <p className="text-xs text-slate-300">Sertifikasi SNI, Garansi Resmi, & Uji Higienitas</p>
            </div>
          </div>
          <button
            onClick={() => setIsDocUploadModalOpen(false)}
            className="text-white/70 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Vehicle Selector */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Unit Produk Bayi
            </label>
            <select
              value={unitId}
              onChange={e => setUnitId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:border-[#EC8944]"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} - ({v.productCode})
                </option>
              ))}
            </select>
          </div>

          {/* Document Type Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jenis Dokumen
              </label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as UnitDocument['type'])}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:border-[#EC8944]"
              >
                <option value="Sertifikat SNI">Sertifikat SNI (Standar Nasional)</option>
                <option value="Garansi Resmi">Kartu Garansi Resmi Distributor</option>
                <option value="Uji Higienitas">Hasil Uji Lab Sanitasi UV</option>
                <option value="Kontrak Kemitraan">Kontrak Kemitraan Sewa</option>
                <option value="Buku Panduan">Buku Panduan & Petunjuk Keamanan</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor Surat / Sertifikat
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={e => setDocNumber(e.target.value)}
                placeholder="Misal: SNI-7617-2025"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:border-[#EC8944]"
              />
            </div>
          </div>

          {/* Expiry Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tanggal Terbit
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:border-[#EC8944]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tanggal Habis Berlaku
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:border-[#EC8944]"
              />
            </div>
          </div>

          {/* File Upload Drop Area */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Berkas Scan PDF / Foto Sertifikat
            </label>
            <label className="border-2 border-dashed border-slate-300 hover:border-[#FAAC57] bg-slate-50 hover:bg-[#FFF2C5]/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              {selectedFileName ? (
                <div className="text-center">
                  <span className="font-bold text-[#EC8944] text-xs">{selectedFileName}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Klik untuk mengganti file</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="font-bold text-slate-700 text-xs">Klik untuk memilih file</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Format didukung: PDF, JPG, PNG (Maks 10MB)</p>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDocUploadModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#EC8944] hover:bg-[#F4904B] text-white font-bold text-xs rounded-xl shadow-md shadow-[#EC8944]/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Kirim Untuk Verifikasi QC & Legal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
