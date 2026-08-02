import React, { useState } from 'react';
import { Phone, MapPin, Mail, X, Banknote, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/scrapCategories';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.176-1.237-6.162-3.486-8.411"/>
  </svg>
);

export const ContactSection: React.FC = () => {
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  return (
    <section className="bg-slate-900 text-white py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          
          {/* Card 1: Phone & WhatsApp */}
          <div 
            onClick={() => setShowOptionsModal(true)}
            className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700/60 shadow-xl hover:border-orange-500/60 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-950/60 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Phone & WhatsApp</h3>
              <p className="text-sm text-gray-400 font-medium mb-3">Tap for Call or WhatsApp options</p>
              
              <div className="text-2xl font-black text-orange-500 group-hover:text-orange-400 transition-colors inline-block text-left mb-6">
                {COMPANY_DETAILS.phone}
              </div>
            </div>
            
            {/* Button to trigger popup */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptionsModal(true);
              }}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer group-hover:scale-[1.01]"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>Contact Options</span>
            </button>
          </div>

          {/* Card 2: Address */}
          <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700/60 shadow-xl hover:border-orange-500/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-orange-950/60 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Our Location</h3>
            <p className="text-sm text-gray-400 font-medium mb-4">Visit our collection yard</p>
            <p className="text-base text-gray-200 leading-relaxed font-medium">
              {COMPANY_DETAILS.address}
            </p>
          </div>

        </div>

        {/* Center Email Link */}
        <div className="flex items-center justify-center gap-3 text-gray-300 hover:text-white transition-colors">
          <Mail className="w-5 h-5 text-orange-400" />
          <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-base sm:text-lg font-medium underline underline-offset-4">
            {COMPANY_DETAILS.email}
          </a>
        </div>

      </div>

      {/* Modal Popup for Contact Options */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 max-w-sm w-full rounded-3xl p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowOptionsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Choose Contact Option</h3>
              <p className="text-xs text-gray-400 mt-1">(संपर्क का तरीका चुनें)</p>
              <p className="text-sm font-semibold text-orange-400 mt-2">{COMPANY_DETAILS.phone}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Option 1: Phone Call Icon with 'Call' text below */}
              <a
                href={`tel:${COMPANY_DETAILS.phone}`}
                onClick={() => setShowOptionsModal(false)}
                className="py-5 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105"
                title="Call Phone"
              >
                <Phone className="w-8 h-8" />
                <span className="text-sm font-bold mt-2">Call</span>
              </a>

              {/* Option 2: WhatsApp Icon with 'Message' text below */}
              <a
                href={`https://wa.me/${COMPANY_DETAILS.rawPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowOptionsModal(false)}
                className="py-5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105"
                title="WhatsApp Chat"
              >
                <WhatsAppIcon className="w-8 h-8" />
                <span className="text-sm font-bold mt-2">Message</span>
              </a>
            </div>

            <button
              onClick={() => setShowOptionsModal(false)}
              className="w-full mt-5 py-2.5 text-xs text-gray-400 hover:text-white transition-colors text-center cursor-pointer font-medium"
            >
              Cancel (रद्द करें)
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
