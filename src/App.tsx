import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/common/AppShell';
import { DashboardView } from './components/views/DashboardView';
import { AssetsView } from './components/views/AssetsView';
import { UnitDetailView } from './components/views/UnitDetailView';
import { PerformanceView } from './components/views/PerformanceView';
import { ProfitShareView } from './components/views/ProfitShareView';
import { CashflowView } from './components/views/CashflowView';
import { WithdrawalView } from './components/views/WithdrawalView';
import { DocumentsView } from './components/views/DocumentsView';
import { LoginView } from './components/views/LoginView';

const MainContent: React.FC = () => {
  const { currentPage } = useApp();

  if (currentPage === 'login') {
    return <LoginView />;
  }

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView />;
      case 'assets':
        return <AssetsView />;
      case 'unit-detail':
        return <UnitDetailView />;
      case 'performance':
        return <PerformanceView />;
      case 'profit-share':
      case 'profit-share-detail':
        return <ProfitShareView />;
      case 'cashflow':
        return <CashflowView />;
      case 'withdrawal':
      case 'withdrawal-history':
        return <WithdrawalView />;
      case 'documents':
        return <DocumentsView />;
      default:
        return <DashboardView />;
    }
  };

  return <AppShell>{renderCurrentView()}</AppShell>;
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
