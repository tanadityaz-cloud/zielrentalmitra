import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Phone,
  HelpCircle,
  KeyRound,
  MessageCircle,
  Building2,
  BadgeCheck,
  UserCheck,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { setCurrentPage, addToast, partner, loginWithCredentials, loginDemo, loginWithOtp } = useApp();

  const [activeTab, setActiveTab] = useState<'credentials' | 'demo' | 'otp'>('credentials');
  const [identifier, setIdentifier] = useState('rizky.pratama@gmail.com');
  const [password, setPassword] = useState('MitraZiel@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [otpPhone, setOtpPhone] = useState('081234567890');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['8', '8', '2', '1']);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = loginWithCredentials(identifier, password);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Berhasil Masuk Panel Mitra',
          message: res.message,
        });
        setCurrentPage('dashboard');
      } else {
        addToast({
          type: 'error',
          title: 'Gagal Masuk',
          message: res.message,
        });
      }
    }, 400);
  };

  const handleDemoLogin = (tierName: 'Gold Partner' | 'Platinum Partner') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginDemo(tierName);
      addToast({
        type: 'success',
        title: 'Login Demo Berhasil',
        message: `Masuk sebagai ${tierName === 'Platinum Partner' ? 'Siti Nurhaliza' : 'Rizky Pratama'} (${tierName}).`,
      });
      setCurrentPage('dashboard');
    }, 300);
  };

  const handleSendOtp = () => {
    if (!otpPhone || otpPhone.length < 9) {
      addToast({
        type: 'warning',
        title: 'Nomor Tidak Valid',
        message: 'Masukkan nomor WhatsApp aktif dengan benar.',
      });
      return;
    }
    setOtpSent(true);
    addToast({
      type: 'info',
      title: 'Kode OTP Terkirim',
      message: `Kode 4 digit verifikasi telah dikirimkan ke WhatsApp ${otpPhone}. (Gunakan kode: 8821)`,
    });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const codeStr = otpCode.join('');
      const res = loginWithOtp(otpPhone, codeStr);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Verifikasi Berhasil',
          message: res.message,
        });
        setCurrentPage('dashboard');
      } else {
        addToast({
          type: 'error',
          title: 'Verifikasi Gagal',
          message: res.message,
        });
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-[#EC8944] selection:text-white">
      {/* Top Brand Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FAAC57] via-[#F4904B] to-[#EC8944] flex items-center justify-center shadow-lg shadow-[#EC8944]/20 text-white font-black text-xl tracking-tight">
              ZR
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight">ZielRental</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#A9D589]/20 text-[#A9D589] border border-[#82A859]/30">
                  Panel Mitra
                </span>
              </div>
              <p className="text-xs text-slate-400">Baby Gear & Children's Toy Rental Platform</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#82A859]" />
              <span>Sistem Terenkripsi 256-Bit</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <a
              href="https://wa.me/6281299887722?text=Halo%20ZielRental%2C%20saya%20ingin%20tanya%20seputar%20Kemitraan%20Perlengkapan%20Bayi"
              target="_blank"
              rel="noreferrer"
              className="text-[#FAAC57] hover:text-[#F4904B] font-semibold flex items-center space-x-1 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bantuan Mitra</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Login Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Story & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#A9D589]/15 border border-[#82A859]/30 text-[#A9D589] text-xs font-bold uppercase tracking-wider">
              <BadgeCheck className="w-4 h-4 text-[#82A859]" />
              <span>Portal Resmi Pemilik Aset Sewa</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Kelola Aset & Bagi Hasil Sewa <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAAC57] via-[#F4904B] to-[#EC8944]">Perlengkapan Bayi</span> Anda
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Pantau okupansi unit stroller, car seat, box bayi, mainan edukasi, status laundry higienis UV-C, dan pencairan kas harian secara transparan.
              </p>
            </div>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 backdrop-blur-xs">
                <div className="flex items-center space-x-3 mb-1.5">
                  <div className="p-2 rounded-xl bg-[#A9D589]/20 text-[#A9D589] border border-[#82A859]/30">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Bagi Hasil 70% Bersih</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Laporan pembukuan realtime tanpa potongan biaya administrasi tersembunyi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 backdrop-blur-xs">
                <div className="flex items-center space-x-3 mb-1.5">
                  <div className="p-2 rounded-xl bg-[#FAAC57]/20 text-[#FAAC57] border border-[#FAAC57]/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Sanitasi UV-C & Laundry</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unit dicuci dengan sabun food-grade & disterilisasi sebelum disewa kembali.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 backdrop-blur-xs">
                <div className="flex items-center space-x-3 mb-1.5">
                  <div className="p-2 rounded-xl bg-[#82A859]/20 text-[#A9D589] border border-[#82A859]/30">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Pencairan Kas BI-FAST</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tarik saldo sewa ke rekening bank manapun secara instan 24/7.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 backdrop-blur-xs">
                <div className="flex items-center space-x-3 mb-1.5">
                  <div className="p-2 rounded-xl bg-[#EC8944]/20 text-[#FAAC57] border border-[#EC8944]/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Sertifikasi SNI & Legal</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pengawasan kelayakan keselamatan unit demi keamanan anak & orang tua.
                </p>
              </div>
            </div>

            {/* Quick Live Stats Pill */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 border border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#82A859] animate-pulse" />
                <span className="text-slate-300">Ekosistem Kemitraan ZielRental Indonesia</span>
              </div>
              <span className="font-bold text-[#FAAC57] font-mono">1.250+ Unit Aset Aktif</span>
            </div>
          </div>

          {/* Right Column: Interactive Login Box */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
              {/* Form Title */}
              <div className="mb-6 text-center sm:text-left">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#48661D] bg-[#A9D589]/25 px-2.5 py-1 rounded-full border border-[#82A859]/30 mb-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#82A859]" />
                  <span>Autentikasi Mitra</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Masuk ke Panel Mitra</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Akses laporan aset, status sewa, kas, dan bagi hasil Anda
                </p>
              </div>

              {/* Login Method Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('credentials')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'credentials'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Email & PIN
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'demo'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Akun Demo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('otp')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'otp'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  WhatsApp OTP
                </button>
              </div>

              {/* TAB 1: Standard Credentials Form */}
              {activeTab === 'credentials' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Quick Fill Hints */}
                  <div className="flex items-center justify-between p-2.5 bg-[#FFF2C5]/40 rounded-xl border border-[#FAAC57]/30 text-xs">
                    <span className="text-slate-600 text-[11px] font-medium">Isi Cepat:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier('rizky.pratama@gmail.com');
                          setPassword('MitraZiel@2026');
                          addToast({
                            type: 'info',
                            title: 'Kredensial Terisi',
                            message: 'Email & Password Rizky Pratama (Gold Partner) siap digunakan.',
                          });
                        }}
                        className="px-2 py-1 bg-white hover:bg-[#FAAC57]/20 text-[#EC8944] font-bold text-[10px] rounded-md border border-[#FAAC57]/40 cursor-pointer"
                      >
                        Rizky (Gold)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier('siti.nurhaliza@gmail.com');
                          setPassword('MitraZiel@2026');
                          addToast({
                            type: 'info',
                            title: 'Kredensial Terisi',
                            message: 'Email & Password Siti Nurhaliza (Platinum) siap digunakan.',
                          });
                        }}
                        className="px-2 py-1 bg-white hover:bg-[#82A859]/20 text-[#48661D] font-bold text-[10px] rounded-md border border-[#82A859]/40 cursor-pointer"
                      >
                        Siti (Platinum)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email / Nomor WhatsApp Mitra
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="nama@email.com atau 08123456789"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Password / PIN Keamanan
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          addToast({
                            type: 'info',
                            title: 'Bantuan Reset PIN/Password',
                            message: 'Gunakan password default: MitraZiel@2026 atau hubungi PIC Care Anda.',
                          });
                        }}
                        className="text-[11px] text-[#EC8944] hover:text-[#F4904B] font-semibold cursor-pointer"
                      >
                        Lupa PIN?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan PIN / Password"
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-[#EC8944] focus:ring-[#EC8944] cursor-pointer"
                      />
                      <span>Ingat sesi di perangkat ini</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#FAAC57] via-[#F4904B] to-[#EC8944] hover:from-[#F4904B] hover:to-[#EC8944] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#EC8944]/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Masuk ke Dashboard Mitra</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: Quick Demo Accounts */}
              {activeTab === 'demo' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 mb-2">
                    Pilih profil mitra percontohan untuk langsung menjelajahi seluruh modul panel mitra:
                  </p>

                  <div
                    onClick={() => handleDemoLogin('Gold Partner')}
                    className="p-3.5 rounded-2xl border-2 border-[#82A859]/30 bg-[#A9D589]/10 hover:bg-[#A9D589]/20 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        alt="Rizky Pratama"
                        className="w-11 h-11 rounded-xl object-cover border-2 border-[#82A859]"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold text-slate-900">Rizky Pratama</h4>
                          <span className="text-[10px] font-bold text-[#48661D] bg-[#A9D589]/40 px-1.5 py-0.5 rounded">
                            Gold Partner
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">24 Unit (Stroller, Car Seat, Crib)</p>
                        <p className="text-[10px] text-[#EC8944] font-bold font-mono">Saldo: Rp 7.985.000</p>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 bg-[#82A859] hover:bg-[#48661D] text-white rounded-lg text-xs font-bold transition-colors">
                      Masuk
                    </button>
                  </div>

                  <div
                    onClick={() => handleDemoLogin('Platinum Partner')}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                        alt="Siti Nurhaliza"
                        className="w-11 h-11 rounded-xl object-cover border-2 border-purple-400"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold text-slate-900">Siti Nurhaliza</h4>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                            Platinum Partner
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">38 Unit (Playground & Mainan Edukasi)</p>
                        <p className="text-[10px] text-[#EC8944] font-bold font-mono">Saldo: Rp 12.850.000</p>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors">
                      Masuk
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: WhatsApp OTP Login */}
              {activeTab === 'otp' && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nomor WhatsApp Terdaftar
                      </label>
                      <div className="relative mb-3">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          placeholder="081234567890"
                          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full py-3 bg-[#82A859] hover:bg-[#48661D] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Kirim Kode OTP WhatsApp</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                      <div className="p-3 bg-[#A9D589]/20 rounded-xl border border-[#82A859]/30 text-xs text-[#48661D]">
                        Kode OTP 4 digit telah dikirim ke <strong>{otpPhone}</strong> (Gunakan: <strong>8821</strong>)
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                          Masukkan 4-Digit Kode OTP
                        </label>
                        <div className="flex justify-center space-x-3">
                          {[0, 1, 2, 3].map((idx) => (
                            <input
                              key={idx}
                              type="text"
                              maxLength={1}
                              value={otpCode[idx] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOtpCode(prev => {
                                  const copy = [...prev];
                                  copy[idx] = val;
                                  return copy;
                                });
                              }}
                              className="w-12 h-12 text-center text-lg font-bold font-mono bg-slate-50 border border-slate-200 rounded-xl focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden"
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-[#EC8944] hover:bg-[#F4904B] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Verifikasi & Masuk</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="w-full text-center text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        Ganti Nomor WhatsApp
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Registration & Support Footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2">
                <p className="text-xs text-slate-500">
                  Belum terdaftar sebagai mitra pemilik aset?
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentPage('register')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#EC8944] hover:text-[#F4904B] transition-colors cursor-pointer"
                >
                  <span>Daftar Kemitraan Baru ZielRental</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ZielRental © 2024 — PT Ziel Rental Perlengkapan Anak Indonesia</span>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Standar Keamanan SNI</span>
            <span>•</span>
            <span>Higienitas UV-C Medis</span>
            <span>•</span>
            <span>Bagi Hasil 70% Terproteksi</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
