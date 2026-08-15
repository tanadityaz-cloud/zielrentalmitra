import React from 'react';
import { ShieldCheck, Headphones, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { partner, setCurrentPage } = useApp();

  return (
    <footer id="main-portal-footer" className="mt-12 pt-8 pb-12 border-t border-slate-200 text-xs text-slate-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Legal */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FAAC57] to-[#EC8944] flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-xs">
            ZR
          </div>
          <div>
            <p className="font-semibold text-slate-800">
              ZielRental Baby & Toy Partner Portal <span className="text-slate-400 font-normal">v2.4.0</span>
            </p>
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} PT Ziel Care Nusantara (Baby Gear & Kids Rental Platform).
            </p>
          </div>
        </div>

        {/* Middle: Security & Hygiene Status */}
        <div className="flex items-center space-x-4 text-[11px]">
          <div className="flex items-center space-x-1 text-[#48661D] bg-[#A9D589]/25 px-2.5 py-1 rounded-full border border-[#82A859]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#82A859] animate-pulse"></span>
            <span className="font-semibold">Standar Higienitas UV-C Aktif</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-[#82A859]" />
            <span>Garansi Keamanan & Sertifikasi SNI</span>
          </div>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center space-x-4 text-[11px]">
          <button
            onClick={() => setCurrentPage('documents')}
            className="hover:text-[#EC8944] transition-colors cursor-pointer"
          >
            Standar Kualitas & QC
          </button>
          <span>•</span>
          <button
            onClick={() => setCurrentPage('profit-share')}
            className="hover:text-[#EC8944] transition-colors cursor-pointer"
          >
            Ketentuan Bagi Hasil (70%)
          </button>
          <span>•</span>
          <a
            href={`https://wa.me/${partner.assignedAccountManager.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#EC8944] hover:text-[#F4904B] font-semibold flex items-center space-x-1"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>PIC Care</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
