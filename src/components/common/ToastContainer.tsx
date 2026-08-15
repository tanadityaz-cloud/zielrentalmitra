import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
            case 'warning':
              return <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />;
            case 'error':
              return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
          }
        };

        const getBgBorder = () => {
          switch (toast.type) {
            case 'success':
              return 'bg-white border-emerald-200 text-slate-800';
            case 'warning':
              return 'bg-white border-amber-200 text-slate-800';
            case 'error':
              return 'bg-white border-rose-200 text-slate-800';
            default:
              return 'bg-white border-blue-200 text-slate-800';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start space-x-3 transition-all duration-200 animate-in slide-in-from-bottom-2 ${getBgBorder()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900 leading-snug">{toast.title}</h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
