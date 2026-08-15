import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from './ToastContainer';
import { WithdrawalModal } from '../modals/WithdrawalModal';
import { WithdrawalReceiptModal } from '../modals/WithdrawalReceiptModal';
import { DocumentUploadModal } from '../modals/DocumentUploadModal';
import { DocumentPreviewModal } from '../modals/DocumentPreviewModal';
import { ProfitShareDetailModal } from '../modals/ProfitShareDetailModal';
import { NotificationDrawer } from '../modals/NotificationDrawer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div id="app-shell-root" className="min-h-screen bg-slate-100/70 text-slate-900 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Sticky Topbar / Header */}
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col justify-between">
          <div className="flex-1">
            {children}
          </div>
          {/* Footer Component */}
          <Footer />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <WithdrawalModal />
      <WithdrawalReceiptModal />
      <DocumentUploadModal />
      <DocumentPreviewModal />
      <ProfitShareDetailModal />
      <NotificationDrawer />
      <ToastContainer />
    </div>
  );
};
