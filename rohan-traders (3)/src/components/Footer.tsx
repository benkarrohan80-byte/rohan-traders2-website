import React, { useRef } from 'react';
import { Recycle, User, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/scrapCategories';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'sell' | 'my-info' | 'admin') => void;
  isAdminUnlocked?: boolean;
  onSecretAdminTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, isAdminUnlocked, onSecretAdminTrigger }) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretTrigger = () => {
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
    <footer className="bg-slate-950 border-t border-slate-800 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 text-white p-2.5 rounded-xl">
            <Recycle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span 
              onClick={handleSecretTrigger} 
              className="text-lg font-bold text-white tracking-tight cursor-default select-none"
            >
              {COMPANY_DETAILS.name}
            </span>
            <span className="block text-xs text-gray-500">
              {COMPANY_DETAILS.subtitle}
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Sell Scrap
          </button>
          <button
            onClick={() => setActiveTab('my-info')}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5 text-orange-400" /> My Info
          </button>

          {isAdminUnlocked && (
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-emerald-400 text-emerald-500 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
            </button>
          )}
        </div>

      </div>
    </footer>
  );
};


