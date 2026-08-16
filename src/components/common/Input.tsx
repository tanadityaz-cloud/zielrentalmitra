import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  id,
  ...props
}) => {
  const generatedId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={generatedId} className="block text-xs font-bold text-[#3B3B3B] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          id={generatedId}
          className={`w-full py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl outline-none font-medium text-[#3B3B3B] placeholder:text-slate-400 transition-all focus:bg-white focus:ring-2 focus:ring-[#FAAC57]/30 disabled:opacity-60 disabled:bg-slate-100 ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-[#D24B4B] focus:border-[#D24B4B] focus:ring-[#D24B4B]/20 text-[#D24B4B]'
              : 'border-slate-200 focus:border-[#EC8944]'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-[11px] font-medium text-[#D24B4B]">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
};
