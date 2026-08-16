import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'dark' | 'olive' | 'subtle' | 'buttercream';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  const variantStyles: Record<string, string> = {
    default: 'bg-white border border-slate-200/80 shadow-xs text-[#3B3B3B]',
    elevated: 'bg-white border border-slate-200/80 shadow-md text-[#3B3B3B]',
    dark: 'bg-[#3B3B3B] border border-slate-800 text-white shadow-xl',
    olive: 'bg-gradient-to-br from-[#48661D] via-[#82A859] to-[#82A859] border border-[#82A859]/50 text-white shadow-xl',
    subtle: 'bg-[#FEFEFE] border border-slate-200/70 text-[#3B3B3B]',
    buttercream: 'bg-[#FFF2C5]/40 border border-[#FAAC57]/30 text-[#3B3B3B]',
  };

  const paddingStyles: Record<string, string> = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl transition-all duration-150 ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
