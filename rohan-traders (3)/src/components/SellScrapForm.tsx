import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, CheckCircle2, ArrowLeft, Recycle, MapPin, Loader2, Camera, Image as ImageIcon, X, Upload } from 'lucide-react';
import { SCRAP_CATEGORIES, COMPANY_DETAILS } from '../data/scrapCategories';
import { ScrapRequest } from '../types';

interface SellScrapFormProps {
  initialCategory?: string;
  onBack: () => void;
  onRequestSubmitted: (request: ScrapRequest) => void;
}

export const SellScrapForm: React.FC<SellScrapFormProps> = ({
  initialCategory,
  onBack,
  onRequestSubmitted,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [otherScrapName, setOtherScrapName] = useState('');
  const [itemDetails, setItemDetails] = useState<Record<string, string>>({});
  const [estimatedWeight, setEstimatedWeight] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedRequest, setLastSubmittedRequest] = useState<ScrapRequest | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Automatically calculate total weight whenever item details or selected types change
  useEffect(() => {
    let total = 0;
    let hasValue = false;

    selectedTypes.forEach(t => {
      const text = itemDetails[t] || '';
      const numMatch = text.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) {
        total += parseFloat(numMatch[1]);
        hasValue = true;
      }
    });

    if (hasValue) {
      const formatted = Number(total.toFixed(2));
      setEstimatedWeight(`${formatted} kg`);
    } else {
      setEstimatedWeight('');
    }
  }, [itemDetails, selectedTypes]);

  const handleGetGoogleMapsLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Getting Google Maps location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              setAddress(prev => {
                const cleanPrev = prev.trim();
                const locText = `${data.display_name}\nGoogle Maps Link: ${mapsUrl}`;
                return cleanPrev ? `${cleanPrev}\n\n📍 Google Maps Location:\n${locText}` : locText;
              });
              setLocationStatus('Google Maps current location attached!');
              setIsLocating(false);
              return;
            }
          }
        } catch {
          // Ignore error and use maps link directly
        }

        setAddress(prev => {
          const cleanPrev = prev.trim();
          const locText = `Google Maps Link: ${mapsUrl}`;
          return cleanPrev ? `${cleanPrev}\n\n📍 Google Maps Location:\n${locText}` : locText;
        });
        setLocationStatus('Google Maps link attached!');
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('Permission denied. Please allow location access or type address.');
        } else {
          setLocationStatus('Unable to retrieve location. Please type manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (initialCategory && !selectedTypes.includes(initialCategory)) {
      setSelectedTypes([initialCategory]);
    }
  }, [initialCategory]);

  const toggleType = (typeName: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeName)
        ? prev.filter(t => t !== typeName)
        : [...prev, typeName]
    );
  };

  const getFormattedScrapTypes = () => {
    const types = selectedTypes.length > 0 ? selectedTypes : ['Other Scrap'];
    return types.map(t => {
      const isOther = t.toLowerCase().includes('other');
      let detailText = itemDetails[t]?.trim() || '';
      if (detailText && !detailText.toLowerCase().includes('kg')) {
        detailText = `${detailText} kg`;
      }
      const nameText = isOther && otherScrapName.trim() ? otherScrapName.trim() : '';

      if (nameText && detailText) {
        return `${t}: ${nameText} (${detailText})`;
      } else if (nameText) {
        return `${t}: ${nameText}`;
      } else if (detailText) {
        return `${t} (${detailText})`;
      }
      return t;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          setImageUrl(dataUrl);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return;

    const formattedTypes = getFormattedScrapTypes();

    const newRequest: ScrapRequest = {
      id: 'REQ-' + Date.now().toString().slice(-6),
      name,
      phone,
      address,
      scrapTypes: formattedTypes,
      estimatedWeight: estimatedWeight || 'Not specified',
      preferredDate: preferredDate || 'As soon as possible',
      notes,
      imageUrl: imageUrl || undefined,
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Pending',
    };

    // Save to local storage
    const existing: ScrapRequest[] = JSON.parse(localStorage.getItem('rohan_scrap_requests') || '[]');
    localStorage.setItem('rohan_scrap_requests', JSON.stringify([newRequest, ...existing]));
    localStorage.setItem('rohan_scrap_user_phone', phone);

    setLastSubmittedRequest(newRequest);
    setIsSubmitted(true);
    onRequestSubmitted(newRequest);
  };

  const handleWhatsAppSend = () => {
    const formattedTypes = getFormattedScrapTypes();

    const text = `*New Scrap Pickup Request - ROHAN TRADERS*%0A%0A` +
      `*Name:* ${name || 'N/A'}%0A` +
      `*Phone:* ${phone || 'N/A'}%0A` +
      `*Address:* ${address || 'N/A'}%0A` +
      `*Scrap Items:* ${formattedTypes.join(', ') || 'General Scrap'}%0A` +
      `*Est. Weight:* ${estimatedWeight || 'N/A'} kg%0A` +
      `*Preferred Date:* ${preferredDate || 'Earliest possible'}%0A` +
      `*Notes:* ${notes || 'None'}`;

    window.open(`https://wa.me/${COMPANY_DETAILS.rawPhone}?text=${text}`, '_blank');
  };

  if (isSubmitted && lastSubmittedRequest) {
    return (
      <div className="py-16 bg-slate-50 min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Form Submitted Successfully!
          </h2>
          <span className="block text-sm font-bold text-emerald-600 mb-3">
            (फॉर्म सबमिट हो गया!)
          </span>
          <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed">
            Your pickup request has been received. Team ROHAN TRADERS will call you shortly to arrange doorstep pickup.
            <span className="block text-gray-500 text-xs mt-1">(आपकी अनुरोध प्राप्त हो गया है। रोहन ट्रेडर्स की टीम आपसे जल्द संपर्क करेगी।)</span>
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-2 mb-6 border border-gray-100">
            <p><span className="font-bold text-gray-700">Request ID:</span> {lastSubmittedRequest.id}</p>
            <p><span className="font-bold text-gray-700">Full Name (नाम):</span> {lastSubmittedRequest.name}</p>
            <p><span className="font-bold text-gray-700">Phone (फोन):</span> {lastSubmittedRequest.phone}</p>
            <p><span className="font-bold text-gray-700">Scrap Items (स्क्रैप सामग्री):</span> {lastSubmittedRequest.scrapTypes.join(', ')}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleWhatsAppSend}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Send Message on WhatsApp <span className="text-xs font-normal opacity-90">(व्हाट्सएप पर मैसेज भेजें)</span></span>
            </button>

            <button
              onClick={onBack}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl cursor-pointer transition-colors text-sm"
            >
              Back to Home <span className="text-xs text-gray-500">(होम पर वापस जाएं)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-b from-orange-50/40 via-white to-slate-50 min-h-[85vh] relative overflow-hidden">
      {/* Decorative ambient background blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6 bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm hover:shadow transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home <span className="text-xs text-gray-500">(मुख्य पृष्ठ पर जाएं)</span></span>
        </button>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/0 rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Recycle className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider mb-1">
                Instant Doorstep Pickup
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Sell Your Scrap <span className="text-lg sm:text-xl font-bold text-orange-600">(अपना कबाड़ बेचें)</span>
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name * <span className="text-xs font-normal text-gray-500">(पूरा नाम)</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4.5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 text-sm shadow-2xs transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mobile Number (Call / WhatsApp) * <span className="text-xs font-normal text-gray-500">(मोबाइल नंबर)</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-4.5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 text-sm shadow-2xs transition-all"
              />
            </div>

            {/* Address */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-sm font-bold text-gray-700">
                  Pickup Address * <span className="text-xs font-normal text-gray-500">(पिकअप पता)</span>
                </label>

                <div>
                  <button
                    type="button"
                    onClick={handleGetGoogleMapsLocation}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20 shrink-0 disabled:opacity-50"
                  >
                    {isLocating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                    <span>{isLocating ? 'Detecting Location...' : 'Get Google Maps Location (करंट लोकेशन भेजें)'}</span>
                  </button>
                </div>
              </div>

              <textarea
                required
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter address manually or click 'Get Google Maps Location' above..."
                className="w-full px-4.5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 text-sm shadow-2xs transition-all"
              />

              {locationStatus && (
                <div className="mt-2 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-2xs">
                  <MapPin className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{locationStatus}</span>
                </div>
              )}
            </div>

            {/* Select Scrap Items */}
            <div className="bg-orange-50/40 p-5 rounded-3xl border border-orange-100">
              <label className="block text-sm font-extrabold text-gray-900 mb-2">
                Select Scrap Items <span className="text-xs font-normal text-orange-700">(स्क्रैप चुनें)</span>
              </label>
              <p className="text-xs text-gray-600 mb-4">Click to select multiple items you want to sell:</p>
              
              <div className="flex flex-wrap gap-2.5">
                {SCRAP_CATEGORIES.map(cat => {
                  const isSelected = selectedTypes.includes(cat.name);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleType(cat.name)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-500/30 scale-105 ring-2 ring-orange-500/20'
                          : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200/80 shadow-2xs'
                      }`}
                    >
                      {cat.name}
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </button>
                  );
                })}
              </div>

              {/* Standard Clean Form Input Fields for each selected scrap item */}
              {selectedTypes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-orange-200/60 animate-in fade-in duration-200">
                  {selectedTypes.map(typeName => {
                    const isOther = typeName.toLowerCase().includes('other');
                    return (
                      <div key={typeName} className="space-y-2 bg-white p-4 rounded-2xl border border-orange-100 shadow-2xs">
                        {isOther && (
                          <div className="mb-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Other Scrap Name <span className="text-[11px] font-normal text-gray-500">(अन्य स्क्रैप का नाम)</span>
                            </label>
                            <input
                              type="text"
                              value={otherScrapName}
                              onChange={e => setOtherScrapName(e.target.value)}
                              placeholder="Enter scrap name..."
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 text-xs"
                            />
                          </div>
                        )}
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {typeName} Weight <span className="text-[11px] font-normal text-gray-500">(वजन Kg में)</span>
                        </label>
                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 px-3.5 py-2.5 w-full">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={itemDetails[typeName] || ''}
                            onChange={e => {
                              const val = e.target.value.replace(/[^0-9.]/g, '');
                              const parts = val.split('.');
                              const cleanVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                              setItemDetails(prev => ({ ...prev, [typeName]: cleanVal }));
                            }}
                            placeholder="Enter weight (kg)"
                            style={{
                              width: itemDetails[typeName] ? `${Math.max(1, itemDetails[typeName].length)}ch` : '100%'
                            }}
                            className="bg-transparent focus:outline-none text-gray-900 text-xs font-medium"
                          />
                          {itemDetails[typeName] && (
                            <span className="text-xs font-bold text-orange-600 ml-1 select-none pointer-events-none">
                              kg
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Weight and Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Total Weight <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 ml-1">(कुल अनुमानित वजन)</span>
                </label>
                <input
                  type="text"
                  value={estimatedWeight}
                  readOnly
                  placeholder="Calculated automatically"
                  className="w-full px-4.5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none text-gray-900 text-sm font-bold bg-gray-100/90 cursor-not-allowed select-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Preferred Pickup Date <span className="text-xs font-normal text-gray-500">(पिकअप दिनांक)</span>
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={e => setPreferredDate(e.target.value)}
                  className="w-full px-4.5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 text-sm shadow-2xs"
                />
              </div>
            </div>

            {/* Photo Upload (Optional) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Photo (Optional) <span className="text-xs font-normal text-gray-500">(कबाड़ की फोटो जोड़ें)</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imageUrl ? (
                <div className="relative inline-block mt-2 group">
                  <img
                    src={imageUrl}
                    alt="Scrap Preview"
                    className="w-36 h-36 object-cover rounded-2xl border-2 border-orange-500 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-transform group-hover:scale-110 cursor-pointer"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="block text-[11px] font-bold text-emerald-600 mt-1">
                    ✓ Photo attached successfully
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 border-2 border-dashed border-gray-300 hover:border-orange-500 bg-gray-50/50 hover:bg-orange-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="p-3 bg-orange-100/70 text-orange-600 rounded-full group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-800 group-hover:text-orange-600 block">
                      Click to upload photo
                    </span>
                    <span className="text-xs text-gray-400">
                      Take photo with Camera or choose from Gallery
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Additional Notes (Optional) <span className="text-xs font-normal text-gray-500">(अन्य निर्देश)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Call before arrival, heavy items..."
                className="w-full px-4.5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 text-sm shadow-2xs"
              />
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-95"
              >
                <Send className="w-5 h-5" />
                <span>Submit Request (रिक्वेस्ट भेजें)</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-95"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp Direct</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
