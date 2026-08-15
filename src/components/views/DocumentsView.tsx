import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  AlertTriangle,
  UploadCloud,
  Search,
  CheckCircle2,
  Boxes,
} from 'lucide-react';
import { UnitDocument } from '../../types';

export const DocumentsView: React.FC = () => {
  const { documents, setIsDocUploadModalOpen, setSelectedDocForPreview } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredDocs = documents.filter(doc => {
    const matchSearch =
      doc.unitName.toLowerCase().includes(search.toLowerCase()) ||
      doc.productCode.toLowerCase().includes(search.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchType = typeFilter === 'all' || doc.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const validCount = documents.filter(d => d.status === 'valid').length;
  const expiringCount = documents.filter(d => d.status === 'expiring_soon').length;
  const expiredCount = documents.filter(d => d.status === 'expired').length;

  return (
    <div id="documents-view-container" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Sertifikasi SNI & Dokumen Legalitas Produk
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitoring sertifikasi standar keselamatan anak (SNI / ASTM), garansi resmi distributor, dan uji higienitas laboratorium.
          </p>
        </div>
        <button
          onClick={() => setIsDocUploadModalOpen(true)}
          className="px-4 py-2.5 bg-[#EC8944] hover:bg-[#F4904B] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Unggah Sertifikat / Dokumen</span>
        </button>
      </div>

      {/* Compliance Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Sertifikat Valid & Aktif</span>
            <div className="text-3xl font-black text-[#48661D] font-mono mt-1">{validCount} Berkas</div>
            <p className="text-[11px] text-slate-400 mt-1">Lolos standar higienitas & keamanan</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#A9D589]/20 text-[#48661D] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 font-semibold uppercase">Segera Berakhir ({"<"} 30 Hari)</span>
            <div className="text-3xl font-black text-amber-600 font-mono mt-1">{expiringCount} Berkas</div>
            <p className="text-[11px] text-slate-400 mt-1">Perlu perpanjangan masa uji berkala</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-700 font-semibold uppercase">Kadaluarsa / Perlu QC</span>
            <div className="text-3xl font-black text-rose-600 font-mono mt-1">{expiredCount} Berkas</div>
            <p className="text-[11px] text-slate-400 mt-1">Unit distandbykan dari listing sewa</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari ID aset, nama produk, atau nomor sertifikat..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#EC8944] focus:bg-white text-slate-800 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-[#EC8944]"
          >
            <option value="all">Semua Tipe Sertifikat</option>
            <option value="Sertifikat SNI">Sertifikat SNI</option>
            <option value="Garansi Resmi">Garansi Resmi Distributor</option>
            <option value="Uji Higienitas">Sertifikat Higienitas & Steril</option>
            <option value="Kontrak Kemitraan">Kontrak Kemitraan</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-[#EC8944]"
          >
            <option value="all">Semua Status Legal</option>
            <option value="valid">Valid & Terverifikasi</option>
            <option value="expiring_soon">Segera Berakhir</option>
            <option value="expired">Kadaluarsa</option>
          </select>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Jenis Dokumen & No. Sertifikat</th>
                <th className="py-3.5 px-3">Produk Perlengkapan Bayi</th>
                <th className="py-3.5 px-3">ID Aset</th>
                <th className="py-3.5 px-3">Masa Berlaku</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map(doc => (
                <tr
                  key={doc.id}
                  onClick={() => setSelectedDocForPreview(doc)}
                  className="hover:bg-[#FFF2C5]/20 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                        <FileCheck2 className="w-4 h-4 text-[#EC8944]" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{doc.type}</p>
                        <p className="font-mono text-[11px] text-slate-500">{doc.docNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {doc.unitName}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#EC8944]">
                    {doc.productCode}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {doc.expiryDate}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        doc.status === 'valid'
                          ? 'bg-[#A9D589]/30 text-[#48661D]'
                          : doc.status === 'expiring_soon'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {doc.status === 'valid'
                        ? 'Valid & Aktif'
                        : doc.status === 'expiring_soon'
                        ? 'Segera Habis'
                        : 'Kadaluarsa'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocForPreview(doc);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-[#FFF2C5] hover:text-[#EC8944] text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer text-[11px]"
                    >
                      Buka Berkas
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
