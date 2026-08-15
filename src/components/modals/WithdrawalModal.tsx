import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Info,
  Lock,
} from 'lucide-react';

export const WithdrawalModal: React.FC = () => {
  const {
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    availableBalance,
    bankAccounts,
    requestWithdrawal,
  } = useApp();

  const [selectedBankId, setSelectedBankId] = useState<string>(bankAccounts[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [step, setStep] = useState<'input' | 'confirm' | 'processing'>('input');
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isWithdrawModalOpen) return null;

  const numAmount = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const selectedBank = bankAccounts.find(b => b.id === selectedBankId) || bankAccounts[0];

  const presets = [
    { label: 'Rp 500.000', value: 500000 },
    { label: 'Rp 1.000.000', value: 1000000 },
    { label: 'Rp 2.500.000', value: 2500000 },
    { label: 'Tarik Semua Saldo', value: availableBalance },
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      setAmount('');
      setErrorMsg('');
      return;
    }
    const val = parseInt(rawVal, 10);
    setAmount(val.toLocaleString('id-ID'));
    if (val > availableBalance) {
      setErrorMsg(`Saldo kas Anda hanya Rp ${availableBalance.toLocaleString('id-ID')}`);
    } else if (val < 50000) {
      setErrorMsg('Minimal penarikan adalah Rp 50.000');
    } else {
      setErrorMsg('');
    }
  };

  const handleApplyPreset = (val: number) => {
    if (val > availableBalance) {
      val = availableBalance;
    }
    setAmount(val.toLocaleString('id-ID'));
    setErrorMsg('');
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount < 50000) {
      setErrorMsg('Minimal penarikan adalah Rp 50.000');
      return;
    }
    if (numAmount > availableBalance) {
      setErrorMsg(`Saldo tidak mencukupi. Tersedia: Rp ${availableBalance.toLocaleString('id-ID')}`);
      return;
    }
    setErrorMsg('');
    setStep('confirm');
  };

  const handleExecuteWithdrawal = async () => {
    if (pin.length < 4) {
      setErrorMsg('Masukkan 6 digit PIN Pengaman Anda');
      return;
    }
    setStep('processing');

    setTimeout(async () => {
      const success = await requestWithdrawal(numAmount, selectedBankId, notes);
      if (success) {
        setIsWithdrawModalOpen(false);
        setStep('input');
        setAmount('');
        setPin('');
      } else {
        setStep('input');
      }
    }, 1200);
  };

  const handleClose = () => {
    setIsWithdrawModalOpen(false);
    setStep('input');
    setAmount('');
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#3B3B3B] to-[#1E293B] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#A9D589]/20 text-[#A9D589] flex items-center justify-center border border-[#82A859]/30">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Pencairan Dana Kas Mitra</h3>
              <p className="text-xs text-slate-300">Pencairan Real-Time via Jaringan BI-FAST (Bebas Biaya)</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handleProceedToConfirm} className="space-y-5">
              {/* Current Available Balance Banner */}
              <div className="p-4 rounded-2xl bg-[#FFF2C5]/40 border border-[#FAAC57]/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#48661D] uppercase tracking-wider">
                    Saldo Kas Siap Dicairkan
                  </span>
                  <div className="text-2xl font-black text-slate-900 tracking-tight font-mono mt-0.5">
                    Rp {availableBalance.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 bg-[#82A859] text-white text-[11px] font-bold rounded-lg shadow-xs">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Instan & Bebas Biaya</span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nominal Penarikan (IDR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                    Rp
                  </span>
                  <input
                    id="withdrawal-amount-input"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Contoh: 1.500.000"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 focus:border-[#EC8944] rounded-xl font-mono text-lg font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#EC8944]/20 transition-all"
                  />
                </div>

                {errorMsg && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMsg}</span>
                  </p>
                )}

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(p.value)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-[#FFF2C5] hover:text-[#EC8944] hover:border-[#FAAC57] border border-slate-200 text-slate-700 transition-all cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Account Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rekening Tujuan Pencairan
                </label>
                <div className="space-y-2">
                  {bankAccounts.map(bank => (
                    <label
                      key={bank.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedBankId === bank.id
                          ? 'border-[#FAAC57] bg-[#FFF2C5]/30 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="bankAccount"
                          value={bank.id}
                          checked={selectedBankId === bank.id}
                          onChange={() => setSelectedBankId(bank.id)}
                          className="w-4 h-4 text-[#EC8944] focus:ring-[#EC8944]"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-slate-900">{bank.bankName}</span>
                            {bank.isPrimary && (
                              <span className="text-[10px] bg-[#EC8944] text-white px-1.5 py-0.2 rounded font-semibold">
                                Utama
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-slate-600">
                            {bank.accountNumber} • a.n {bank.accountHolder}
                          </p>
                        </div>
                      </div>
                      <Building2 className="w-5 h-5 text-slate-400" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catatan Transaksi (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Misal: Penarikan bagi hasil sewa stroller & baby toy"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#EC8944]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="confirm-withdrawal-proceed-btn"
                  type="submit"
                  disabled={numAmount <= 0 || numAmount > availableBalance}
                  className="px-6 py-2.5 bg-[#EC8944] hover:bg-[#F4904B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md shadow-[#EC8944]/20 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Lanjutkan Konfirmasi</span>
                </button>
              </div>
            </form>
          )}

          {step === 'confirm' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="text-center pb-2 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Total Dana Yang Diterima</span>
                <div className="text-3xl font-black text-slate-900 font-mono tracking-tight mt-1">
                  Rp {numAmount.toLocaleString('id-ID')}
                </div>
                <div className="inline-flex items-center space-x-1 text-[#48661D] text-xs font-semibold mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#82A859]" />
                  <span>Biaya Admin: Rp 0 (100% Ditanggung ZielRental)</span>
                </div>
              </div>

              {/* Details table */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Tujuan:</span>
                  <span className="font-bold text-slate-800">{selectedBank?.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Rekening:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedBank?.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Penerima:</span>
                  <span className="font-bold text-slate-800">{selectedBank?.accountHolder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Pengiriman:</span>
                  <span className="font-semibold text-[#48661D]">BI-FAST Instant Transfer (0 Menit)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sisa Saldo Setelah Penarikan:</span>
                  <span className="font-mono font-bold text-slate-800">
                    Rp {(availableBalance - numAmount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Security PIN Authorization Simulation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Masukkan PIN Keamanan Mitra (6 Digit)</span>
                  </span>
                  <span className="text-[11px] text-[#EC8944] font-semibold">PIN Demo: Bebas 6 Angka</span>
                </label>
                <input
                  id="security-pin-input"
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="• • • • • •"
                  className="w-full text-center py-2.5 tracking-widest text-lg font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-[#EC8944] focus:bg-white outline-none"
                />
                {errorMsg && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errorMsg}</p>
                )}
              </div>

              <div className="p-3 bg-[#FFF2C5]/60 rounded-xl border border-[#FAAC57]/40 flex items-start space-x-2 text-[11px] text-slate-800">
                <Info className="w-4 h-4 text-[#EC8944] shrink-0 mt-0.5" />
                <p>
                  Dana akan dikirimkan secara instan langsung ke rekening bank tujuan Anda.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Kembali Ubah
                </button>
                <button
                  id="execute-withdrawal-final-btn"
                  type="button"
                  onClick={handleExecuteWithdrawal}
                  className="px-6 py-2.5 bg-[#EC8944] hover:bg-[#F4904B] text-white font-bold text-xs rounded-xl shadow-md shadow-[#EC8944]/20 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Otorisasi & Cairkan Sekarang</span>
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-[#EC8944] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-bold text-slate-900">Memproses Transfer BI-FAST...</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Menghubungkan ke gateway perbankan ZielRental. Mohon tunggu beberapa detik.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
