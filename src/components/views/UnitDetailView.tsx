import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Boxes,
  Calendar,
  Sparkles,
  FileCheck2,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  User,
  Download,
  UploadCloud,
  CheckCircle2,
  PackageCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BabyAssetUnit, UnitStatus } from '../../types';

export const UnitDetailView: React.FC = () => {
  const {
    selectedUnit,
    setCurrentPage,
    updateVehicleStatus,
    setIsDocUploadModalOpen,
    setSelectedDocForPreview,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'rentals' | 'maintenance' | 'documents'>('overview');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  if (!selectedUnit) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <Boxes className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Unit Produk Bayi Tidak Ditemukan</h3>
        <button
          onClick={() => setCurrentPage('assets')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Kembali ke Katalog Unit
        </button>
      </div>
    );
  }

  const unit = selectedUnit;

  const mockMonthlyData = [
    { month: 'Jan', revenue: 750000, days: 20 },
    { month: 'Feb', revenue: 820000, days: 22 },
    { month: 'Mar', revenue: 950000, days: 25 },
    { month: 'Apr', revenue: 1100000, days: 26 },
    { month: 'Mei', revenue: unit.currentMonthRevenue, days: 28 },
  ];

  const handleStatusChange = (newStatus: UnitStatus) => {
    updateVehicleStatus(unit.id, newStatus);
  };

  const images = unit.images && unit.images.length > 0 ? unit.images : [unit.thumbnail];

  return (
    <div id="unit-detail-container" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Navigation Back Button & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setCurrentPage('assets')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Unit Bayi</span>
        </button>

        {/* Status Switcher Tool */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium hidden sm:inline">Status Unit:</span>
          <select
            value={unit.status}
            onChange={e => handleStatusChange(e.target.value as UnitStatus)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 outline-none focus:border-[#EC8944] cursor-pointer"
          >
            <option value="rented">Sedang Disewa (Active)</option>
            <option value="available">Tersedia di Gudang (Siap Sewa)</option>
            <option value="maintenance">Sterilisasi & Laundry UV</option>
            <option value="idle">Standby / Non-aktif</option>
          </select>
        </div>
      </div>

      {/* Main Unit Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={images[activeImageIdx]}
                alt={unit.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg">
                  {unit.category}
                </span>
                <span className="px-2 py-1 bg-[#FFF2C5] text-[#3B3B3B] text-[10px] font-bold rounded-lg border border-[#FAAC57]/60 font-mono">
                  {unit.brand}
                </span>
              </div>
            </div>

            {/* Thumbnail row */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx ? 'border-[#EC8944] shadow-xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Quick Unit Profile & Highlights (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {unit.name}
                  </h2>
                  <div className="flex items-center space-x-3 mt-1 text-xs">
                    <span className="font-mono font-bold text-[#EC8944] bg-[#FFF2C5] px-2 py-0.5 rounded-lg border border-[#FAAC57]/50">
                      {unit.productCode}
                    </span>
                    <span className="text-slate-500 font-medium">Merk: {unit.brand} ({unit.model})</span>
                    <span className="text-slate-500 font-medium">• Warna: {unit.specs.color}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tarif Sewa Harian</span>
                  <div className="text-xl font-mono font-black text-slate-900">
                    Rp {unit.dailyRate.toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-slate-500">/hari</span>
                  </div>
                </div>
              </div>

              {/* Warehouse Location Tag */}
              <div className="mt-4 flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-[#EC8944] shrink-0" />
                <span className="font-medium">Lokasi Gudang Hub:</span>
                <span className="font-semibold text-slate-800">{unit.specs.poolLocation}</span>
                <span className="text-slate-400">• Rak: {unit.specs.storageRack}</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#A9D589]/20 border border-[#82A859]/30 rounded-xl">
                <span className="text-[10px] text-[#48661D] uppercase font-semibold block">Bagi Hasil Bulan Ini</span>
                <span className="font-mono font-black text-[#48661D] text-sm mt-0.5 block">
                  Rp {(unit.currentMonthRevenue / 1000).toLocaleString('id-ID')} Rb
                </span>
              </div>
              <div className="p-3 bg-[#FFF2C5] border border-[#FAAC57]/50 rounded-xl">
                <span className="text-[10px] text-[#EC8944] uppercase font-semibold block">Tingkat Okupansi</span>
                <span className="font-mono font-black text-[#3B3B3B] text-sm mt-0.5 block">
                  {unit.utilizationRate}%
                </span>
              </div>
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
                <span className="text-[10px] text-purple-800 uppercase font-semibold block">Total Lifetime</span>
                <span className="font-mono font-black text-purple-950 text-sm mt-0.5 block">
                  Rp {(unit.totalLifetimeRevenue / 1000000).toFixed(1)} Jt
                </span>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <span className="text-[10px] text-amber-800 uppercase font-semibold block">Rating Kepuasan</span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-black text-amber-950 text-sm">{unit.rating}</span>
                  <span className="text-[10px] text-amber-700">({unit.reviewCount} ulasan)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'border-[#EC8944] text-[#EC8944]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Spesifikasi & Tren Bagi Hasil
        </button>
        <button
          onClick={() => setActiveTab('rentals')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'rentals'
              ? 'border-[#EC8944] text-[#EC8944]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Riwayat Sewa ({unit.rentalHistory?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'maintenance'
              ? 'border-[#EC8944] text-[#EC8944]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Riwayat Sanitasi & QC ({unit.serviceHistory?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'documents'
              ? 'border-[#EC8944] text-[#EC8944]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Sertifikasi & Garansi ({unit.documents?.length || 0})
        </button>
      </div>

      {/* Tab 1: Overview & Specs */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detailed Specifications */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Spesifikasi Produk & Standar Keamanan
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rentang Usia</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{unit.specs.ageRange}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Beban Maksimal</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{unit.specs.weightLimit}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bahan & Material</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{unit.specs.material}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sertifikasi Keamanan</span>
                <span className="font-bold text-[#48661D] mt-0.5 block">{unit.specs.safetyStandard}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Metode Sanitasi</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{unit.specs.cleaningMethod}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Kontrak Kemitraan</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{unit.contractExpiryDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Kelengkapan Paket Sewa</span>
                <span className="font-medium text-slate-700 mt-0.5 block">
                  {unit.specs.includedAccessories?.join(', ') || 'Unit utama, pouch pelindung, petunjuk pemakaian'}
                </span>
              </div>
            </div>

            {/* Monthly Trend Chart for This Unit */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 text-xs mb-3">
                Perolehan Bagi Hasil 5 Bulan Terakhir (Unit Ini)
              </h4>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis
                      tickFormatter={val => `Rp ${(val / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 11, fill: '#64748B' }}
                    />
                    <Tooltip
                      formatter={(val: any) => [`Rp ${Number(val).toLocaleString('id-ID')}`, 'Bagi Hasil (70%)']}
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="revenue" fill="#82A859" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sanitasi & Quality Control Schedule */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Jadwal Sterilisasi UV & QC
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">SOP kebersihan standar rumah sakit ZielRental</p>

              <div className="mt-4 p-4 rounded-2xl bg-[#FFF2C5]/50 border border-[#FAAC57]/40 space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-[#EC8944] font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Sanitasi Terakhir:</span>
                </div>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {unit.lastCleanedDate}
                </div>
                <p className="text-slate-600">
                  Status Kebersihan: <span className="font-bold text-[#48661D]">{unit.hygieneGrade}</span>
                </p>
                <div className="pt-2 border-t border-[#FAAC57]/30 text-[11px] text-slate-600">
                  Semua unit melewati proses pencucian deterjen hipoalergenik dan sterilisasi sinar UV-C sebelum & sesudah masa sewa.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Jadwal Sterilisasi Diajukan',
                    message: `Permintaan laundry & sterilisasi ekstra untuk unit ${unit.productCode} berhasil diteruskan ke tim operasional gudang.`,
                  });
                }}
                className="w-full py-2.5 bg-[#82A859] hover:bg-[#48661D] text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Minta Laundry & QC Ulang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rentals History */}
      {activeTab === 'rentals' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
            Riwayat Pemesanan & Penyewaan Unit
          </h3>

          {unit.rentalHistory && unit.rentalHistory.length > 0 ? (
            <div className="space-y-3">
              {unit.rentalHistory.map(rental => (
                <div
                  key={rental.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-[#EC8944] bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        {rental.bookingCode}
                      </span>
                      <span className="font-bold text-slate-900">{rental.renterName}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        rental.status === 'Sedang Disewa'
                          ? 'bg-[#A9D589]/30 text-[#48661D]'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {rental.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Periode Sewa</span>
                      <span className="font-medium">{rental.startDate} - {rental.endDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Area Pengiriman</span>
                      <span className="font-medium">{rental.destinationCity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Biaya Sewa</span>
                      <span className="font-mono font-semibold">Rp {rental.grossAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#48661D] font-bold block">Hak Bersih Mitra (70%)</span>
                      <span className="font-mono font-bold text-[#48661D]">
                        Rp {rental.netPartnerShare.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {rental.review && (
                    <div className="mt-2 p-2.5 bg-[#FFF2C5]/50 rounded-xl border border-[#FAAC57]/30 flex items-start space-x-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-slate-700 italic text-[11px]">"{rental.review}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada riwayat pemesanan terdahulu untuk unit ini.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Hygiene & QC History */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
            Catatan Sanitasi, Laundry & Quality Control
          </h3>

          {unit.serviceHistory && unit.serviceHistory.length > 0 ? (
            <div className="space-y-3">
              {unit.serviceHistory.map(srv => (
                <div
                  key={srv.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{srv.serviceType}</span>
                      <span className="text-slate-500">• {srv.workshop}</span>
                    </div>
                    <span className="font-mono text-slate-500 font-semibold">{srv.date}</span>
                  </div>

                  <p className="text-slate-700">{srv.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-slate-500">
                    <span>Petugas QC: <strong className="font-semibold text-slate-800">{srv.inspectorName}</strong></span>
                    <span>Biaya Laundry/QC: <strong className="font-mono text-[#48661D]">Ditanggung ZielCare Hub</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Unit telah lulus inspeksi awal dan siap disewakan dalam kondisi steril.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Documents & Certifications */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Sertifikat SNI & Dokumen Keamanan Unit
              </h3>
              <p className="text-xs text-slate-500">Sertifikat SNI, Garansi Resmi Distributor, dan Hasil Uji Higienitas</p>
            </div>
            <button
              onClick={() => setIsDocUploadModalOpen(true)}
              className="px-3.5 py-2 bg-[#EC8944] hover:bg-[#F4904B] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Unggah Dokumen Baru</span>
            </button>
          </div>

          {unit.documents && unit.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unit.documents.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocForPreview(doc)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-[#FAAC57] hover:bg-[#FFF2C5]/30 cursor-pointer transition-all flex items-start justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{doc.type}</span>
                      <span
                        className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          doc.status === 'valid'
                            ? 'bg-[#A9D589]/30 text-[#48661D]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status === 'valid' ? 'Valid' : 'Segera Berakhir'}
                      </span>
                    </div>
                    <p className="font-mono text-slate-500 text-[11px]">No: {doc.docNumber}</p>
                    <p className="text-slate-600 text-[11px]">Masa Berlaku: <strong>{doc.expiryDate}</strong></p>
                  </div>
                  <span className="text-[#EC8944] font-bold text-[11px] hover:underline">
                    Lihat Berkas →
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada dokumen tersimpan secara khusus untuk unit ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
