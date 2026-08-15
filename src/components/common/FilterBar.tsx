import React from 'react';
import { Search } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  selectFilters?: {
    value: string;
    onChange: (val: string) => void;
    options: FilterOption[];
  }[];
  actions?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  selectFilters = [],
  actions,
  className = '',
}) => {
  return (
    <div
      className={`p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${className}`}
    >
      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all focus:ring-2 focus:ring-emerald-500/20"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px] font-semibold"
          >
            Reset
          </button>
        )}
      </div>

      {/* Select Filter Dropdowns and Actions */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
        {selectFilters.map((filter, idx) => (
          <select
            key={idx}
            value={filter.value}
            onChange={e => filter.onChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-emerald-500 transition-colors"
          >
            {filter.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
    </div>
  );
};
