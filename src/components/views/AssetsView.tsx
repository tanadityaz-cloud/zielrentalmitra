import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Baby,
  Calendar,
  CheckCircle2,
  Clock,
  PackageCheck,
} from 'lucide-react';
import { BabyAssetUnit, UnitCategory, UnitStatus } from '../../types';

export const AssetsView: React.FC = () => {
  const { vehicles, setSelectedUnit, setCurrentPage } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'revenue' | 'utilization' | 'name'>('revenue');

  // Filter logic
  const filteredAssets = vehicles
    .filter(v => {
      const matchSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.productCode.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'all' || v.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || v.status === selectedStatus;
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.currentMonthRevenue - a.currentMonthRevenue;
      if (sortBy === 'utilization') return b.utilizationRate - a.utilizationRate;
      return a.name.localeCompare(b.name);
    });

  const categories: { label: string; value: string }[] = [
    { label: 'Semua Kategori Bayi', value: 'all' },
    { label: 'Stroller & Kereta Dorong', value: 'Stroller' },
    { label: 'Mainan Edukasi & Boneka', value: 'Mainan Bayi & Edukasi' },
    { label: 'Car Seat & Keamanan', value: 'Car Seat' },
    { label: 'Box Bayi & Tempat Tidur', value: 'Box & Tempat Tidur' },
    { label: 'High Chair & Kursi Makan', value: 'High Chair & Feeding' },
    { label: 'Sterilizer & Pompa ASI', value: 'Perlengkapan Menyusui' },
  ];

  const statuses: { label: string; value: string }[] = [
    { label: 'Semua Status Unit', value: 'all' },
    { label: 'Sedang Disewa (Aktif)', value: 'rented' },
    { label: 'Tersedia di Gudang (Siap Sewa)', value: 'available' },
    { label: 'Sterilisasi & Laundry UV', value: 'maintenance' },
  ];

  const getStatusBadge = (status: UnitStatus) => {
    switch (status) {
      case 'rented':
        return (
          <span className="px-2.5 py-1 bg-[#A9D589]/25 text-[#48661D] border border-[#82A859]/40 text-[11px] font-bold rounded-lg flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#82A859] animate-pulse" />
            <span>Sedang Disewa</span>
          </span>
        );
      case 'available':
        return (
          <span className="px-2.5 py-1 bg-[#FFF2C5] text-[#EC8944] border border-[#FAAC57]/60 text-[11px] font-bold rounded-lg flex items-center space-x-1">
            <PackageCheck className="w-3.5 h-3.5 text-[#EC8944]" />
            <span>Tersedia (Siap Sewa)</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold rounded-lg flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#EC8944]" />
            <span>Sterilisasi & Laundry</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg">
            Standby
          </span>
        );
    }
  };

  const handleUnitClick = (unit: BabyAssetUnit) => {
    setSelectedUnit(unit);
    setCurrentPage('unit-detail');
  };

  return (
    <div id="assets-view-container" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Quick Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Katalog Aset Perlengkapan Bayi & Mainan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pantau kondisi fisik, jadwal sanitasi UV berkala, okupansi sewa harian, dan penerimaan bagi hasil unit Anda.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tampilan Tabel Rinci"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        {/* Search input */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari produk, ID aset, atau merk..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#EC8944] focus:bg-white text-slate-800 font-medium"
          />
        </div>

        {/* Category & Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-[#EC8944]"
          >
            {categories.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-[#EC8944]"
          >
            {statuses.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-[#EC8944]"
          >
            <option value="revenue">Urutkan: Pendapatan Tertinggi</option>
            <option value="utilization">Urutkan: Okupansi Tertinggi</option>
            <option value="name">Urutkan: Nama Produk (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid View of Baby Equipment Units */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAssets.map(unit => (
            <div
              key={unit.id}
              onClick={() => handleUnitClick(unit)}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-[#FAAC57] hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group"
            >
              {/* Thumbnail with Overlay Badges */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={unit.thumbnail}
                  alt={unit.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

                {/* Top badges: Category & Brand */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg border border-white/20">
                    {unit.category}
                  </span>
                  <span className="px-2 py-1 bg-[#FFF2C5] text-[#3B3B3B] text-[10px] font-bold rounded-lg border border-[#FAAC57]/60 font-mono">
                    {unit.brand}
                  </span>
                </div>

                <div className="absolute top-3 right-3">{getStatusBadge(unit.status)}</div>

                {/* Bottom title & Product Code */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm sm:text-base leading-tight truncate drop-shadow-xs">
                    {unit.name}
                  </h3>
                  <p className="font-mono text-xs font-semibold text-[#A9D589] drop-shadow-xs">
                    {unit.productCode}
                  </p>
                </div>
              </div>

              {/* Specs & Performance Stats */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Key Baby Specs Row */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pb-3 border-b border-slate-100">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-medium block">Rentang Usia</span>
                    <span className="font-bold text-slate-800">{unit.specs.ageRange}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-medium block">Beban Maks</span>
                    <span className="font-bold text-slate-800">{unit.specs.weightLimit}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-medium block">Higienitas</span>
                    <span className="font-bold text-[#48661D] text-[11px] truncate block">
                      {unit.specs.cleaningMethod}
                    </span>
                  </div>
                </div>

                {/* Monthly Earnings & Utilization Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Bagi Hasil Bulan Ini</span>
                    <span className="font-mono font-black text-[#48661D] text-sm">
                      Rp {unit.currentMonthRevenue.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Tingkat Okupansi Sewa</span>
                      <span className="font-bold text-slate-800">{unit.utilizationRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          unit.utilizationRate >= 85
                            ? 'bg-[#82A859]'
                            : unit.utilizationRate >= 70
                            ? 'bg-[#FAAC57]'
                            : 'bg-[#EC8944]'
                        }`}
                        style={{ width: `${unit.utilizationRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sanitasi / QC Check & Action Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-[#FAAC57]" />
                    <span className="text-[11px]">Sanitasi: {unit.lastCleanedDate}</span>
                  </div>
                  <span className="font-bold text-[#EC8944] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Detail Aset</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View of Baby Units */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Produk Perlengkapan Bayi</th>
                  <th className="py-3.5 px-3">ID Aset / Kategori</th>
                  <th className="py-3.5 px-3">Status Unit</th>
                  <th className="py-3.5 px-3 text-right">Tarif Sewa / Hari</th>
                  <th className="py-3.5 px-3 text-right">Bagi Hasil Bulan Ini</th>
                  <th className="py-3.5 px-3 text-center">Okupansi</th>
                  <th className="py-3.5 px-3">Sanitasi Terakhir</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map(unit => (
                  <tr
                    key={unit.id}
                    onClick={() => handleUnitClick(unit)}
                    className="hover:bg-[#FFF2C5]/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={unit.thumbnail}
                          alt={unit.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{unit.name}</p>
                          <p className="text-[11px] text-slate-500">{unit.brand} • {unit.specs.ageRange}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-mono font-bold text-[#EC8944]">{unit.productCode}</p>
                      <span className="text-[10px] text-slate-500">{unit.category}</span>
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(unit.status)}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      Rp {unit.dailyRate.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#48661D]">
                      Rp {unit.currentMonthRevenue.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-slate-800">{unit.utilizationRate}%</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {unit.lastCleanedDate}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnitClick(unit);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-[#FFF2C5] hover:text-[#EC8944] text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Buka Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
