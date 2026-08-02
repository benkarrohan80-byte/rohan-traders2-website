import React from 'react';
import { ArrowRight, Recycle } from 'lucide-react';

interface BottomCTAProps {
  onStartSelling: () => void;
}

export const BottomCTA: React.FC<BottomCTAProps> = ({ onStartSelling }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/30 py-16 px-4 text-center border-t border-slate-800/80">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto flex flex-col items-center justify-center relative z-10">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onStartSelling();
          }}
          className="inline-flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 border border-orange-400/40 active:scale-95 text-white font-black text-base sm:text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
        >
          <Recycle className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-500" />
          <span>Sell Your Scrap Now</span>
          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};



