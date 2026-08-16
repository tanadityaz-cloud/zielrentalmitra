import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MapPin,
  Building2,
  CreditCard,
  FileCheck2,
  Lock,
  Eye,
  EyeOff,
  BadgeCheck,
} from 'lucide-react';

export const RegisterView: React.FC = () => {
  const { setCurrentPage, addToast, setPartner } = useApp();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // 1. Identitas Pemilik Sewa
  const [fullName, setFullName] = useState('Rizky Pratama');
  const [whatsapp, setWhatsapp] = useState('081298765432');
  const [email, setEmail] = useState('rizky.pratama@gmail.com');
  const [nik, setNik] = useState('3171052408920003');
  const [city, setCity] = useState('Jakarta Selatan');
  const [address, setAddress] = useState('Jl. Senopati Raya No. 45, Kebayoran Baru');

  // 2. Rekening Bank Pembayaran
  const [bankName, setBankName] = useState('Bank Central Asia (BCA)');
  const [accountNumber, setAccountNumber] = useState('8830192841');
  const [accountHolderName, setAccountHolderName] = useState('RIZKY PRATAMA');

  // 3. Password Akun
  const [password, setPassword] = useState('MitraZiel@2026');
  const [confirmPassword, setConfirmPassword] = useState('MitraZiel@2026');

  // Generated Partner Code
  const [generatedPartnerCode, setGeneratedPartnerCode] = useState('ZR-MTR-88219');

  const handleQuickFill = () => {
    setFullName('Rizky Pratama');
    setWhatsapp('081298765432');
    setEmail('rizky.pratama@gmail.com');
    setNik('3171052408920003');
    setCity('Jakarta Selatan');
    setAddress('Jl. Senopati Raya No. 45, Kebayoran Baru');
    setBankName('Bank Central Asia (BCA)');
    setAccountNumber('8830192841');
    setAccountHolderName('RIZKY PRATAMA');
    setPassword('MitraZiel@2026');
    setConfirmPassword('MitraZiel@2026');
    addToast({
      type: 'info',
      title: 'Form Terisi Otomatis (Demo)',
      message: 'Data formulir kemitraan percontohan telah diisi.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast({
        type: 'warning',
        title: 'Password Tidak Cocok',
        message: 'Konfirmasi password harus sama dengan password yang dibuat.',
      });
      return;
    }

    if (password.length < 6) {
      addToast({
        type: 'warning',
        title: 'Password Terlalu Pendek',
        message: 'Password minimal terdiri dari 6 karakter.',
      });
      return;
    }

    setIsSubmitting(true);
    const newCode = `ZR-MTR-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedPartnerCode(newCode);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setPartner((prev) => ({
        ...prev,
        name: fullName,
        email: email,
        phone: whatsapp,
        partnerCode: newCode,
        tier: 'Gold Partner',
        bankAccount: {
          bankName: bankName,
          accountNumber: accountNumber,
          holderName: accountHolderName,
        },
      }));
      addToast({
        type: 'success',
        title: 'Pendaftaran Akun Kemitraan Berhasil!',
        message: `Akun mitra ${newCode} atas nama ${fullName} telah aktif.`,
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-[#EC8944] selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FAAC57] via-[#F4904B] to-[#EC8944] flex items-center justify-center shadow-lg shadow-[#EC8944]/20 text-white font-black text-xl tracking-tight">
              ZR
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight">ZielRental</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#A9D589]/20 text-[#A9D589] border border-[#82A859]/30">
                  Daftar Mitra
                </span>
              </div>
              <p className="text-xs text-slate-400">Pendaftaran Akun Pemilik Aset Sewa</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleQuickFill}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FAAC57]" />
              <span>Isi Data Otomatis (Demo)</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('login')}
              className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
            >
              Sudah Punya Akun? Masuk
            </button>
          </div>
        </div>
      </header>

      {/* Main Registration Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {!isSuccess ? (
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            {/* Header Form */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Pendaftaran Akun Kemitraan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Lengkapi identitas diri, nomor rekening pencairan sewa, dan kata sandi akun mitra Anda. Input unit aset akan ditangani langsung oleh tim Admin ZielRental.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* BAGIAN 1: IDENTITAS PEMILIK SEWA */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#A9D589]/25 text-[#48661D] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Identitas Pemilik Sewa
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap (Sesuai KTP) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Rizky Pratama"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor WhatsApp Aktif *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="081234567890"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Alamat Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      NIK KTP (16 Digit) *
                    </label>
                    <div className="relative">
                      <FileCheck2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        placeholder="3171052408920003"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-mono font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kota / Wilayah Domisili *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900 cursor-pointer"
                      >
                        <option value="Jakarta Selatan">Jakarta Selatan</option>
                        <option value="Jakarta Barat">Jakarta Barat</option>
                        <option value="Jakarta Pusat">Jakarta Pusat</option>
                        <option value="Jakarta Timur">Jakarta Timur</option>
                        <option value="Jakarta Utara">Jakarta Utara</option>
                        <option value="Tangerang Selatan">Tangerang Selatan</option>
                        <option value="Kota Tangerang">Kota Tangerang</option>
                        <option value="Kota Bekasi">Kota Bekasi</option>
                        <option value="Kota Depok">Kota Depok</option>
                        <option value="Kota Bogor">Kota Bogor</option>
                        <option value="Kota Bandung">Kota Bandung</option>
                        <option value="Kota Surabaya">Kota Surabaya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Alamat Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* BAGIAN 2: REKENING BANK PEMBAYARAN */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#A9D589]/25 text-[#48661D] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Rekening Bank Pembayaran
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Bank Tujuan *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900 cursor-pointer"
                      >
                        <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
                        <option value="Bank Mandiri">Bank Mandiri</option>
                        <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
                        <option value="Bank Negara Indonesia (BNI)">Bank Negara Indonesia (BNI)</option>
                        <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
                        <option value="CIMB Niaga">CIMB Niaga</option>
                        <option value="Bank Permata">Bank Permata</option>
                        <option value="Bank Danamon">Bank Danamon</option>
                        <option value="Bank Jago">Bank Jago</option>
                        <option value="SeaBank">SeaBank</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor Rekening *
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Contoh: 8830192841"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-mono font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Pemilik Rekening *
                    </label>
                    <input
                      type="text"
                      required
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      placeholder="RIZKY PRATAMA"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium uppercase text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* BAGIAN 3: SET PASSWORD AKUN */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#A9D589]/25 text-[#48661D] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Set Password Akun
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password Baru *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900"
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Konfirmasi Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password di atas"
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EC8944] focus:ring-2 focus:ring-[#FAAC57]/30 outline-hidden font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentPage('login')}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Batal & Kembali ke Login</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-[#FAAC57] via-[#F4904B] to-[#EC8944] hover:from-[#F4904B] hover:to-[#EC8944] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#EC8944]/25 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <BadgeCheck className="w-4 h-4" />
                      <span>Daftar Akun Mitra</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-[#A9D589]/20 border-2 border-[#82A859] text-[#82A859] rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-[#82A859]/20">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#48661D] bg-[#A9D589]/25 px-3 py-1 rounded-full border border-[#82A859]/30 uppercase tracking-wider">
                Pendaftaran Berhasil
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Selamat Bergabung, {fullName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Akun kemitraan Anda telah aktif. Anda dapat langsung mengakses dashboard mitra Anda.
              </p>
            </div>

            {/* Partner Credentials Snapshot Card */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-left shadow-xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">ID Kemitraan Resmi</span>
                  <span className="text-lg font-black text-[#FAAC57] font-mono tracking-wider">
                    {generatedPartnerCode}
                  </span>
                </div>
                <span className="text-xs font-bold bg-[#A9D589]/20 text-[#A9D589] px-2 py-0.5 rounded-md border border-[#82A859]/40">
                  Mitra Aktif
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Nama Pemilik:</span>
                  <span className="font-semibold text-slate-200">{fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Nomor WhatsApp:</span>
                  <span className="font-semibold text-slate-200">{whatsapp}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Rekening Pembayaran:</span>
                  <span className="font-semibold text-slate-200 font-mono">{bankName.split(' ')[0]} •••• {accountNumber.slice(-4)}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Kota Domisili:</span>
                  <span className="font-semibold text-slate-200">{city}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage('dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#FAAC57] via-[#F4904B] to-[#EC8944] hover:from-[#F4904B] hover:to-[#EC8944] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#EC8944]/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>Masuk ke Dashboard Mitra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                <span>Halaman Login</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ZielRental © 2024 — PT Ziel Rental Perlengkapan Anak Indonesia</span>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Enkripsi 256-Bit SSL</span>
            <span>•</span>
            <span>Pencairan Cepat BI-FAST</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
