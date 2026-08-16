import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'dark' | 'olive';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#EC8944] hover:bg-[#F4904B] active:bg-[#EC8944] text-white shadow-xs shadow-[#EC8944]/20 focus:ring-[#FAAC57] border border-transparent',
    secondary:
      'bg-[#FFF2C5] hover:bg-[#FFF2C5]/80 text-[#EC8944] active:bg-[#FFF2C5] focus:ring-[#FAAC57] border border-[#FAAC57]/40',
    outline:
      'bg-white hover:bg-[#FEFEFE] text-[#3B3B3B] active:bg-[#FFF2C5]/30 border border-slate-200 shadow-xs focus:ring-[#FAAC57]',
    danger:
      'bg-[#D24B4B] hover:bg-[#D24B4B]/90 active:bg-[#D24B4B] text-white shadow-xs shadow-[#D24B4B]/20 focus:ring-[#D24B4B] border border-transparent',
    ghost:
      'bg-transparent hover:bg-slate-100 text-[#3B3B3B] active:bg-slate-200 focus:ring-[#FAAC57] border border-transparent',
    dark:
      'bg-[#3B3B3B] hover:bg-[#3B3B3B]/90 active:bg-black text-white shadow-xs shadow-[#3B3B3B]/30 focus:ring-[#3B3B3B] border border-[#3B3B3B]',
    olive:
      'bg-[#82A859] hover:bg-[#48661D] active:bg-[#82A859] text-white shadow-xs shadow-[#82A859]/20 focus:ring-[#A9D589] border border-transparent',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    xs: 'text-[11px] px-2.5 py-1 space-x-1 rounded-lg',
    sm: 'text-xs px-3 py-1.5 space-x-1.5 rounded-lg',
    md: 'text-xs sm:text-sm px-4 py-2 space-x-2 rounded-xl',
    lg: 'text-sm sm:text-base px-5 py-2.5 space-x-2.5 rounded-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
