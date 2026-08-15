import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'dark' | 'emerald' | 'subtle';
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
    default: 'bg-white border border-slate-200 shadow-xs text-slate-900',
    elevated: 'bg-white border border-slate-200/80 shadow-md text-slate-900',
    dark: 'bg-slate-900 border border-slate-800 text-white shadow-xl',
    emerald: 'bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 border border-emerald-800/50 text-white shadow-xl',
    subtle: 'bg-slate-50 border border-slate-200 text-slate-900',
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
