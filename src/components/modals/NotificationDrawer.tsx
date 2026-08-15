import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  Wallet,
  FileCheck2,
  Sparkles,
  Boxes,
  ChevronRight,
} from 'lucide-react';
import { PageView } from '../../types';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentPage,
    setSelectedUnit,
    vehicles,
    setSelectedDocForPreview,
    documents,
    setSelectedProfitShare,
    profitShareTransactions,
  } = useApp();

  if (!isNotificationOpen) return null;

  const handleNotificationClick = (
    id: string,
    targetPage?: PageView,
    targetId?: string
  ) => {
    markNotificationAsRead(id);
    setIsNotificationOpen(false);

    if (targetPage) {
      setCurrentPage(targetPage);
    }

    if (targetId) {
      if (targetId.startsWith('UNIT-')) {
        const u = vehicles.find(v => v.id === targetId);
        if (u) setSelectedUnit(u);
      } else if (targetId.startsWith('DOC-')) {
        const d = documents.find(doc => doc.id === targetId);
        if (d) setSelectedDocForPreview(d);
      } else if (targetId.startsWith('TRX-')) {
        const t = profitShareTransactions.find(trx => trx.id === targetId);
        if (t) setSelectedProfitShare(t);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#3B3B3B] to-[#1E293B] text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#A9D589]/20 text-[#A9D589] border border-[#82A859]/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Notifikasi Aktivitas</h3>
                <p className="text-xs text-slate-300">Pemberitahuan sewa, bagi hasil, dan sanitasi unit</p>
              </div>
            </div>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action bar */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              {notifications.filter(n => !n.isRead).length} Belum Dibaca
            </span>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[#EC8944] hover:text-[#F4904B] font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Tandai Semua Dibaca</span>
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map(n => {
                const getIcon = () => {
                  switch (n.type) {
                    case 'finance':
                      return <Wallet className="w-4 h-4 text-[#82A859]" />;
                    case 'document':
                      return <FileCheck2 className="w-4 h-4 text-amber-600" />;
                    case 'maintenance':
                      return <Sparkles className="w-4 h-4 text-[#EC8944]" />;
                    default:
                      return <Boxes className="w-4 h-4 text-[#EC8944]" />;
                  }
                };

                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id, n.targetPage, n.targetId)}
                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-start space-x-3 ${
                      !n.isRead ? 'bg-[#FFF2C5]/30' : 'bg-white'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-100 mt-0.5 shrink-0 border border-slate-200">
                      {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#EC8944] shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1.5 block">
                        {n.timestamp}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 self-center" />
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                Tidak ada notifikasi saat ini.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-500">
              Notifikasi disinkronkan langsung dengan sistem persewaan ZielRental
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
