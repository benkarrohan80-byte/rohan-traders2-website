import React, { useRef } from 'react';
import { Recycle, User, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/scrapCategories';

interface HeaderProps {
  activeTab: 'home' | 'sell' | 'my-info' | 'admin';
  setActiveTab: (tab: 'home' | 'sell' | 'my-info' | 'admin') => void;
  isAdminUnlocked?: boolean;
  onSecretAdminTrigger?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminUnlocked,
  onSecretAdminTrigger
}) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    setActiveTab('home');
    
    // Secret 3-click trigger to prompt admin PIN
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (onSecretAdminTrigger) {
        onSecretAdminTrigger();
      }
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1200);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="bg-orange-500 text-white p-2.5 rounded-2xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Recycle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none group-hover:text-orange-600 transition-colors">
              {COMPANY_DETAILS.name}
            </h1>
            <p className="text-xs font-medium text-gray-500 mt-0.5 tracking-wide">
              {COMPANY_DETAILS.subtitle}
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-orange-50 text-orange-600 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'sell'
                ? 'bg-orange-50 text-orange-600 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Sell Scrap
          </button>

          <button
            onClick={() => setActiveTab('my-info')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my-info'
                ? 'bg-orange-50 text-orange-600 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" /> My Info
          </button>

          {/* Admin Tab (Only visible when unlocked for Admin) */}
          {isAdminUnlocked && (
            <button
              onClick={() => setActiveTab('admin')}
              title="Admin Panel"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-gray-900 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

