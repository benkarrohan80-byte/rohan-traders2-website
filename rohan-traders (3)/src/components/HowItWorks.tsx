import React from 'react';
import { ClipboardList, PhoneCall, Truck, Banknote, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartSelling?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartSelling }) => {
  const steps = [
    {
      step: '01',
      title: 'Pickup Information',
      hindiTitle: '(पिकअप जानकारी)',
      description: 'Submit your name, phone, address and scrap details online.',
      icon: ClipboardList,
      isClickable: true,
      accentColor: 'from-orange-500/10 to-amber-500/5',
      badgeBg: 'bg-orange-500/10 text-orange-700',
    },
    {
      step: '02',
      title: 'Call & Confirmation',
      hindiTitle: '(मैं आपको कॉल करूँगा)',
      description: 'I will personally call you to confirm the pickup time and offer the best rates.',
      icon: PhoneCall,
      accentColor: 'from-blue-500/10 to-cyan-500/5',
      badgeBg: 'bg-blue-500/10 text-blue-700',
    },
    {
      step: '03',
      title: 'Free Doorstep Pickup',
      hindiTitle: '(डोरस्टेप पिकअप)',
      description: 'Scrap is collected and weighed accurately right at your doorstep.',
      icon: Truck,
      accentColor: 'from-emerald-500/10 to-teal-500/5',
      badgeBg: 'bg-emerald-500/10 text-emerald-700',
    },
    {
      step: '04',
      title: 'Instant Spot Payment',
      description: 'Get immediate cash or UPI payment on the spot upon weighing (based on scrap quality & condition).',
      icon: Banknote,
      accentColor: 'from-violet-500/10 to-purple-500/5',
      badgeBg: 'bg-violet-500/10 text-violet-700',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50/40 via-white to-white relative overflow-hidden">
      {/* Decorative background blur blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-extrabold uppercase tracking-widest mb-3">
            Simple & Transparent Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            How It Works <span className="block text-xl sm:text-2xl text-orange-600 font-bold mt-1">(कैसे काम करता है)</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 font-medium">
            Sell your scrap in 4 quick & easy steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => {
                  if (item.isClickable && onStartSelling) {
                    onStartSelling();
                  }
                }}
                className={`relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/80 transition-all duration-300 group flex flex-col justify-between overflow-hidden ${
                  item.isClickable
                    ? 'hover:border-orange-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ring-2 ring-orange-500/20'
                    : 'hover:border-orange-200 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Background decorative gradient layer */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accentColor} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                {/* Subtle large background step watermark */}
                <div className="absolute -bottom-6 -right-4 text-8xl font-black text-gray-100/60 group-hover:text-orange-500/10 transition-colors select-none pointer-events-none">
                  {item.step}
                </div>

                <div className="relative z-10">
                  {/* Step badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.badgeBg}`}>
                      Step {item.step}
                    </span>
                  </div>

                  {/* Step Title & Description */}
                  <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">
                    {item.title} {item.hindiTitle && <span className="block text-xs font-semibold text-orange-600 mt-0.5">{item.hindiTitle}</span>}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.isClickable && (
                  <div className="relative z-10 mt-6 pt-4 border-t border-orange-100/80 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
                    <span>Fill Info Form (जानकारी भरें)</span>
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
