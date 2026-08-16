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
              return <CheckCircle2 className="w-5 h-5 text-[#82A859] shrink-0" />;
            case 'warning':
              return <AlertCircle className="w-5 h-5 text-[#FAAC57] shrink-0" />;
            case 'error':
              return <XCircle className="w-5 h-5 text-[#D24B4B] shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-[#EC8944] shrink-0" />;
          }
        };

        const getBgBorder = () => {
          switch (toast.type) {
            case 'success':
              return 'bg-white border-[#82A859]/30 text-[#3B3B3B]';
            case 'warning':
              return 'bg-white border-[#FAAC57]/40 text-[#3B3B3B]';
            case 'error':
              return 'bg-white border-[#D24B4B]/30 text-[#3B3B3B]';
            default:
              return 'bg-white border-[#FAAC57]/30 text-[#3B3B3B]';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start space-x-3 transition-all duration-200 animate-in slide-in-from-bottom-2 ${getBgBorder()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-[#3B3B3B] leading-snug">{toast.title}</h5>
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
