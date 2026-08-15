import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Award,
  Sparkles,
  BarChart3,
  Boxes,
  ChevronRight,
  ArrowUpRight,
  Flame,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockCategoryPerformance } from '../../data/mockData';

export const PerformanceView: React.FC = () => {
  const { vehicles, setSelectedUnit, setCurrentPage } = useApp();

  const sortedByUtilization = [...vehicles].sort((a, b) => b.utilizationRate - a.utilizationRate);
  const topUnits = sortedByUtilization.slice(0, 3);
  const bottomUnits = sortedByUtilization.slice(-3).reverse();

  const averageUtilization = (
    vehicles.reduce((acc, v) => acc + v.utilizationRate, 0) / (vehicles.length || 1)
  ).toFixed(1);

  return (
    <div id="performance-view-container" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Analisis Performa & Tingkat Okupansi Produk Bayi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Metrik utilisasi harian, perbandingan kategori perlengkapan anak, dan evaluasi bagi hasil sewa.
          </p>
        </div>
      </div>

      {/* Top 3 KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Rata-Rata Okupansi Mei 2025</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{averageUtilization}%</span>
            <span className="text-xs text-[#48661D] font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#82A859]" /> +6.4% vs bln lalu
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Standar target okupansi optimal platform: ≥ 70%</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Kategori Paling Diminati</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-black text-slate-900">Stroller & Kereta Dorong</span>
          </div>
          <p className="text-[11px] text-[#48661D] font-semibold mt-1">Okupansi rata-rata 92% (Babyzen YOYO2 & Nuna TRVL)</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Hari Pemakaian Sewa</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 font-mono">158 Hari</span>
            <span className="text-xs text-slate-500">diakumulasi {vehicles.length} unit</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Rata-rata 26 hari masa sewa per produk</p>
        </div>
      </div>

      {/* Performance by Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Perbandingan Performa Berdasarkan Kategori Produk
              </h3>
              <p className="text-xs text-slate-500">Pendapatan Kotor vs Tingkat Okupansi Tiap Kategori</p>
            </div>
            <div className="text-xs font-semibold text-slate-500">Periode: Mei 2025</div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCategoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={val => `Rp ${(val / 1000000).toFixed(1)}Jt`}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={val => `${val}%`}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'revenue' ? `Rp ${Number(val).toLocaleString('id-ID')}` : `${val}%`,
                    name === 'revenue' ? 'Perolehan Sewa' : 'Rata-rata Okupansi',
                  ]}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px' }}
                  formatter={val => (val === 'revenue' ? 'Perolehan Sewa Kotor' : 'Tingkat Okupansi')}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#FAAC57" radius={[6, 6, 0, 0]} barSize={28} />
                <Bar yAxisId="right" dataKey="utilization" fill="#82A859" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Insights Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Rekomendasi Penambahan Aset</h3>
            <p className="text-xs text-slate-500 mb-4">Analisis data tren sewa keluarga & orang tua ZielRental</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FFF2C5]/70 rounded-2xl border border-[#FAAC57]/60">
                <div className="font-bold text-[#3B3B3B] flex items-center space-x-1.5 mb-1">
                  <Flame className="w-4 h-4 text-[#EC8944]" />
                  <span>Permintaan Tinggi: Stroller Cabin Size</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Stroller travel lipat (Babyzen YOYO / Nuna) sering kehabisan stok menjelang liburan keluarga dan akhir pekan.
                </p>
              </div>

              <div className="p-3 bg-[#A9D589]/20 rounded-2xl border border-[#82A859]/30">
                <div className="font-bold text-[#48661D] flex items-center space-x-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-[#82A859]" />
                  <span>Potensi Ekspansi: Mainan Sensori & Montessori</span>
                </div>
                <p className="text-[#48661D] leading-relaxed">
                  Pikler triangle, wooden puzzle, dan mainan edukasi memiliki durasi sewa bulanan dengan rasio kerusakan sangat rendah.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('assets')}
            className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>Lihat Semua Unit Aset</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top High Occupancy vs Low Occupancy Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 3 High Occupancy */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 text-[#48661D] font-bold text-sm mb-4">
            <Award className="w-5 h-5" />
            <span>3 Produk Okupansi Tertinggi Bulan Ini</span>
          </div>

          <div className="space-y-3">
            {topUnits.map((u, idx) => (
              <div
                key={u.id}
                onClick={() => {
                  setSelectedUnit(u);
                  setCurrentPage('unit-detail');
                }}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-[#FAAC57] hover:bg-[#FFF2C5]/30 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-3">
                  <img src={u.thumbnail} alt={u.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{u.name}</p>
                    <p className="font-mono text-[11px] text-[#EC8944]">{u.productCode} • {u.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#48661D] text-sm">{u.utilizationRate}%</span>
                  <p className="text-[10px] text-slate-500">Rp {u.currentMonthRevenue.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Lowest Occupancy */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 text-[#EC8944] font-bold text-sm mb-4">
            <BarChart3 className="w-5 h-5" />
            <span>Unit Perlu Promosi / Diskon Bundle</span>
          </div>

          <div className="space-y-3">
            {bottomUnits.map((u, idx) => (
              <div
                key={u.id}
                onClick={() => {
                  setSelectedUnit(u);
                  setCurrentPage('unit-detail');
                }}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-[#EC8944] hover:bg-[#FFF2C5]/20 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-3">
                  <img src={u.thumbnail} alt={u.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{u.name}</p>
                    <p className="font-mono text-[11px] text-slate-500">{u.productCode} • {u.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#EC8944] text-sm">{u.utilizationRate}%</span>
                  <p className="text-[10px] text-slate-500">Rp {u.currentMonthRevenue.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
