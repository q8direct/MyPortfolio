import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import AssetsTable from './components/assets/AssetsTable';
import CoinsPage from './pages/CoinsPage';
import ChartPage from './pages/ChartPage';
import GridBotsPage from './pages/GridBotsPage';
import MainLayout from './components/layout/MainLayout';

function AppContent() {
  const { user, loading } = useAuth();
  const path = window.location.pathname;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return path === '/register' ? <RegistrationForm /> : <LoginForm />;
  }

  return (
    <MainLayout>
      {path === '/coins' ? (
        <CoinsPage />
      ) : path === '/chart' ? (
        <ChartPage />
      ) : path === '/grid-bots' ? (
        <GridBotsPage />
      ) : (
        <AssetsTable />
      )}
    </MainLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}