import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Sparkles, ShieldCheck, Check, RotateCcw, PackageCheck } from 'lucide-react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'emerald'
  | 'orange'
  | 'amber'
  | 'rose'
  | 'purple'
  | 'olive';

interface StatusBadgeProps {
  status?: string;
  label?: string;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  icon?: boolean | React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  variant,
  size = 'xs',
  icon = false,
  className = '',
}) => {
  let computedVariant: BadgeVariant = variant || 'neutral';
  let computedLabel = label || status || '';
  let defaultIcon: React.ReactNode = null;

  if (status) {
    switch (status.toLowerCase()) {
      case 'rented':
      case 'sedang disewa':
      case 'active':
      case 'aktif':
      case 'valid':
      case 'settled':
      case 'success':
      case 'berhasil':
      case 'completed':
        computedVariant = 'olive';
        computedLabel = label || (status === 'rented' ? 'Sedang Disewa' : status === 'valid' ? 'Valid & Aktif' : status === 'settled' || status === 'completed' ? 'Selesai' : status);
        defaultIcon = <CheckCircle2 className="w-3 h-3 text-[#48661D]" />;
        break;

      case 'available':
      case 'tersedia':
      case 'siap disewa':
      case 'ready':
      case 'gudang':
        computedVariant = 'orange';
        computedLabel = label || 'Tersedia di Gudang (Siap Sewa)';
        defaultIcon = <PackageCheck className="w-3 h-3 text-[#EC8944]" />;
        break;

      case 'laundry':
      case 'sterilisasi':
      case 'steril & higienis (uv-c)':
      case 'bersih & siap pakai':
        computedVariant = 'emerald';
        computedLabel = label || (status === 'laundry' ? 'Sterilisasi & Laundry UV' : status);
        defaultIcon = <Sparkles className="w-3 h-3 text-[#48661D]" />;
        break;

      case 'maintenance':
      case 'perawatan':
      case 'pemeriksaan':
      case 'inspection':
      case 'expiring_soon':
      case 'segera berakhir':
      case 'pending':
      case 'menunggu':
      case 'perlu laundry':
      case 'dalam proses cuci':
        computedVariant = 'warning';
        computedLabel = label || (status === 'maintenance' ? 'Perlu Pemeriksaan/Servis' : status === 'expiring_soon' ? 'Segera Berakhir' : status === 'pending' ? 'Pending Verifikasi' : status);
        defaultIcon = <Clock className="w-3 h-3 text-[#EC8944]" />;
        break;

      case 'expired':
      case 'kadaluarsa':
      case 'rejected':
      case 'failed':
      case 'gagal':
      case 'rusak':
        computedVariant = 'danger';
        computedLabel = label || (status === 'expired' ? 'Kadaluarsa' : status === 'failed' ? 'Gagal' : status);
        defaultIcon = <AlertTriangle className="w-3 h-3 text-[#D24B4B]" />;
        break;

      case 'vip':
      case 'platinum':
      case 'gold':
      case 'gold partner':
        computedVariant = 'amber';
        defaultIcon = <ShieldCheck className="w-3 h-3 text-[#EC8944]" />;
        break;

      default:
        if (!variant) computedVariant = 'neutral';
        break;
    }
  }

  const variantStyles: Record<BadgeVariant, string> = {
    olive: 'bg-[#A9D589]/20 text-[#48661D] border-[#82A859]/40',
    success: 'bg-[#A9D589]/25 text-[#48661D] border-[#82A859]/50',
    emerald: 'bg-[#A9D589]/20 text-[#48661D] border-[#82A859]/40',
    orange: 'bg-[#FFF2C5] text-[#EC8944] border-[#FAAC57]/60 font-semibold',
    info: 'bg-[#FFF2C5] text-[#3B3B3B] border-[#FAAC57]/50',
    warning: 'bg-[#FFF2C5] text-[#EC8944] border-[#FAAC57]/60',
    amber: 'bg-[#FFF2C5] text-[#EC8944] border-[#FAAC57]/60',
    danger: 'bg-rose-50 text-[#D24B4B] border-[#D24B4B]/30',
    rose: 'bg-rose-50 text-[#D24B4B] border-[#D24B4B]/30',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles: Record<'xs' | 'sm' | 'md', string> = {
    xs: 'text-[10px] px-2 py-0.5 tracking-tight',
    sm: 'text-xs px-2.5 py-0.5 tracking-normal',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1 font-semibold rounded-full border whitespace-nowrap select-none ${
        variantStyles[computedVariant]
      } ${sizeStyles[size]} ${className}`}
    >
      {icon && (typeof icon === 'boolean' ? defaultIcon : icon)}
      <span>{computedLabel}</span>
    </span>
  );
};
