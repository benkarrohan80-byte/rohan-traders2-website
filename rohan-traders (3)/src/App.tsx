import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { HowItWorks } from './components/HowItWorks';
import { ContactSection } from './components/ContactSection';
import { SellScrapForm } from './components/SellScrapForm';
import { AdminDashboard } from './components/AdminDashboard';
import { MyInfoView } from './components/MyInfoView';
import { AdminLoginPage } from './components/AdminLoginPage';
import { ScrapRequest } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'sell' | 'my-info' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('rohan_scrap_admin_unlocked') === 'true';
  });

  // Global secret keyboard listener: Ctrl + Shift + A to open Admin Login page directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Also check URL parameter ?admin=true
    if (window.location.search.includes('admin=true')) {
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Inactivity timeout for admin session security (15 minutes)
  useEffect(() => {
    if (!isAdminUnlocked) return;

    let inactivityTimer: any;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleAdminLogout();
        alert('Admin session expired due to inactivity. Logged out securely.');
      }, 15 * 60 * 1000); // 15 minutes
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAdminUnlocked]);

  const handleTabChange = (tab: 'home' | 'sell' | 'my-info' | 'admin') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartSelling = () => {
    setSelectedCategory(undefined);
    setActiveTab('sell');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveTab('sell');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestSubmitted = (request: ScrapRequest) => {
    // Optionally automatically redirect or set state
  };

  const handleAdminAuthSuccess = () => {
    sessionStorage.setItem('rohan_scrap_admin_unlocked', 'true');
    setIsAdminUnlocked(true);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('rohan_scrap_admin_unlocked');
    setIsAdminUnlocked(false);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 antialiased selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isAdminUnlocked={isAdminUnlocked}
        onSecretAdminTrigger={() => {
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Body based on tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero onStartSelling={handleStartSelling} />
            <CategoriesSection onSelectCategory={handleSelectCategory} />
            <HowItWorks onStartSelling={handleStartSelling} />
            <ContactSection />
          </>
        )}

        {activeTab === 'sell' && (
          <SellScrapForm
            initialCategory={selectedCategory}
            onBack={() => setActiveTab('home')}
            onRequestSubmitted={handleRequestSubmitted}
          />
        )}

        {activeTab === 'my-info' && (
          <MyInfoView
            onBack={() => setActiveTab('home')}
            onGoToSell={handleStartSelling}
          />
        )}

        {activeTab === 'admin' && (
          isAdminUnlocked ? (
            <AdminDashboard onLogout={handleAdminLogout} />
          ) : (
            <AdminLoginPage
              onLoginSuccess={handleAdminAuthSuccess}
              onCancel={() => setActiveTab('home')}
            />
          )
        )}
      </main>
    </div>
  );
}

