import React from 'react';
import { ArrowRight, Phone, TrendingUp, Truck, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/scrapCategories';
import cardboardPlasticHero from '../assets/images/cardboard_plastic_scrap_1785643516175.jpg';

interface HeroProps {
  onStartSelling: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartSelling }) => {
  return (
    <section className="relative bg-slate-900 text-white min-h-[580px] lg:min-h-[640px] flex flex-col justify-between overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={cardboardPlasticHero}
          alt="Cardboard and Plastic Scrap"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/25" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-200/90 text-sm font-medium backdrop-blur-md mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>{COMPANY_DETAILS.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Your Trusted Scrap <br />
            <span className="text-orange-500">Buying Partner</span>
            <span className="block text-xl sm:text-2xl font-bold text-gray-300 mt-2 tracking-normal">
              (सभी प्रकार के स्क्रैप के खरीदार)
            </span>
          </h1>

          {/* Paragraph */}
          <p className="text-base sm:text-lg text-gray-200 font-normal leading-relaxed mb-8 max-w-2xl bg-slate-900/40 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            At ROHAN TRADERS, sell all your cardboard boxes, plastic scrap, paper & raddi at guaranteed best market rates with free doorstep pickup.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartSelling}
              className="px-6 sm:px-8 py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-3 cursor-pointer group hover:translate-y-[-2px]"
            >
              <span>Start Selling Scrap</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="px-6 sm:px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-white font-bold rounded-2xl transition-all flex items-center gap-3 cursor-pointer hover:translate-y-[-2px]"
            >
              <Phone className="w-5 h-5 text-orange-400" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </div>

      {/* Feature Highlights Bar at Bottom of Hero */}
      <div className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-orange-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Best Market Rates</h3>
                <p className="text-sm text-gray-400 mt-0.5">Guaranteed top prices for scrap</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-orange-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Free Doorstep Pickup</h3>
                <p className="text-sm text-gray-400 mt-0.5">We collect directly from your location</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-orange-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">100% Trusted</h3>
                <p className="text-sm text-gray-400 mt-0.5">Fair weight & instant spot payment (as per item condition)</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
