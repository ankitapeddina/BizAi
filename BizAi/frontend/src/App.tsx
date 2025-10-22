import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/Navigation';
import { ChatBot } from './components/ChatBot';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { AppointmentPage } from './pages/AppointmentPage';

type Page = 'home' | 'dashboard' | 'partnership' | 'appointment';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'partnership':
        return <PartnershipPage />;
      case 'appointment':
        return <AppointmentPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navigation currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as Page)} />
        {renderPage()}
        <ChatBot />
      </div>
    </ThemeProvider>
  );
}

export default App;
